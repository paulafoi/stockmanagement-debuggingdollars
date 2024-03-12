from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from sqlalchemy.schema import Identity

db = SQLAlchemy()

user_id_seq = Sequence('user_id_seq', metadata=db.metadata)

class USERS(db.Model):
    __tablename__ = 'USERS'
    UserId = db.Column(db.Integer, server_default=user_id_seq.next_value(), primary_key=True)
    UserName = db.Column(db.String(20), nullable=False, unique=True)
    Password = db.Column(db.String(255), nullable=False)

    # Relationship to link users to their portfolios (stocks)
    stocks = db.relationship('USER_STOCKS', backref='USERS')

    def dict(self):
        return {
            'user_id': self.UserId,
            'username': self.UserName,
            'password': self.Password
        }

class USER_STOCKS(db.Model):  
    __tablename__ = 'USER_STOCKS'
    UserId = db.Column(db.Integer, db.ForeignKey('USERS.UserId'), primary_key=True)  
    StockSymbol = db.Column(db.String(10), primary_key=True) 
    Quantity = db.Column(db.Integer, nullable=False)

    def dict(self):
        return {
            'user_id': self.UserId,
            'stock': self.StockSymbol,
            'quantity': self.Quantity
        }
