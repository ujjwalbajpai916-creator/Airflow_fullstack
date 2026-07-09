-- Active: 1758642182416@@127.0.0.1@3306@airflow_airlines
-- ============================================================
--  AirFlow Airlines - Complete MySQL Database
--  Compatible with MySQL 8.0+
-- ============================================================
SELECT user, host FROM mysql.user;

ALTER USER 'root' @'localhost' IDENTIFIED
WITH
    mysql_native_password BY '123456';

CREATE DATABASE airline_db;

USE airline_db;

CREATE DATABASE IF NOT EXISTS airflow_airlines CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE airflow_airlines;

-- ============================================================
-- 1. USERS  (login / signup)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. AIRPORTS
-- ============================================================
CREATE TABLE airports (
    airport_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    iata_code CHAR(3) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    city VARCHAR(80) NOT NULL,
    country VARCHAR(80) NOT NULL,
    timezone VARCHAR(60) DEFAULT 'Asia/Kolkata'
);

-- ============================================================
-- 3. AIRCRAFT
-- ============================================================
CREATE TABLE aircraft (
    aircraft_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    registration VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(60) NOT NULL,
    total_seats SMALLINT UNSIGNED NOT NULL,
    economy_seats SMALLINT UNSIGNED NOT NULL,
    business_seats SMALLINT UNSIGNED NOT NULL
);

-- ============================================================
-- 4. FLIGHTS
-- ============================================================
CREATE TABLE flights (
    flight_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL, -- e.g. AF101, 6E302
    aircraft_id INT UNSIGNED,
    origin_airport_id INT UNSIGNED NOT NULL,
    dest_airport_id INT UNSIGNED NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL,
    status ENUM(
        'Scheduled',
        'On Time',
        'Delayed',
        'Cancelled',
        'Landed'
    ) DEFAULT 'Scheduled',
    economy_price DECIMAL(10, 2) NOT NULL,
    business_price DECIMAL(10, 2) NOT NULL,
    economy_available SMALLINT UNSIGNED DEFAULT 0,
    business_available SMALLINT UNSIGNED DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft (aircraft_id) ON DELETE SET NULL,
    FOREIGN KEY (origin_airport_id) REFERENCES airports (airport_id),
    FOREIGN KEY (dest_airport_id) REFERENCES airports (airport_id)
);

-- ============================================================
-- 5. BOOKINGS
-- ============================================================
CREATE TABLE bookings (
    booking_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_ref CHAR(8) NOT NULL UNIQUE, -- e.g. AFBK1234
    user_id INT UNSIGNED,
    flight_id INT UNSIGNED NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    seat_class ENUM('Economy', 'Business') DEFAULT 'Economy',
    passengers TINYINT UNSIGNED DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_status ENUM(
        'Pending',
        'Paid',
        'Refunded',
        'Failed'
    ) DEFAULT 'Pending',
    booking_status ENUM(
        'Confirmed',
        'Cancelled',
        'Completed'
    ) DEFAULT 'Confirmed',
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL,
    FOREIGN KEY (flight_id) REFERENCES flights (flight_id)
);

-- ============================================================
-- 6. PAYMENTS
-- ============================================================
CREATE TABLE payments (
    payment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNSIGNED NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'INR',
    method ENUM(
        'Card',
        'UPI',
        'NetBanking',
        'Wallet',
        'EMI'
    ) DEFAULT 'Card',
    transaction_id VARCHAR(100),
    status ENUM(
        'Pending',
        'Success',
        'Failed',
        'Refunded'
    ) DEFAULT 'Pending',
    paid_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
);

