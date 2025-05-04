from flask import Flask
from config import *
from extentions import db
from flask_cors import CORS
import os
from blueprints.login import login
from blueprints.panel import panel


app = Flask(__name__)
app.secret_key =os.environ.get('SECRET_KEY', 'fallback-secret')


db_user = os.environ.get("MYSQLUSER")
db_password = os.environ.get("MYSQLPASSWORD")
db_host = os.environ.get("MYSQLHOST")
db_port = os.environ.get("MYSQLPORT")
db_name = os.environ.get("MYSQL_DATABASE")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False




CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all() 

app.register_blueprint(login,url_prefix="/api")
app.register_blueprint(panel,url_prefix="/api")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

