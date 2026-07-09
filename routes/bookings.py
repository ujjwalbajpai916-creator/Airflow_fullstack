from flask import Blueprint, request, jsonify, session
from flask_mail import Message
from extensions import mail
from database import db
from models import Booking, Flight
import random
import string

bookings_bp = Blueprint('bookings', __name__)


def generate_booking_ref(length=8):
    while True:
        ref = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        if not Booking.query.filter_by(booking_ref=ref).first():
            return ref


@bookings_bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json() or {}
    required_fields = ['flight_id', 'first_name', 'last_name', 'email', 'phone', 'seat_class', 'passengers']
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({'success': False, 'message': f"Missing fields: {', '.join(missing)}"}), 400

    flight = Flight.query.get(data['flight_id'])
    if not flight:
        return jsonify({'success': False, 'message': 'Flight not found'}), 404

    try:
        passengers = int(data.get('passengers', 1))
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid passengers value'}), 400

    if passengers < 1:
        return jsonify({'success': False, 'message': 'Passengers must be at least 1'}), 400

    seat_class = data.get('seat_class', 'Economy')
    if seat_class == 'Business' and not flight.business_avail:
        return jsonify({'success': False, 'message': 'Business class not available for this flight'}), 400

    multiplier = 2.0 if seat_class == 'Business' else 1.0
    total_price = flight.price * passengers * multiplier
    user_id = session.get('user_id')

    booking = Booking(
        user_id=user_id,
        flight_id=flight.id,
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data['phone'],
        seat_class=seat_class,
        passengers=passengers,
        total_price=total_price,
        booking_ref=generate_booking_ref(),
        status='Confirmed'
    )
    db.session.add(booking)
    db.session.commit()

    # Send booking confirmation email
    msg = Message(
        subject="Flight Booking Confirmation",
        sender=("AirFlow Airlines", "airflowbooking@gmail.com"),
        recipients=[data['email']]
    )

    msg.body = f"""
Hello {data['first_name']},

Your booking has been confirmed.

Booking Ref: {booking.booking_ref}
From: {flight.from_name}
To: {flight.to_name}

Total Price: ₹{total_price}

Thank you for choosing AirFlow.
"""

    try:
        mail.send(msg)
    except Exception as e:
        print(f"Email sending failed: {e}")

    return jsonify({'success': True, 'message': 'Booking created', 'booking': booking.to_dict()}), 201


@bookings_bp.route('/', methods=['GET'])
def list_bookings():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401

    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify({
        'success': True,
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200


@bookings_bp.route('/<string:booking_ref>', methods=['GET'])
def get_booking_by_ref(booking_ref):
    booking = Booking.query.filter_by(booking_ref=booking_ref).first()
    if not booking:
        return jsonify({'success': False, 'message': 'Booking not found'}), 404

    return jsonify({'success': True, 'booking': booking.to_dict()}), 200


@bookings_bp.route('/<int:booking_id>/cancel', methods=['POST'])
def cancel_booking(booking_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'success': False, 'message': 'Booking not found'}), 404

    if booking.user_id and booking.user_id != user_id:
        return jsonify({'success': False, 'message': 'Forbidden'}), 403

    if booking.status == 'Cancelled':
        return jsonify({'success': False, 'message': 'Booking already cancelled'}), 400

    booking.status = 'Cancelled'
    db.session.commit()

    return jsonify({'success': True, 'message': 'Booking cancelled', 'booking': booking.to_dict()}), 200
