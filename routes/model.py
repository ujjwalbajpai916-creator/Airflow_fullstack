from database import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(150), unique=True, nullable=False)
    password   = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings   = db.relationship('Booking', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id':         self.id,
            'name':       self.name,
            'email':      self.email,
            'created_at': self.created_at.isoformat()
        }


class Flight(db.Model):
    __tablename__ = 'flights'

    id              = db.Column(db.Integer, primary_key=True)
    from_city       = db.Column(db.String(10),  nullable=False)
    from_name       = db.Column(db.String(100), nullable=False)
    to_city         = db.Column(db.String(10),  nullable=False)
    to_name         = db.Column(db.String(100), nullable=False)
    departure       = db.Column(db.String(20),  nullable=False)
    arrival         = db.Column(db.String(20),  nullable=False)
    duration        = db.Column(db.String(20),  nullable=False)
    price           = db.Column(db.Float,       nullable=False)
    economy_avail   = db.Column(db.Boolean,     default=True)
    business_avail  = db.Column(db.Boolean,     default=False)
    created_at      = db.Column(db.DateTime,    default=datetime.utcnow)

    bookings        = db.relationship('Booking', backref='flight', lazy=True)

    def to_dict(self):
        return {
            'id':             self.id,
            'from_city':      self.from_city,
            'from_name':      self.from_name,
            'to_city':        self.to_city,
            'to_name':        self.to_name,
            'departure':      self.departure,
            'arrival':        self.arrival,
            'duration':       self.duration,
            'price':          self.price,
            'economy_avail':  self.economy_avail,
            'business_avail': self.business_avail,
        }


class Booking(db.Model):
    __tablename__ = 'bookings'

    id           = db.Column(db.Integer,     primary_key=True)
    user_id      = db.Column(db.Integer,     db.ForeignKey('users.id'), nullable=True)
    flight_id    = db.Column(db.Integer,     db.ForeignKey('flights.id'), nullable=False)
    first_name   = db.Column(db.String(80),  nullable=False)
    last_name    = db.Column(db.String(80),  nullable=False)
    email        = db.Column(db.String(150), nullable=False)
    phone        = db.Column(db.String(20),  nullable=False)
    seat_class   = db.Column(db.String(20),  nullable=False, default='Economy')
    passengers   = db.Column(db.Integer,     nullable=False, default=1)
    total_price  = db.Column(db.Float,       nullable=False)
    booking_ref  = db.Column(db.String(10),  unique=True, nullable=False)
    status       = db.Column(db.String(20),  default='Confirmed')
    created_at   = db.Column(db.DateTime,    default=datetime.utcnow)

    def to_dict(self):
        return {
            'id':          self.id,
            'flight_id':   self.flight_id,
            'first_name':  self.first_name,
            'last_name':   self.last_name,
            'email':       self.email,
            'phone':       self.phone,
            'seat_class':  self.seat_class,
            'passengers':  self.passengers,
            'total_price': self.total_price,
            'booking_ref': self.booking_ref,
            'status':      self.status,
            'created_at':  self.created_at.isoformat()
        }


class Newsletter(db.Model):
    __tablename__ = 'newsletter'

    id         = db.Column(db.Integer,     primary_key=True)
    email      = db.Column(db.String(150), unique=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id':            self.id,
            'email':         self.email,
            'subscribed_at': self.subscribed_at.isoformat()
        }