from flask import Flask, render_template, redirect, url_for, flash, request, abort, session, jsonify, make_response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from bson.objectid import ObjectId
from config import ProductionConfig, DevelopmentConfig
import os
import requests
import numpy as np
import pandas as pd
from tensorflow.lite.python.interpreter import Interpreter
import pickle
from datetime import datetime
import tempfile
import logging

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app and config
app = Flask(__name__)
# Use ProductionConfig when FLASK_ENV is production
if os.environ.get('FLASK_ENV') == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

# Set up MongoDB, bcrypt, and login manager
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
mongo_client = PyMongo(app)

auth_db = mongo_client.cx["auth_db"]  # Authentication database
course_db = mongo_client.cx["course_db"]  # Course management database
prediction_db = mongo_client.cx["prediction_db"]  # Prediction database

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'signin'
login_manager.login_message_category = 'info'

# Global variables
interpreter = None
scaler = None

def download_file(url, suffix):
    """
    Downloads a file from a URL and saves it to a temporary location.
    Returns the file path.
    """
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            return temp_file.name
    except Exception as e:
        logger.error(f"Failed to download file from {url}: {str(e)}")
        raise


def load_tflite_model(model_path):
    """
    Loads the TensorFlow Lite model into an interpreter.
    """
    try:
        interpreter = Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        logger.info("TensorFlow Lite model loaded successfully.")
        return interpreter
    except Exception as e:
        logger.error(f"Failed to load TensorFlow Lite model: {str(e)}")
        raise


def load_scaler(scaler_path):
    """
    Loads the scaler from a file.
    """
    try:
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        logger.info("Scaler loaded successfully.")
        return scaler
    except Exception as e:
        logger.error(f"Failed to load scaler: {str(e)}")
        raise


def initialize_model_and_scaler():
    """
    Initializes the TensorFlow Lite model and scaler by downloading them from the configured URLs.
    """
    global interpreter, scaler
    try:
        model_path = download_file(app.config['MODEL_URL'], '.tflite')
        scaler_path = download_file(app.config['SCALER_URL'], '.pkl')

        interpreter = load_tflite_model(model_path)
        scaler = load_scaler(scaler_path)

        # Clean up temporary files
        os.unlink(model_path)
        os.unlink(scaler_path)
    except Exception as e:
        logger.critical(f"Failed to initialize model or scaler: {str(e)}")
        raise


def predict_with_tflite(interpreter, input_data):
    """
    Runs a prediction using the TensorFlow Lite interpreter.
    """
    try:
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # Prepare input tensor
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()

        # Get the prediction
        prediction = interpreter.get_tensor(output_details[0]['index'])
        return prediction[0][0]
    except Exception as e:
        logger.error(f"Prediction with TensorFlow Lite failed: {str(e)}")
        return None

# User model
class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']
        self.email = user_data.get('email')
        self.name = user_data.get('name')
        self.is_teacher = user_data.get('is_teacher', False)

# Load user
@login_manager.user_loader
def load_user(user_id):
    user_data = auth_db.users.find_one({'_id': ObjectId(user_id)})
    return User(user_data) if user_data else None

# Home Page Route
@app.route('/')
def home():
    return render_template('index.html')

# About Page Route
@app.route('/about')
def about():
    return render_template('aboutProject.html')

# Contributors Page Route
@app.route('/contributors')
def contributors():
    return render_template('contributors.html')

# Sign Up Route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        
        # Validate reCAPTCHA
        recaptcha_response = request.form.get('g-recaptcha-response')
        secret_key = app.config['RECAPTCHA_SECRET_KEY']
        verify_url = 'https://www.google.com/recaptcha/api/siteverify'
        payload = {'secret': secret_key, 'response': recaptcha_response}
        response = requests.post(verify_url, data=payload).json()

        if not response.get('success'):
            flash('Please verify the CAPTCHA.', 'danger')
            return redirect(url_for('signup'))
        
        name = request.form.get('name')
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        if auth_db.users.find_one({'username': username}) or auth_db.users.find_one({'email': email}):
            flash('Username or email already registered. Please choose different ones.', 'danger')
            return redirect(url_for('signup'))
                    
        auth_db.users.insert_one({
            'name': name,
            'username': username,
            'email': email,
            'password': hashed_password,
            'is_teacher': False
        })

        flash('Account created! You can now sign in.', 'success')
        return redirect(url_for('signin'))

    return render_template('signup.html')