-- ============================================================
-- 7. OFFERS / DEALS
-- ============================================================
CREATE TABLE offers (
    offer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    badge_label VARCHAR(40),
    description TEXT,
    discount_pct DECIMAL(5, 2), -- percentage off
    cashback_amt DECIMAL(10, 2), -- flat cashback
    promo_code VARCHAR(20) UNIQUE,
    valid_from DATE,
    valid_until DATE,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. DESTINATIONS (slider / explore cards)
-- ============================================================
CREATE TABLE destinations (
    destination_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    airport_id INT UNSIGNED,
    name VARCHAR(80) NOT NULL, -- e.g. Singapore
    country VARCHAR(80) NOT NULL,
    tag VARCHAR(60), -- e.g. "International Flights"
    starting_price DECIMAL(10, 2),
    image_url VARCHAR(500),
    description TEXT,
    is_featured TINYINT(1) DEFAULT 0,
    display_order TINYINT UNSIGNED DEFAULT 0,
    FOREIGN KEY (airport_id) REFERENCES airports (airport_id) ON DELETE SET NULL
);

-- ============================================================
-- 9. TESTIMONIALS
-- ============================================================
CREATE TABLE testimonials (
    testimonial_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    author_name VARCHAR(100) NOT NULL,
    author_initials CHAR(3),
    route VARCHAR(60), -- e.g. Delhi → Mumbai
    rating TINYINT UNSIGNED DEFAULT 5,
    review_text TEXT NOT NULL,
    avatar_color VARCHAR(40),
    is_approved TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL
);

-- ============================================================
-- 10. NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE newsletter_subscribers (
    subscriber_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1
);

-- ============================================================
-- 11. LIVE FLIGHT TRACKING  (snapshot per poll)
-- ============================================================
CREATE TABLE flight_tracking (
    track_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    flight_id INT UNSIGNED NOT NULL,
    tracked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(11, 6),
    altitude_ft INT,
    speed_kmh SMALLINT UNSIGNED,
    progress_pct TINYINT UNSIGNED, -- 0-100
    status ENUM(
        'Scheduled',
        'On Time',
        'Delayed',
        'Cancelled',
        'Landed'
    ) DEFAULT 'On Time',
    delay_minutes SMALLINT DEFAULT 0,
    FOREIGN KEY (flight_id) REFERENCES flights (flight_id)
);

-- ============================================================
-- 12. SEARCH LOGS  (for analytics)
-- ============================================================
CREATE TABLE search_logs (
    search_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    from_code CHAR(3),
    to_code CHAR(3),
    travel_date DATE,
    passengers TINYINT UNSIGNED DEFAULT 1,
    trip_type ENUM(
        'One Way',
        'Round Trip',
        'Multi-City'
    ) DEFAULT 'One Way',
    searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL
);

-- ============================================================
-- 13. SUPPORT / CONTACT MESSAGES
-- ============================================================
CREATE TABLE support_messages (
    message_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    name VARCHAR(100),
    email VARCHAR(120),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM(
        'Open',
        'In Progress',
        'Resolved',
        'Closed'
    ) DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- AIRPORTS
INSERT INTO
    airports (
        iata_code,
        name,
        city,
        country
    )
VALUES (
        'DEL',
        'Indira Gandhi International Airport',
        'New Delhi',
        'India'
    ),
    (
        'BOM',
        'Chhatrapati Shivaji Maharaj International Airport',
        'Mumbai',
        'India'
    ),
    (
        'BLR',
        'Kempegowda International Airport',
        'Bangalore',
        'India'
    ),
    (
        'GWL',
        'Gwalior Airport',
        'Gwalior',
        'India'
    ),
    (
        'CCU',
        'Netaji Subhas Chandra Bose International Airport',
        'Kolkata',
        'India'
    ),
    (
        'HYD',
        'Rajiv Gandhi International Airport',
        'Hyderabad',
        'India'
    ),
    (
        'MAA',
        'Chennai International Airport',
        'Chennai',
        'India'
    ),
    (
        'SIN',
        'Changi Airport',
        'Singapore',
        'Singapore'
    ),
    (
        'DXB',
        'Dubai International Airport',
        'Dubai',
        'UAE'
    ),
    (
        'CDG',
        'Charles de Gaulle Airport',
        'Paris',
        'France'
    ),
    (
        'JFK',
        'John F. Kennedy International Airport',
        'New York',
        'USA'
    ),
    (
        'MLE',
        'Velana International Airport',
        'Malé',
        'Maldives'
    ),
    (
        'ZRH',
        'Zurich Airport',
        'Zurich',
        'Switzerland'
    ),
    (
        'DPS',
        'Ngurah Rai International Airport',
        'Bali',
        'Indonesia'
    );

-- AIRCRAFT
INSERT INTO
    aircraft (
        registration,
        model,
        total_seats,
        economy_seats,
        business_seats
    )
VALUES (
        'VT-INA',
        'Airbus A320',
        180,
        156,
        24
    ),
    (
        'VT-INB',
        'Airbus A321',
        220,
        192,
        28
    ),
    (
        'VT-INC',
        'Boeing 737-800',
        189,
        162,
        27
    ),
    (
        'VT-IND',
        'Boeing 787-9',
        300,
        254,
        46
    ),
    (
        'VT-INE',
        'Airbus A380',
        520,
        440,
        80
    );

-- USERS  (passwords are bcrypt hashes of "12345" and "admin123")
INSERT INTO
    users (
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        role
    )
VALUES (
        'Admin',
        'AirFlow',
        'admin@gmail.com',
        '$2b$12$ExampleHashForAdmin000000000000000000000000000',
        '+91 90000 00000',
        'admin'
    ),
    (
        'Rahul',
        'Kumar',
        'rahul@email.com',
        '$2b$12$ExampleHashForUser1000000000000000000000000000',
        '+91 98765 43210',
        'user'
    ),
    (
        'Priya',
        'Sharma',
        'priya@email.com',
        '$2b$12$ExampleHashForUser2000000000000000000000000000',
        '+91 87654 32109',
        'user'
    ),
    (
        'Amit',
        'Singh',
        'amit@email.com',
        '$2b$12$ExampleHashForUser3000000000000000000000000000',
        '+91 76543 21098',
        'user'
    );

-- FLIGHTS
INSERT INTO
    flights (
        flight_number,
        aircraft_id,
        origin_airport_id,
        dest_airport_id,
        departure_time,
        arrival_time,
        duration_minutes,
        status,
        economy_price,
        business_price,
        economy_available,
        business_available
    )
VALUES
    -- DEL → BOM
    (
        'AF101',
        3,
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'DEL'
        ),
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'BOM'
        ),
        '2026-06-01 10:00:00',
        '2026-06-01 12:05:00',
        125,
        'On Time',
        4500.00,
        12500.00,
        80,
        10
    ),

