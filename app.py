from flask import Flask, render_template, redirect, url_for, flash, request, abort, session, make_response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from bson.objectid import ObjectId
from config import ProductionConfig, DevelopmentConfig
import os

# Initialize Flask app and config
app = Flask(__name__)
# Use ProductionConfig when FLASK_ENV is production
if os.environ.get('FLASK_ENV') == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

# Set up MongoDB, bcrypt, and login manager
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'signin'
login_manager.login_message_category = 'info'

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
    user_data = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    return User(user_data) if user_data else None

# Helper function to set no-cache headers
def set_no_cache_headers(response):
    response.headers['Cache-Control'] = 'no-store'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

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
        name = request.form.get('name')
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Check if username or email already exists
        if mongo.db.users.find_one({'username': username}) or mongo.db.users.find_one({'email': email}):
            flash('Username or email already registered. Please choose different ones.', 'danger')
            return redirect(url_for('signup'))
        
        # Insert user data with username and email
        mongo.db.users.insert_one({
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
        username = request.form.get('username')
        password = request.form.get('password')
        
        user_data = mongo.db.users.find_one({'username': username})
        
        if not user_data:
            # If the username is not found, flash an info message and redirect to sign-up
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

# Logout Route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('signin'))

# Teacher Route
@app.route('/teacher')
@login_required
def teacher():
    if not current_user.is_teacher:
        abort(403)
    response = make_response(render_template('teacher.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/teacher/assignment_result')
@login_required
def assignment_result():
    response = make_response(render_template('assignments.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/teacher/performance_prediction')
@login_required
def performance_prediction():
    response = make_response(render_template('performancePrediction.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

# Student Route
@app.route('/student')
@login_required
def student():
    response = make_response(render_template('student.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses')
@login_required
def courses():
    response = make_response(render_template('courses.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

# Further student course routes here...
# For example:
@app.route('/student/courses/webDev')
@login_required
def webDev():
    response = make_response(render_template('webDev.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/SQL')
@login_required
def SQL():
    response = make_response(render_template('SQL.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/powerBI')
@login_required
def powerBI():
    response = make_response(render_template('powerBI.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/DSA')
@login_required
def DSA():
    response = make_response(render_template('DSA.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/python')
@login_required
def python():
    response = make_response(render_template('python.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/java')
@login_required
def java():
    response = make_response(render_template('java.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/mongoDB')
@login_required
def mongoDB():
    response = make_response(render_template('mongoDB.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/courses/machineLearning')
@login_required
def machineLearning():
    response = make_response(render_template('machineLearning.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/assignments')
@login_required
def assignments():
    response = make_response(render_template('assignment.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

@app.route('/student/study_material')
@login_required
def study_material():
    response = make_response(render_template('studyMaterial.html', username=current_user.username, email=current_user.email, name=current_user.name))
    return set_no_cache_headers(response)

# Error Handling Routes
@app.errorhandler(403)
def forbidden(e):
    return render_template('403.html'), 403

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
