from flask import Blueprint, request, jsonify
from models import Flight

flights_bp = Blueprint('flights', __name__)


@flights_bp.route('/', methods=['GET'], strict_slashes=False)
def get_all_flights():
    """
    GET /api/flights or /api/flights/
    Returns all available flights.
    """
    flights = Flight.query.all()
    return jsonify({
        'success': True,
        'count':   len(flights),
        'flights': [f.to_dict() for f in flights]
    }), 200


@flights_bp.route('/<int:flight_id>', methods=['GET'])
def get_flight(flight_id):
    """
    GET /api/flights/<id>
    Returns a single flight by ID.
    """
    flight = Flight.query.get(flight_id)
    if not flight:
        return jsonify({'success': False, 'message': 'Flight not found'}), 404

    return jsonify({'success': True, 'flight': flight.to_dict()}), 200


@flights_bp.route('/search', methods=['GET'])
def search_flights():
    """
    GET /api/flights/search?from=DEL&to=BOM&passengers=1
    Query params: from, to, passengers (optional)
    """
    from_city  = request.args.get('from', '').strip().upper()
    to_city    = request.args.get('to',   '').strip().upper()
    passengers = int(request.args.get('passengers', 1))

    if not from_city or not to_city:
        return jsonify({'success': False, 'message': 'from and to params are required'}), 400

    flights = Flight.query.filter(
        (Flight.from_city == from_city) | (Flight.from_name.ilike(f'%{from_city}%')),
        (Flight.to_city   == to_city)   | (Flight.to_name.ilike(f'%{to_city}%'))
    ).all()

    results = []
    for f in flights:
        d = f.to_dict()
        d['total_price'] = f.price * passengers
        results.append(d)

    return jsonify({
        'success':    True,
        'count':      len(results),
        'passengers': passengers,
        'flights':    results
    }), 200