-- GWL → BLR
(
    'AF202',
    1,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'GWL'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'BLR'
    ),
    '2026-06-01 15:30:00',
    '2026-06-01 18:15:00',
    165,
    'Scheduled',
    6500.00,
    18000.00,
    50,
    5
),

-- BOM → CCU
(
    'AF303',
    2,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'BOM'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'CCU'
    ),
    '2026-06-01 07:45:00',
    '2026-06-01 10:15:00',
    150,
    'On Time',
    5200.00,
    14000.00,
    100,
    15
),

-- DEL → SIN  (International)
(
    'AF404',
    4,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'DEL'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'SIN'
    ),
    '2026-06-02 22:00:00',
    '2026-06-03 07:30:00',
    330,
    'Scheduled',
    19999.00,
    55000.00,
    120,
    20
),

-- DEL → DXB
(
    'AF505',
    4,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'DEL'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'DXB'
    ),
    '2026-06-03 01:00:00',
    '2026-06-03 04:00:00',
    180,
    'Scheduled',
    18000.00,
    48000.00,
    90,
    18
),

-- BOM → CDG
(
    'AF606',
    5,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'BOM'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'CDG'
    ),
    '2026-06-04 03:00:00',
    '2026-06-04 10:30:00',
    570,
    'Scheduled',
    35000.00,
    95000.00,
    200,
    40
),

-- DEL → JFK
(
    'AF707',
    5,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'DEL'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'JFK'
    ),
    '2026-06-05 05:00:00',
    '2026-06-05 16:00:00',
    900,
    'Scheduled',
    45000.00,
    120000.00,
    180,
    35
),

-- BOM → MLE  (Maldives)
(
    'AF808',
    3,
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'BOM'
    ),
    (
        SELECT airport_id
        FROM airports
        WHERE
            iata_code = 'MLE'
    ),
    '2026-06-06 06:00:00',
    '2026-06-06 08:30:00',
    150,
    'Scheduled',
    12000.00,
    35000.00,
    70,
    8
);