# Sign In Route
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':

        # Validate reCAPTCHA
        recaptcha_response = request.form.get('g-recaptcha-response')
        secret_key = app.config['RECAPTCHA_SECRET_KEY']
        verify_url = 'https://www.google.com/recaptcha/api/siteverify'
        payload = {'secret': secret_key, 'response': recaptcha_response}
        response = requests.post(verify_url, data=payload).json()

        if not response.get('success'):
            flash('Please verify the CAPTCHA.', 'danger')
            return redirect(url_for('signin'))
        
        username = request.form.get('username')
        password = request.form.get('password')
        
        user_data = auth_db.users.find_one({'username': username})
        
        if not user_data:
            flash('Username not registered. Please sign up first.', 'info')
            return redirect(url_for('signup'))
        
        # If username exists but password is incorrect, flash a danger message
        if not bcrypt.check_password_hash(user_data['password'], password):
            flash('Incorrect password. Please try again.', 'danger')
            return redirect(url_for('signin'))
        
        # If both username and password are correct, log the user in
        user = User(user_data)
        login_user(user)
        
        # Explicit redirection based on user type
        if user.is_teacher:
            return redirect(url_for('teacher'))
        else:
            return redirect(url_for('student'))
    
    return render_template('signin.html')

# Forgot Password Route
@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        
        user = auth_db.users.find_one({'email': email})
        
        if user:
            # If the email is found, redirect to reset password page
            return redirect(url_for('reset_password', email=email))
        else:
            flash('Email not registered. Please check your email or sign up.', 'danger')
    
    return render_template('forgotPassword.html')


# Reset Password Route
@app.route('/reset_password/<email>', methods=['GET', 'POST'])
def reset_password(email):
    
    user = auth_db.users.find_one({'email': email})
    
    if not user:
        flash('No user found with that email address.', 'danger')
        return redirect(url_for('forgot_password'))

    if request.method == 'POST':
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        
        if new_password != confirm_password:
            flash('Passwords do not match. Please try again.', 'danger')
            return redirect(url_for('reset_password', email=email))

        # Hash the new password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        # Update the password in the database
        auth_db.users.update_one({'email': email}, {'$set': {'password': hashed_password}})
        
        flash('Your password has been updated successfully!', 'success')
        return redirect(url_for('signin'))

    return render_template('resetPassword.html', email=email)

