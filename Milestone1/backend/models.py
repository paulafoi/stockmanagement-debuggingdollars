from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from sqlalchemy.schema import Identity

db = SQLAlchemy()

user_id_seq = Sequence('user_id_seq', metadata=db.metadata)

class USERS(db.Model):
    __tablename__ = 'USERS'
    USERID = db.Column(db.Integer, server_default=user_id_seq.next_value(), primary_key=True)
    USERNAME = db.Column(db.String(20), nullable=False, unique=True)
    PASSWORD = db.Column(db.String(255), nullable=False)

    # Relationship to link users to their portfolios (stocks)
    stocks = db.relationship('USER_STOCKS', backref='USERS')

    def dict(self):
        return {
            'user_id': self.USERID,
            'username': self.USERNAME,
            'password': self.PASSWORD
        }

class USER_STOCKS(db.Model):  
    __tablename__ = 'USER_STOCKS'
    USERID = db.Column(db.Integer, db.ForeignKey('USERS.USERID'), primary_key=True)  
    STOCKSYMBOL = db.Column(db.String(10), primary_key=True) 
    QUANTITY = db.Column(db.Integer, nullable=False)

    def dict(self):
        return {
            'user_id': self.USERID,
            'stock': self.STOCKSYMBOL,
            'quantity': self.QUANTITY
        }
