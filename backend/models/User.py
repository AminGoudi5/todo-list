from extentions import db
from datetime import datetime

class User(db.Model):
    __tablename__='users'
    id=db.Column(db.Integer,autoincrement=True)
    user_name=db.Column(db.String(50),nullable=False)
    password=db.Column(db.String(200),nullable=False)
    contact=db.relationship('Contact',back_populates='user',uselist=False)
    tasks=db.relationship('Task',back_populates='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
   
    __table_args__=(
        db.PrimaryKeyConstraint('id',name='pk_id'),
        db.UniqueConstraint('user_name',name='unique_username'),
        db.Index('index1','user_name','password')
    )
    
    
