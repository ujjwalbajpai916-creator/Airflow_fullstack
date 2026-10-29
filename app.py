import os
from flask import Flask, redirect, send_from_directory
from flask_cors import CORS
from extensions import mail
from database import db
from routes.auth import auth_bp
from routes.flights import flights_bp
from routes.bookings import bookings_bp
from routes.tracker import tracker_bp
from routes.newsletter import newsletter_bp


def create_app():
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend', 'dist'))
    legacy_code_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'code'))

    # Serve built React frontend if dist exists, otherwise fall back to legacy code folder
    if os.path.exists(dist_dir):
        app = Flask(__name__, static_folder=dist_dir, static_url_path='')
    else:
        app = Flask(__name__, static_folder=legacy_code_dir, static_url_path='')

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///airflow.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'airflowbooking@gmail.com')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

    CORS(app, supports_credentials=True)
    db.init_app(app)
    mail.init_app(app)

    # API Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(flights_bp, url_prefix='/api/flights')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(tracker_bp, url_prefix='/api/tracker')
    app.register_blueprint(newsletter_bp, url_prefix='/api/newsletter')

    @app.route('/api')
    def api_home():
        return {
            'status': 'running',
            'routes': [
                '/api/auth',
                '/api/flights',
                '/api/bookings',
                '/api/tracker',
                '/api/newsletter'
            ]
        }

    # Catch-all route to serve the React single-page application (SPA)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api'):
            return {'error': 'API endpoint not found'}, 404

        if os.path.exists(dist_dir):
            target_path = os.path.join(dist_dir, path)
            if path != "" and os.path.exists(target_path):
                return send_from_directory(dist_dir, path)
            return send_from_directory(dist_dir, 'index.html')

        # If frontend is running separately on Vite dev server
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173/')
        if os.environ.get('USE_VITE_FRONTEND', 'true').lower() == 'true':
            return redirect(frontend_url, code=302)
        return app.send_static_file('AIRLINE.html')

    with app.app_context():
        db.create_all()
        seed_data()

    return app


def seed_data():
    """Insert demo flights and the default admin user if missing."""
    from models import Flight, User
    from werkzeug.security import generate_password_hash

    if not Flight.query.first():
        demo_flights = [
            Flight(from_city='DEL', from_name='New Delhi', to_city='BOM', to_name='Mumbai', departure='10:00 AM', arrival='12:05 PM', duration='2h 05m', price=4500, economy_avail=True, business_avail=True),
            Flight(from_city='GWL', from_name='Gwalior', to_city='BLR', to_name='Bangalore', departure='3:30 PM', arrival='6:15 PM', duration='2h 45m', price=6500, economy_avail=True, business_avail=False),
            Flight(from_city='BOM', from_name='Mumbai', to_city='CCU', to_name='Kolkata', departure='7:45 AM', arrival='10:15 AM', duration='2h 30m', price=5200, economy_avail=True, business_avail=True),
            Flight(from_city='DEL', from_name='New Delhi', to_city='BLR', to_name='Bangalore', departure='6:00 AM', arrival='8:45 AM', duration='2h 45m', price=5800, economy_avail=True, business_avail=True),
            Flight(from_city='HYD', from_name='Hyderabad', to_city='DEL', to_name='New Delhi', departure='1:00 PM', arrival='3:20 PM', duration='2h 20m', price=4900, economy_avail=True, business_avail=False),
        ]
        db.session.bulk_save_objects(demo_flights)
        db.session.commit()

    if not User.query.filter_by(email='admin@gmail.com').first():
        admin = User(
            name='Admin User',
            email='admin@gmail.com',
            password=generate_password_hash('12345')
        )
        db.session.add(admin)
        db.session.commit()


app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
