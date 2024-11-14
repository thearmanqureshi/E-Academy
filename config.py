import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://thearmanqureshi:Aq-000000@eacademycluster.ffwym.mongodb.net/userLogin?retryWrites=true&w=majority')
