from flask import Flask
from config import *
from extentions import db
from flask_cors import CORS
import os
from blueprints.login import login
from blueprints.panel import panel


app = Flask(__name__)
app.secret_key =os.environ.get('SECRET_KEY', 'fallback-secret')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ['MYSQL_CONFIG']
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False




CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all() 

app.register_blueprint(login,url_prefix="/api")
app.register_blueprint(panel,url_prefix="/api")

if __name__ == '__main__':
    app.run(debug=True, port=PORT)