-- OFFERS
INSERT INTO
    offers (
        title,
        badge_label,
        description,
        discount_pct,
        cashback_amt,
        promo_code,
        valid_from,
        valid_until
    )
VALUES (
        'First Booking Offer',
        'LIMITED TIME',
        '50% off on your very first booking with AirFlow.',
        50.00,
        NULL,
        'FIRST50',
        '2026-01-01',
        '2026-12-31'
    ),
    (
        'Student Discount',
        'STUDENTS',
        'Extra 20% off for valid student ID holders.',
        20.00,
        NULL,
        'STUDENT20',
        '2026-01-01',
        '2026-12-31'
    ),
    (
        'Holiday Cashback',
        'CASHBACK',
        'Get ₹3000 cashback on holiday season bookings.',
        NULL,
        3000.00,
        'HOLI3000',
        '2026-06-01',
        '2026-08-31'
    ),
    (
        'SBI Card Rewards',
        'BANKING',
        'Instant discounts and cashback with SBI Credit Card.',
        15.00,
        2000.00,
        'SBI2026',
        '2026-01-01',
        '2026-12-31'
    ),
    (
        'Early Bird Deal',
        'EARLY BIRD',
        'Book 60 days in advance and save 30%.',
        30.00,
        NULL,
        'EARLY30',
        '2026-01-01',
        '2026-12-31'
    );

-- DESTINATIONS
INSERT INTO
    destinations (
        airport_id,
        name,
        country,
        tag,
        starting_price,
        image_url,
        description,
        is_featured,
        display_order
    )
VALUES (
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'SIN'
        ),
        'Singapore',
        'Singapore',
        'International Flights',
        19999.00,
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
        'Premium comfort luxury travel.',
        1,
        1
    ),
    (
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'MLE'
        ),
        'Maldives',
        'Maldives',
        'Summer Offers',
        12000.00,
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'Get 40% OFF on honeymoon packages.',
        1,
        2
    ),
    (
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'DXB'
        ),
        'Dubai',
        'UAE',
        'Premium Routes',
        18000.00,
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
        'World-class luxury and comfort.',
        1,
        3
    ),
    (
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'CDG'
        ),
        'Paris',
        'France',
        'Europe Deals',
        35000.00,
        'https://images.unsplash.com/photo-1505761671935-60b3a7427bad',
        'Fly to Europe with exclusive airline discounts.',
        1,
        4
    ),
    (
        NULL,
        'Switzerland',
        'Switzerland',
        'Winter Destinations',
        42000.00,
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
        'Enjoy premium mountain vacation packages.',
        1,
        5
    ),
    (
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'DPS'
        ),
        'Bali',
        'Indonesia',
        'Holiday Packages',
        22000.00,
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
        'Relax with luxury beach destinations.',
        1,
        6
    ),
    (
        (
            SELECT airport_id
            FROM airports
            WHERE
                iata_code = 'JFK'
        ),
        'New York',
        'USA',
        'World Tour',
        45000.00,
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
        'Explore iconic cities with AirFlow.',
        1,
        7
    );

-- TESTIMONIALS
INSERT INTO
    testimonials (
        user_id,
        author_name,
        author_initials,
        route,
        rating,
        review_text,
        avatar_color,
        is_approved
    )
VALUES (
        2,
        'Rahul Kumar',
        'RK',
        'Delhi → Mumbai',
        5,
        'Best airline experience ever! The booking was seamless and the flight was super comfortable.',
        'rgba(79,142,247,0.2)',
        1
    ),
    (
        3,
        'Priya Sharma',
        'PS',
        'Gwalior → Bangalore',
        5,
        'Very smooth booking process. Got amazing deals through the app. Highly recommended!',
        'rgba(167,139,250,0.2)',
        1
    );

-- SAMPLE BOOKINGS
INSERT INTO
    bookings (
        booking_ref,
        user_id,
        flight_id,
        first_name,
        last_name,
        email,
        phone,
        seat_class,
        passengers,
        total_price,
        payment_status,
        booking_status
    )
