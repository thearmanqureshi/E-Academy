import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MONGO_AUTH_URL = os.environ.get('MONGO_AUTH_URL')
    MONGO_COURSE_URL = os.environ.get('MONGO_COURSE_URL')
    MONGO_PREDICTION_URL = os.environ.get('MONGO_PREDICTION_URL')
    RECAPTCHA_SECRET_KEY = os.environ.get('RECAPTCHA_SECRET_KEY')
    MODEL_URL = os.getenv('MODEL_URL')
    SCALER_URL = os.getenv('SCALER_URL')
    SESSION_COOKIE_SECURE = True
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    MAX_PREDICTION_SCORE = 98
    MAX_AGE = 100
    MAX_STUDY_HOURS = 24
    MAX_FAILURES = 10
    
class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = True
    SESSION_COOKIE_SECURE = False
