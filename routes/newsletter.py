from flask import Blueprint, request, jsonify
from database import db
from models import Newsletter

newsletter_bp = Blueprint('newsletter', __name__)


@newsletter_bp.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    if not email or '@' not in email:
        return jsonify({'success': False, 'message': 'Valid email is required'}), 400

    if Newsletter.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already subscribed'}), 409

    subscriber = Newsletter(email=email)
    db.session.add(subscriber)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Subscribed successfully', 'email': email}), 201


@newsletter_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    subscriber = Newsletter.query.filter_by(email=email).first()
    if not subscriber:
        return jsonify({'success': False, 'message': 'Email not found'}), 404

    db.session.delete(subscriber)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Unsubscribed successfully', 'email': email}), 200
