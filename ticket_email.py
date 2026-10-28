import os
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
    booking_ref = _get_value(booking, "booking_ref") or _get_value(booking, "booking_id")
    filename = f"ticket_{booking_ref}.pdf"

    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", "B", 18)
    pdf.cell(0, 10, "AIRFLOW AIRLINES", ln=True, align="C")

    pdf.ln(10)
    pdf.set_font("Arial", "", 12)

    pdf.cell(0, 10, f"Booking Ref : {booking_ref}", ln=True)
    pdf.cell(0, 10, f"Passenger   : {_get_value(booking, 'first_name')} {_get_value(booking, 'last_name')}", ln=True)
    pdf.cell(0, 10, f"Email       : {_get_value(booking, 'email')}", ln=True)

    if flight is not None:
        pdf.cell(0, 10, f"From        : {_get_value(flight, 'from_name')}", ln=True)
        pdf.cell(0, 10, f"To          : {_get_value(flight, 'to_name')}", ln=True)
        pdf.cell(0, 10, f"Date        : {_get_value(flight, 'departure_date') or _get_value(flight, 'departure')}", ln=True)
        pdf.cell(0, 10, f"Time        : {_get_value(flight, 'departure_time') or _get_value(flight, 'departure')}", ln=True)
    else:
        pdf.cell(0, 10, f"From        : {_get_value(booking, 'from_name')}", ln=True)
        pdf.cell(0, 10, f"To          : {_get_value(booking, 'to_name')}", ln=True)
        pdf.cell(0, 10, f"Date        : {_get_value(booking, 'date')}", ln=True)
        pdf.cell(0, 10, f"Time        : {_get_value(booking, 'time')}", ln=True)

    pdf.cell(0, 10, f"Class       : {_get_value(booking, 'seat_class')}", ln=True)
    pdf.cell(0, 10, f"Passengers  : {_get_value(booking, 'passengers')}", ln=True)
    pdf.cell(0, 10, f"Price       : Rs. {_get_value(booking, 'total_price')}", ln=True)

    pdf.ln(10)
    pdf.multi_cell(
        0,
        8,
        "Thank you for choosing AirFlow Airlines.\nPlease carry this ticket during check-in."
    )

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

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())

    os.remove(pdf_file)
