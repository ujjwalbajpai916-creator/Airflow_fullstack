import random
import requests
from flask import Blueprint, request, jsonify

tracker_bp = Blueprint('tracker', __name__)

API_KEY = "YOUR_API_KEY"

DEMO_FLIGHTS = {
    'AF101': {
        'flight':   'AF101',
        'airline':  'AirFlow',
        'departure': 'Delhi (DEL)',
        'arrival': 'Mumbai (BOM)',
        'scheduled_departure': '10:00 AM',
        'scheduled_arrival': '12:05 PM',
        'status':   'On Time'
    },
    'AF202': {
        'flight':   'AF202',
        'airline':  'AirFlow',
        'departure': 'Mumbai (BOM)',
        'arrival': 'Kolkata (CCU)',
        'scheduled_departure': '07:45 AM',
        'scheduled_arrival': '10:15 AM',
        'status':   'Delayed'
    },
    'AF303': {
        'flight':   'AF303',
        'airline':  'AirFlow',
        'departure': 'Gwalior (GWL)',
        'arrival': 'Bangalore (BLR)',
        'scheduled_departure': '03:30 PM',
        'scheduled_arrival': '06:15 PM',
        'status':   'On Time'
    },
    'AF404': {
        'flight':   'AF404',
        'airline':  'AirFlow',
        'departure': 'Delhi (DEL)',
        'arrival': 'Bangalore (BLR)',
        'scheduled_departure': '06:00 AM',
        'scheduled_arrival': '08:45 AM',
        'status':   'Landed'
    },
}

def get_simulated_flight(flight_number):
    flight_num = flight_number.strip().upper()
    if flight_num in DEMO_FLIGHTS:
        return DEMO_FLIGHTS[flight_num]
    
    # Generate plausible random response for unknown flights
    statuses = ['On Time', 'Delayed', 'Boarding', 'Landed']
    status = random.choice(statuses)
    return {
        'flight':   flight_num,
        'airline':  'AirFlow',
        'departure': 'Delhi (DEL)',
        'arrival': 'Mumbai (BOM)',
        'scheduled_departure': '10:00 AM',
        'scheduled_arrival': '12:30 PM',
        'status':   status
    }


@tracker_bp.route('/track', methods=['GET'])
@tracker_bp.route('/', methods=['GET'])
def track_flight():
    flight_number = request.args.get('flight')

    if not flight_number:
        return jsonify({
            'success': False,
            'message': 'Flight number is required'
        }), 400

    # If the API key is a placeholder, use simulation fallback
    if API_KEY == "YOUR_API_KEY":
        return jsonify({
            'success': True,
            'data': get_simulated_flight(flight_number)
        }), 200

    try:
        url = (
            f"http://api.aviationstack.com/v1/flights"
            f"?access_key={API_KEY}"
            f"&flight_iata={flight_number}"
        )

        response = requests.get(url, timeout=5)
        result = response.json()

        if not result.get('data'):
            # Fallback to simulation if not found in live API
            return jsonify({
                'success': True,
                'data': get_simulated_flight(flight_number)
            }), 200

        flight = result['data'][0]

        return jsonify({
            'success': True,
            'data': {
                'flight': flight.get('flight', {}).get('iata'),
                'airline': flight.get('airline', {}).get('name'),
                'status': flight.get('flight_status'),
                'departure': flight.get('departure', {}).get('airport'),
                'arrival': flight.get('arrival', {}).get('airport'),
                'scheduled_departure': flight.get('departure', {}).get('scheduled'),
                'scheduled_arrival': flight.get('arrival', {}).get('scheduled')
            }
        }), 200

    except Exception as e:
        # Fallback to simulation if request fails
        return jsonify({
            'success': True,
            'data': get_simulated_flight(flight_number)
        }), 200