# Teacher Route
@app.route('/teacher')
@login_required
def teacher():
    if not current_user.is_teacher:
        abort(403)
    return render_template('teacher.html', username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/teacher/assignment_result')
@login_required
def assignment_result():
    return render_template('assignments.html', username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/teacher/performance_prediction')
@login_required
def performance_prediction():
    return render_template('performancePrediction.html', username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles predictions from form submissions.
    """
    try:
        # Retrieve and validate form data
        name = request.form['name']
        age = int(request.form['age'])
        year1_marks = float(request.form['year1_marks'])
        year2_marks = float(request.form['year2_marks'])
        studytime = float(request.form['study_time'])
        failures = int(request.form['failures'])

        if not (0 <= age <= app.config['MAX_AGE']):
            raise ValueError(f"Age must be between 0 and {app.config['MAX_AGE']}")
        if not (0 <= year1_marks <= 100):
            raise ValueError("Year 1 marks must be between 0 and 100")
        if not (0 <= year2_marks <= 100):
            raise ValueError("Year 2 marks must be between 0 and 100")
        if not (0 <= studytime <= app.config['MAX_STUDY_HOURS']):
            raise ValueError(f"Study time must be between 0 and {app.config['MAX_STUDY_HOURS']}")
        if not (0 <= failures <= app.config['MAX_FAILURES']):
            raise ValueError(f"Failures must be between 0 and {app.config['MAX_FAILURES']}")

        # Prepare input data for prediction
        input_data = pd.DataFrame({
            'age': [age],
            'year1_marks': [year1_marks],
            'year2_marks': [year2_marks],
            'studytime': [studytime],
            'failures': [failures]
        })

        scaled_data = scaler.transform(input_data)
        scaled_data = scaled_data.astype(np.float32)

        # Run the prediction
        prediction = predict_with_tflite(interpreter, scaled_data)
        if prediction is None:
            return jsonify({'error': 'Prediction failed'}), 500

        # Cap the prediction score to the max allowed value
        capped_prediction = min(round(float(prediction), 2), app.config['MAX_PREDICTION_SCORE'])

        # Prepare data for MongoDB
        data = {
            'name': name,
            'age': age,
            'year1_marks': year1_marks,
            'year2_marks': year2_marks,
            'study_time': studytime,
            'failures': failures,
            'predicted_score': capped_prediction,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Save prediction data to MongoDB
        collection = prediction_db.student_performance_data
        collection.insert_one(data)

        return jsonify({'prediction': capped_prediction})
    except KeyError:
        return jsonify({'error': 'Missing required field'}), 400
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Initialize model and scaler at startup
initialize_model_and_scaler()

# Student Route
@app.route('/student')
@login_required
def student():
    return render_template('student.html', username=current_user.username, email=current_user.email, name=current_user.name)

# Fetch all enrolled courses for the logged-in student
@app.route('/api/courses', methods=['GET'])
@login_required
def get_courses():
    courses = course_db.enrollments.find({"user_id": ObjectId(current_user.id)})
    course_list = [course["course_name"] for course in courses]
    return {"courses": course_list}

# Enroll in a course for the logged-in student
@app.route('/api/courses', methods=['POST'])
@login_required
def add_course():
    data = request.json
    course_name = data.get('course_name')
    if not course_db.enrollments.find_one({"user_id": ObjectId(current_user.id), "course_name": course_name}):
        course_db.enrollments.insert_one({
            "user_id": ObjectId(current_user.id),
            "course_name": course_name
        })
        return {"message": f"{course_name} enrolled successfully"}, 201

    return {"error": f"Already enrolled in {course_name}"}, 400

# Disenroll a course for the logged-in user
@app.route('/api/courses/<course_name>', methods=['DELETE'])
@login_required
def delete_course(course_name):
    result = course_db.enrollments.delete_one({
        "user_id": ObjectId(current_user.id),
        "course_name": course_name
    })

    if result.deleted_count > 0:
        return {"message": f"Disenrolled from {course_name}"}
    return {"error": f"Failed to disenroll from {course_name}"}, 400

@app.route('/student/courses')
@login_required
def courses():
    return render_template('courses.html', username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/webDev')
@login_required
def webDev():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('webDev.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/SQL')
@login_required
def SQL():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('SQL.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/powerBI')
@login_required
def powerBI():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('powerBI.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/DSA')
@login_required
def DSA():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('DSA.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/python')
@login_required
def python():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('python.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/java')
@login_required
def java():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('java.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/mongoDB')
@login_required
def mongoDB():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('mongoDB.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/courses/machineLearning')
@login_required
def machineLearning():
    # Get URL parameters
    show_content = request.args.get('showcontent', '')
    hide_content = request.args.get('hide', '')
    # Pass parameters to the HTML template
    return render_template('machineLearning.html', show_content=show_content, hide_content=hide_content, username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/assignments')
@login_required
def assignments():
    return render_template('assignment.html', username=current_user.username, email=current_user.email, name=current_user.name)

@app.route('/student/study_material')
@login_required
def study_material():
    return render_template('studyMaterial.html', username=current_user.username, email=current_user.email, name=current_user.name)

# Logout Route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('signin'))

# Error Handling Routes
@app.errorhandler(403)
def forbidden(e):
    return render_template('403.html'), 403

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
