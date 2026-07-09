from flask import Flask
from flask_cors import CORS
from extensions import mail
from database import db
from routes.auth import auth_bp, register
from routes.flights import flights_bp
from routes.bookings import bookings_bp
from routes.tracker import tracker_bp
from routes.newsletter import newsletter_bp


def create_app():
    app = Flask(__name__, static_folder='code', static_url_path='')
   
    # Config
    app.config['SECRET_KEY'] = 'airflow-secret-key-2026'
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///airflow.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'airflowbooking@gmail.com'
    app.config['MAIL_PASSWORD'] = 'abcd efgh ijkl mnop'  # Gmail App Password
    # Init extensions
    CORS(app, supports_credentials=True)
    db.init_app(app)
    mail.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp,       url_prefix='/api/auth')
    app.register_blueprint(flights_bp,    url_prefix='/api/flights')
    app.register_blueprint(bookings_bp,   url_prefix='/api/bookings')
    app.register_blueprint(tracker_bp,    url_prefix='/api/tracker')
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
        

    # Create tables & seed data
    with app.app_context():
        db.create_all()
        seed_data()

    @app.route('/')
    def home():
        return app.send_static_file('AIRLINE.html')

    return app


def seed_data():
    """Insert demo flights if table is empty."""
    from models import Flight, User
    from werkzeug.security import generate_password_hash

    if not Flight.query.first():
        demo_flights = [
            Flight(from_city='DEL', from_name='New Delhi',
                   to_city='BOM', to_name='Mumbai',
                   departure='10:00 AM', arrival='12:05 PM',
                   duration='2h 05m', price=4500,
                   economy_avail=True, business_avail=True),
            Flight(from_city='GWL', from_name='Gwalior',
                   to_city='BLR', to_name='Bangalore',
                   departure='3:30 PM', arrival='6:15 PM',
                   duration='2h 45m', price=6500,
                   economy_avail=True, business_avail=False),
            Flight(from_city='BOM', from_name='Mumbai',
                   to_city='CCU', to_name='Kolkata',
                   departure='7:45 AM', arrival='10:15 AM',
                   duration='2h 30m', price=5200,
                   economy_avail=True, business_avail=True),
            Flight(from_city='DEL', from_name='New Delhi',
                   to_city='BLR', to_name='Bangalore',
                   departure='6:00 AM', arrival='8:45 AM',
                   duration='2h 45m', price=5800,
                   economy_avail=True, business_avail=True),
            Flight(from_city='HYD', from_name='Hyderabad',
                   to_city='DEL', to_name='New Delhi',
                   departure='1:00 PM', arrival='3:20 PM',
                   duration='2h 20m', price=4900,
                   economy_avail=True, business_avail=False),
        ]
        db.session.bulk_save_objects(demo_flights)
        db.session.commit()

    # Demo admin user
    if not User.query.filter_by(email='admin@gmail.com').first():
        admin = User(
            name='Admin User',
            email='admin@gmail.com',
            password=generate_password_hash('12345')
        )
        db.session.add(admin)
        db.session.commit()


# Create Flask app for Vercel/Gunicorn
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
