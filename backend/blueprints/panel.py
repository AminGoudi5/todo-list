from flask import Blueprint, request, jsonify, session
from sqlalchemy import func, desc
from extentions import db
from functions import get_user
from models.User import User
from models.Task import Task
from models.Contact import Contact

panel = Blueprint("panel_blueprint", __name__)
@panel.route('/home-data')
def home_data():
    new_users = db.session.query(User.user_name, User.created_at).order_by(User.created_at.desc()).limit(5).all()
    top_users = db.session.query(
        User.user_name, Contact.city, func.count(Task.id).label("task_count")
    ).join(Task).outerjoin(Contact).group_by(User.id).order_by(desc("task_count")).limit(5).all()

    return jsonify({
        "new_users": [{"user_name": u[0], "created_at": u[1]} for u in new_users],
        "top_users": [{"user_name": u[0], "city": u[1], "task_count": u[2]} for u in top_users],
    })

@panel.route("/tasks")
def home():
    user = get_user()
    if not user:
        return jsonify({"status": "nologin"}), 401

    tasks = [{"id": t.id, "description": t.descripton} for t in user.tasks]
    contact = {"phone": user.contact.phone, "city": user.contact.city} if user.contact else {}

    return jsonify({
        "status": "ok",
        "user": user.user_name,
        "tasks": tasks,
        "contact": contact
    })


@panel.route("/add", methods=["POST"])
def add():
    user = get_user()
    if not user:
        return jsonify({"status": "nologin"}), 401

    data=request.get_json()
    description = data.get("description")
    if not description:
        return jsonify({"status": "error", "message": "Missing description"}), 400

    task = Task(descripton=description)

    user.tasks.append(task)
    db.session.add(task)
    db.session.commit()

    return jsonify({"status": "ok", "task_id": task.id})


@panel.route("/remove", methods=["POST"])
def remove():
    user = get_user()
    if not user:
        return jsonify({"status": "nologin"}), 401
    data = request.get_json()
    task_id = data.get("id")
    if not task_id:
        return jsonify({"status": "error", "message": "Missing task ID"}), 400
    
    Task.query.filter(Task.id == task_id).delete()
 
    db.session.commit()

    return jsonify('{"status":"ok"}')


@panel.route("/edit", methods=["POST"])
def edit():
    user = get_user()
    if not user:
        return jsonify({"status": "nologin"}), 401
    
    data = request.get_json()
    task_id = data.get("id")
    description = data.get("description")

    if not task_id or not description:
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    task = Task.query.filter_by(id=task_id).first()
    if not task:
        return jsonify({"status": "error", "message": "Task not found"}), 404

    task.descripton = description

    db.session.commit()

    return jsonify({"status": "ok"})


@panel.route("/edit-contact", methods=["POST"])
def edit_contact():
    user = get_user()
    if not user:
        return jsonify({"status": "nologin"}), 401

    data = request.get_json()
    phone = data.get("phone")
    city = data.get("city")

    if not phone or not city:
        return jsonify({"status": "error", "message": "Missing contact info"}), 400

    if user.contact:
        user.contact.phone = phone
        user.contact.city = city
    else:
        contact = Contact(phone=phone, city=city)
        user.contact = contact
        db.session.add(contact)

    db.session.commit()

    return jsonify({"status": "ok"})



