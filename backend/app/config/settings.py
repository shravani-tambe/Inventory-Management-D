import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration shared by all environments."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

class DevelopmentConfig(Config):
    """Configuration for local development."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_ECHO = True  # Prints every SQL query to terminal — helpful for learning

class ProductionConfig(Config):
    """Configuration for deployment."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}