import os
import tempfile
import smtplib
from fpdf import FPDF
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

# Replace these with your Gmail address and App Password before using.
SMTP_USER = "youremail@gmail.com"
SMTP_PASSWORD = "YOUR_APP_PASSWORD"


def _get_value(source, name, default=""):
    if isinstance(source, dict):
        return source.get(name, default)
    return getattr(source, name, default)


def generate_ticket_pdf(booking, flight=None):
    booking_ref = _get_value(booking, "booking_ref") or _get_value(booking, "booking_id") or "SAMPLE"
    filename = os.path.join(tempfile.gettempdir(), f"AirFlow_Ticket_{booking_ref}.pdf")

    pdf = FPDF(orientation='P', unit='mm', format='A4')
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Primary colors: Deep Navy (10, 15, 30), Electric Blue (59, 130, 246)
    # Header Banner
    pdf.set_fill_color(10, 15, 30)
    pdf.rect(0, 0, 210, 36, 'F')

    pdf.set_font("Arial", "B", 22)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(15, 8)
    pdf.cell(100, 10, "AIRFLOW AIRLINES", ln=0, align="L")

    pdf.set_font("Arial", "B", 10)
    pdf.set_text_color(59, 130, 246)
    pdf.set_xy(15, 20)
    pdf.cell(100, 6, "LUXURY AVIATION & GLOBAL FLIGHT SERVICES", ln=0, align="L")

    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(140, 10)
    pdf.cell(55, 8, f"REF: {booking_ref}", ln=0, align="R")

    pdf.set_font("Arial", "", 9)
    pdf.set_text_color(200, 210, 230)
    pdf.set_xy(140, 18)
    pdf.cell(55, 6, "ELECTRONIC BOARDING PASS", ln=1, align="R")

    # Status Bar
    pdf.set_y(44)
    pdf.set_fill_color(240, 245, 255)
    pdf.set_draw_color(200, 220, 250)
    pdf.rect(15, 42, 180, 14, 'DF')

    pdf.set_font("Arial", "B", 10)
    pdf.set_text_color(30, 64, 175)
    pdf.set_xy(20, 46)
    pdf.cell(60, 6, "BOOKING STATUS: CONFIRMED", ln=0)

    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(70, 80, 100)
    pdf.set_xy(130, 46)
    pdf.cell(60, 6, f"CABIN: {_get_value(booking, 'seat_class', 'Economy').upper()}", ln=1, align="R")

    # Passenger & Journey Card
    pdf.set_y(64)
    pdf.set_fill_color(255, 255, 255)
    pdf.set_draw_color(220, 225, 235)
    pdf.rect(15, 62, 180, 78, 'D')

    # Passenger Information
    pdf.set_xy(22, 68)
    pdf.set_font("Arial", "B", 9)
    pdf.set_text_color(130, 140, 160)
    pdf.cell(80, 5, "PASSENGER NAME", ln=0)
    pdf.cell(80, 5, "CONTACT EMAIL / PHONE", ln=1)

    pdf.set_xy(22, 74)
    pdf.set_font("Arial", "B", 13)
    pdf.set_text_color(20, 30, 50)
    first_n = _get_value(booking, 'first_name', 'Valued')
    last_n = _get_value(booking, 'last_name', 'Passenger')
    pdf.cell(80, 7, f"{first_n} {last_n}".upper(), ln=0)

    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(50, 60, 80)
    email_val = _get_value(booking, 'email', 'N/A')
    phone_val = _get_value(booking, 'phone', '')
    pdf.cell(80, 7, f"{email_val}  {phone_val}", ln=1)

    # Route Origin -> Destination
    pdf.set_xy(22, 88)
    pdf.set_draw_color(230, 235, 245)
    pdf.line(22, 86, 185, 86)

    from_city = _get_value(flight, 'from_name') or _get_value(booking, 'from_city') or _get_value(booking, 'from_name') or "Origin"
    to_city = _get_value(flight, 'to_name') or _get_value(booking, 'to_city') or _get_value(booking, 'to_name') or "Destination"
    dep_time = _get_value(flight, 'departure') or _get_value(flight, 'departure_time') or _get_value(booking, 'time') or "10:00 AM"
    dep_date = _get_value(flight, 'departure_date') or _get_value(booking, 'travel_date') or _get_value(booking, 'date') or "2026-11-01"

    pdf.set_xy(22, 92)
    pdf.set_font("Arial", "B", 9)
    pdf.set_text_color(130, 140, 160)
    pdf.cell(70, 5, "FROM / DEPARTURE", ln=0)
    pdf.cell(70, 5, "TO / DESTINATION", ln=0)
    pdf.cell(30, 5, "DATE", ln=1)

    pdf.set_xy(22, 98)
    pdf.set_font("Arial", "B", 14)
    pdf.set_text_color(10, 15, 30)
    pdf.cell(70, 7, f"{from_city}", ln=0)
    pdf.cell(70, 7, f"{to_city}", ln=0)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 7, f"{dep_date}", ln=1)

    pdf.set_xy(22, 106)
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(59, 130, 246)
    pdf.cell(70, 5, f"Dep Time: {dep_time}", ln=0)
    pdf.set_text_color(100, 110, 130)
    pdf.cell(70, 5, "Boarding Gate: T3-G14", ln=0)
    pdf.cell(30, 5, "Seats: Auto / Res", ln=1)

    # Fare Details Box
    pdf.set_xy(22, 118)
    pdf.line(22, 116, 185, 116)

    price_val = _get_value(booking, 'total_price', '4,850')
    passengers_val = _get_value(booking, 'passengers', 1)

    pdf.set_xy(22, 122)
    pdf.set_font("Arial", "B", 9)
    pdf.set_text_color(130, 140, 160)
    pdf.cell(60, 5, "PASSENGERS", ln=0)
    pdf.cell(60, 5, "BAGGAGE ALLOWANCE", ln=0)
    pdf.cell(50, 5, "TOTAL FARE PAID", ln=1)

    pdf.set_xy(22, 128)
    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(20, 30, 50)
    pdf.cell(60, 6, f"{passengers_val} Adult(s)", ln=0)
    pdf.cell(60, 6, "Cabin 7kg + Checkin 15kg", ln=0)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(50, 6, f"INR Rs. {price_val}", ln=1)

    # Important Travel Notice
    pdf.set_y(150)
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    pdf.rect(15, 148, 180, 48, 'DF')

    pdf.set_xy(20, 153)
    pdf.set_font("Arial", "B", 10)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(100, 6, "IMPORTANT PASSENGER INSTRUCTIONS", ln=1)

    pdf.set_font("Arial", "", 8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.set_xy(20, 161)
    notice_text = (
        "1. Check-in counters open 3 hours prior to departure and close 60 minutes before scheduled departure.\n"
        "2. Please present this electronic ticket and a valid government-issued photo ID at airport security.\n"
        "3. Boarding gates strictly close 20 minutes before departure time.\n"
        "4. Demonstration Notice: This booking and ticket are generated for testing and demonstration."
    )
    pdf.multi_cell(170, 5, notice_text)

    # Footer
    pdf.set_y(260)
    pdf.set_font("Arial", "I", 8)
    pdf.set_text_color(148, 163, 184)
    pdf.cell(0, 5, "AirFlow Airlines - 2026 Luxury Aviation. Support: support@airflow.com | +91 1800-AIRFLOW", align="C")

    pdf.output(filename)
    return filename


def send_ticket_email(to_email, booking, flight=None):
    pdf_file = generate_ticket_pdf(booking, flight)

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = "Flight Ticket Confirmation"

    body = f"""
Hello {_get_value(booking, 'first_name')} {_get_value(booking, 'last_name')},

Your booking has been confirmed.

Booking Ref : {_get_value(booking, 'booking_ref') or _get_value(booking, 'booking_id')}
From        : {_get_value(flight, 'from_name') if flight else _get_value(booking, 'from_name')}
To          : {_get_value(flight, 'to_name') if flight else _get_value(booking, 'to_name')}
Date        : {_get_value(flight, 'departure_date') or _get_value(booking, 'date')}
Time        : {_get_value(flight, 'departure_time') or _get_value(booking, 'time')}
Class       : {_get_value(booking, 'seat_class')}
Passengers  : {_get_value(booking, 'passengers')}

Your ticket is attached.

Thank you.
"""

    msg.attach(MIMEText(body, "plain"))

    with open(pdf_file, "rb") as f:
        attach = MIMEApplication(f.read(), _subtype="pdf")

    attach.add_header(
        "Content-Disposition",
        "attachment",
        filename=os.path.basename(pdf_file),
    )
    msg.attach(attach)

    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASSWORD)
    server.sendmail(SMTP_USER, to_email, msg.as_string())
    server.quit()