VALUES (
        'AFBK0001',
        2,
        (
            SELECT flight_id
            FROM flights
            WHERE
                flight_number = 'AF101'
        ),
        'Rahul',
        'Kumar',
        'rahul@email.com',
        '+91 98765 43210',
        'Economy',
        1,
        4500.00,
        'Paid',
        'Confirmed'
    ),
    (
        'AFBK0002',
        3,
        (
            SELECT flight_id
            FROM flights
            WHERE
                flight_number = 'AF202'
        ),
        'Priya',
        'Sharma',
        'priya@email.com',
        '+91 87654 32109',
        'Economy',
        2,
        13000.00,
        'Paid',
        'Confirmed'
    );

-- SAMPLE PAYMENTS
INSERT INTO
    payments (
        booking_id,
        amount,
        currency,
        method,
        transaction_id,
        status,
        paid_at
    )
VALUES (
        1,
        4500.00,
        'INR',
        'UPI',
        'UPI2026060100001',
        'Success',
        '2026-05-20 10:15:00'
    ),
    (
        2,
        13000.00,
        'INR',
        'Card',
        'CRD2026060100002',
        'Success',
        '2026-05-21 14:30:00'
    );

-- FLIGHT TRACKING SNAPSHOTS
INSERT INTO
    flight_tracking (
        flight_id,
        tracked_at,
        latitude,
        longitude,
        altitude_ft,
        speed_kmh,
        progress_pct,
        status,
        delay_minutes
    )
VALUES (
        (
            SELECT flight_id
            FROM flights
            WHERE
                flight_number = 'AF101'
        ),
        NOW(),
        27.1767,
        78.0081,
        35000,
        820,
        62,
        'On Time',
        0
    ),
    (
        (
            SELECT flight_id
            FROM flights
            WHERE
                flight_number = 'AF202'
        ),
        NOW(),
        24.0173,
        79.2300,
        32000,
        790,
        30,
        'Delayed',
        15
    ),
    (
        (
            SELECT flight_id
            FROM flights
            WHERE
                flight_number = 'AF303'
        ),
        NOW(),
        20.1234,
        82.5432,
        36000,
        850,
        85,
        'On Time',
        0
    );

-- NEWSLETTER SUBSCRIBERS
INSERT INTO
    newsletter_subscribers (email)
VALUES ('rahul@email.com'),
    ('priya@email.com'),
    ('amit@email.com');

-- SEARCH LOGS
INSERT INTO
    search_logs (
        user_id,
        from_code,
        to_code,
        travel_date,
        passengers,
        trip_type
    )
VALUES (
        2,
        'DEL',
        'BOM',
        '2026-06-01',
        1,
        'One Way'
    ),
    (
        3,
        'GWL',
        'BLR',
        '2026-06-01',
        2,
        'One Way'
    ),
    (
        2,
        'DEL',
        'SIN',
        '2026-06-02',
        1,
        'Round Trip'
    );

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Flight list with airport names
CREATE OR REPLACE VIEW vw_flights AS
SELECT
    f.flight_id,
    f.flight_number,
    a.model AS aircraft_model,
    o.iata_code AS from_code,
    o.city AS from_city,
    d.iata_code AS to_code,
    d.city AS to_city,
    f.departure_time,
    f.arrival_time,
    f.duration_minutes,
    f.status,
    f.economy_price,
    f.business_price,
    f.economy_available,
    f.business_available
FROM
    flights f
    JOIN airports o ON f.origin_airport_id = o.airport_id
    JOIN airports d ON f.dest_airport_id = d.airport_id
    LEFT JOIN aircraft a ON f.aircraft_id = a.aircraft_id;

-- Booking detail view
CREATE OR REPLACE VIEW vw_bookings AS
SELECT
    b.booking_id,
    b.booking_ref,
    CONCAT(
        b.first_name,
        ' ',
        b.last_name
    ) AS passenger_name,
    b.email,
    b.phone,
    f.flight_number,
    o.city AS from_city,
    d.city AS to_city,
    f.departure_time,
    b.seat_class,
    b.passengers,
    b.total_price,
    b.payment_status,
    b.booking_status,
    b.booked_at
