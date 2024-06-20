from flask import Flask
from flask_cors import CORS
from .models import db
from .routes import app_routes
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost/music-app-testing-db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024
    app.secret_key = os.getenv('JWT_SECRET_KEY')

    # Register routes
    app.register_blueprint(app_routes)

    # Intialize the Database
    db.init_app(app)

    with app.app_context():
        db.create_all()
    return app
