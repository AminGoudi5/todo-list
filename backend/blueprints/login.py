from flask import jsonify,Blueprint,request,session
import hashlib
from extentions import db
from models.User import User
from sqlalchemy import and_


login=Blueprint('login_blueprint',__name__)

# @login.route('/')
# def home():
#     return render_template('login.html')

@login.route('/register', methods=["POST"])
def register():
    data=request.get_json()
    username = data.get("username")
    password = data.get("password")
    password2 = data.get("password2")
    
    if not username or not password or not password2:
        return jsonify({"error": "Missing required fields"}), 400
    
    if password !=password2 :
        return jsonify({"error": "Passwords do not match"}), 400
    
    check_user=User.query.filter(User.user_name == username).first()
    
    if check_user  :   
        return jsonify({"error": "Username already exists"}), 409
    
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    new_user=User(user_name=username,password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    
    session["login"] = username
    return jsonify({"message": "User registered successfully"}), 201

@login.route('/login', methods=["POST"])
def do_login():
    data=request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    
    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = User.query.filter(and_(User.user_name == username, User.password == hashed_pw)).first()
    
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    session["login"] = username
    return jsonify({"message": "Login successful", "username": username}), 200