FROM
    bookings b
    JOIN flights f ON b.flight_id = f.flight_id
    JOIN airports o ON f.origin_airport_id = o.airport_id
    JOIN airports d ON f.dest_airport_id = d.airport_id;

-- Latest tracking per flight
CREATE OR REPLACE VIEW vw_live_tracking AS
SELECT
    ft.flight_id,
    f.flight_number,
    o.city AS from_city,
    d.city AS to_city,
    f.departure_time,
    f.arrival_time,
    ft.progress_pct,
    ft.status,
    ft.delay_minutes,
    ft.latitude,
    ft.longitude,
    ft.tracked_at
FROM
    flight_tracking ft
    JOIN flights f ON ft.flight_id = f.flight_id
    JOIN airports o ON f.origin_airport_id = o.airport_id
    JOIN airports d ON f.dest_airport_id = d.airport_id
WHERE
    ft.tracked_at = (
        SELECT MAX(t2.tracked_at)
        FROM flight_tracking t2
        WHERE
            t2.flight_id = ft.flight_id
    );

-- ============================================================
-- STORED PROCEDURE: Search Flights
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_search_flights(
    IN p_from       CHAR(3),
    IN p_to         CHAR(3),
    IN p_date       DATE,
    IN p_passengers TINYINT
)
BEGIN
    SELECT
        f.flight_id,
        f.flight_number,
        o.iata_code AS from_code, o.city AS from_city,
        d.iata_code AS to_code,   d.city AS to_city,
        f.departure_time,
        f.arrival_time,
        f.duration_minutes,
        f.status,
        f.economy_price,
        f.business_price,
        f.economy_available,
        f.business_available
    FROM flights f
    JOIN airports o ON f.origin_airport_id = o.airport_id
    JOIN airports d ON f.dest_airport_id   = d.airport_id
    WHERE o.iata_code          = UPPER(p_from)
      AND d.iata_code          = UPPER(p_to)
      AND DATE(f.departure_time) = p_date
      AND f.status NOT IN ('Cancelled')
      AND f.economy_available   >= p_passengers
    ORDER BY f.departure_time;
END$$

-- STORED PROCEDURE: Confirm Booking
CREATE PROCEDURE sp_confirm_booking(
    IN p_user_id    INT UNSIGNED,
    IN p_flight_id  INT UNSIGNED,
    IN p_first      VARCHAR(60),
    IN p_last       VARCHAR(60),
    IN p_email      VARCHAR(120),
    IN p_phone      VARCHAR(20),
    IN p_class      ENUM('Economy','Business'),
    IN p_passengers TINYINT UNSIGNED,
    OUT p_booking_ref CHAR(8),
    OUT p_total       DECIMAL(10,2)
)
BEGIN
    DECLARE v_price    DECIMAL(10,2);
    DECLARE v_ref      CHAR(8);

    -- Get price
    IF p_class = 'Business' THEN
        SELECT business_price INTO v_price FROM flights WHERE flight_id = p_flight_id;
    ELSE
        SELECT economy_price  INTO v_price FROM flights WHERE flight_id = p_flight_id;
    END IF;

    SET p_total = v_price * p_passengers;

    -- Generate booking ref  e.g. AF3A7F2B
    SET v_ref = CONCAT('AF', UPPER(SUBSTRING(MD5(RAND()), 1, 6)));
    SET p_booking_ref = v_ref;

    -- Insert booking
    INSERT INTO bookings (booking_ref, user_id, flight_id, first_name, last_name, email, phone, seat_class, passengers, total_price)
    VALUES (v_ref, p_user_id, p_flight_id, p_first, p_last, p_email, p_phone, p_class, p_passengers, p_total);

    -- Decrement available seats
    IF p_class = 'Business' THEN
        UPDATE flights SET business_available = business_available - p_passengers WHERE flight_id = p_flight_id;
    ELSE
        UPDATE flights SET economy_available  = economy_available  - p_passengers WHERE flight_id = p_flight_id;
    END IF;
END$$

DELIMITER;

-- ============================================================
-- END OF airflow_airlines DATABASE
-- ============================================================