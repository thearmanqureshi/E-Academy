from flask import Flask, render_template, redirect, url_for, flash, request, abort
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from bson.objectid import ObjectId
from config import Config  # Import Config class

# Initialize Flask app and config
app = Flask(__name__)
app.config.from_object(Config)  # Load configuration from config.py

# Set up MongoDB, bcrypt, and login manager
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

# User model
class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']
        self.email = user_data.get('email')
        self.name = user_data.get('name')
        self.is_admin = user_data.get('is_admin', False)

# Load user
@login_manager.user_loader
def load_user(user_id):
    user_data = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    return User(user_data) if user_data else None

# Home Page Route
@app.route('/')
def home():
    return render_template('home.html')

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
            'is_admin': False
        })
        flash('Account created! You can now log in.', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html')

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user_data = mongo.db.users.find_one({'username': username})
        if user_data and bcrypt.check_password_hash(user_data['password'], password):
            user = User(user_data)
            login_user(user)
            return redirect(url_for('admin' if user.is_admin else 'user_dashboard'))
        else:
            flash('Login unsuccessful. Please check username and password.', 'danger')
    return render_template('login.html')

# Admin Route
@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        abort(403)
    return render_template('admin.html', username=current_user.username, email=current_user.email, name=current_user.name)

# User Dashboard Route
@app.route('/dashboard')
@login_required
def user_dashboard():
    return render_template('dashboard.html', username=current_user.username, email=current_user.email, name=current_user.name)

# Logout Route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

# Error Handling Routes
@app.errorhandler(403)
def forbidden(e):
    return render_template('403.html'), 403

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
