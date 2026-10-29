import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a luxury airline boarding pass PDF.
 * Works completely in-browser without requiring server round-trips.
 *
 * @param {Object} booking - Booking details object
 * @param {Object} flight - Flight details object
 */
export function generateBoardingPassPDF(booking, flight) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const bookingRef = booking.booking_ref || booking.id || 'AF-DEMO';
    const passengerName = `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || 'Valued Passenger';
    const email = booking.email || 'passenger@airflow.com';
    const phone = booking.phone || '+91 98765 43210';
    const seatClass = booking.seat_class || 'Economy';
    const seats = booking.selected_seats || 'Auto-assigned (Row 12)';
    const passengersCount = booking.passengers || 1;
    const totalPrice = booking.total_price ? `INR ${booking.total_price.toLocaleString('en-IN')}` : 'INR 4,850';

    const fromCode = flight?.from || booking.from || 'DEL';
    const fromCity = flight?.fromCity || booking.from_city || 'Delhi';
    const toCode = flight?.to || booking.to || 'BOM';
    const toCity = flight?.toCity || booking.to_city || 'Mumbai';
    const flightNumber = flight?.flightNumber || booking.flight_number || 'AF-101';
    const aircraft = flight?.aircraft || 'Airbus A350-900';
    const depTime = flight?.departureTime || booking.departure || '06:00 AM';
    const arrTime = flight?.arrivalTime || booking.arrival || '08:15 AM';
    const travelDate = flight?.departureDate || booking.travel_date || new Date().toISOString().split('T')[0];

    // 1. TOP HEADER BANNER (Deep Navy #0A0F1E)
    doc.setFillColor(10, 15, 30);
    doc.rect(0, 0, 210, 42, 'F');

    // Brand Name & Logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('AIRFLOW AIRLINES', 15, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246); // Electric Blue
    doc.text('LUXURY AVIATION & GLOBAL FLIGHT SERVICES', 15, 26);

    // Reference Code Box in Header
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('BOOKING REFERENCE', 195, 14, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(bookingRef, 195, 22, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text('● CONFIRMED E-TICKET', 195, 28, { align: 'right' });

    // 2. BOARDING PASS CARD CONTAINER
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 48, 180, 120, 4, 4, 'FD');

    // Flight Route Header Inside Card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 48, 180, 24, 4, 4, 'F');
    doc.rect(15, 68, 180, 4, 'F'); // square bottom of top block

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`${flightNumber}  •  ${aircraft}`, 22, 58);

    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246);
    doc.text(`CABIN: ${seatClass.toUpperCase()}`, 188, 58, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Date of Travel: ${travelDate}`, 22, 65);

    // 3. FLIGHT CITIES & TIMES (Big Visual Display)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(10, 15, 30);
    doc.text(fromCode, 24, 88);
    doc.text(toCode, 186, 88, { align: 'right' });

    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(depTime, 24, 95);
    doc.text(arrTime, 186, 95, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(fromCity, 24, 100);
    doc.text(toCity, 186, 100, { align: 'right' });

    // Center Airplane Vector Line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.8);
    doc.line(65, 87, 145, 87);
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.text('NON-STOP FLIGHT ➔', 105, 84, { align: 'center' });

    // Dashed Divider
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(22, 110, 188, 110);
    doc.setLineDashPattern([], 0); // reset line dash

    // 4. PASSENGER & SEAT DETAILS GRID
    // Row 1: Passenger Name, Assigned Seat, Gate, Boarding Time
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(148, 163, 184);
    doc.text('PASSENGER NAME', 24, 118);
    doc.text('SEAT(S)', 95, 118);
    doc.text('GATE', 140, 118);
    doc.text('BOARDING TIME', 186, 118, { align: 'right' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(passengerName.toUpperCase(), 24, 126);
    doc.setTextColor(59, 130, 246);
    doc.text(seats, 95, 126);
    doc.setTextColor(15, 23, 42);
    doc.text('T3 - G14', 140, 126);
    doc.text('45m Before Dep', 186, 126, { align: 'right' });

    // Row 2: Contact, Passengers count, Fare paid
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(148, 163, 184);
    doc.text('CONTACT / EMAIL', 24, 138);
    doc.text('PASSENGERS', 95, 138);
    doc.text('BAGGAGE', 140, 138);
    doc.text('TOTAL FARE', 186, 138, { align: 'right' });

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`${email}`, 24, 145);
    doc.text(`${passengersCount} Adult(s)`, 95, 145);
    doc.text('7kg + 15kg', 140, 145);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(totalPrice, 186, 145, { align: 'right' });

    // 5. BARCODE STRIP (Drawn using repeated vector bars)
    doc.setFillColor(15, 23, 42);
    const barcodeStartX = 24;
    const barcodeY = 153;
    const barcodeH = 10;
    const barPattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2];

    let currentX = barcodeStartX;
    for (let i = 0; i < barPattern.length; i++) {
        const barWidth = barPattern[i] * 0.7;
        if (i % 2 === 0) {
            doc.rect(currentX, barcodeY, barWidth, barcodeH, 'F');
        }
        currentX += barWidth + 0.5;
    }

    doc.setFontSize(7);
    doc.setFont('courier', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`*${bookingRef}-${flightNumber}*`, 186, 160, { align: 'right' });

    // 6. PASSENGER TRAVEL GUIDELINES BOX
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 175, 180, 52, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('IMPORTANT PASSENGER INSTRUCTIONS', 22, 183);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const instructions = [
        '1. Airport Check-In: Counters open 3 hours prior and close 60 minutes before scheduled departure.',
        '2. Identification: Carry a valid government-issued photo ID (Passport / Aadhaar / Driving License).',
        '3. Boarding Gate: Gates strictly close 20 minutes prior to departure.',
        '4. Cabin Baggage: One piece up to 7 kg for Economy, up to 10 kg for Business Suite.',
        '5. Demonstration Notice: This is a simulated flight boarding pass for portfolio testing & UI demo.',
    ];

    let instY = 190;
    instructions.forEach((line) => {
        doc.text(line, 22, instY);
        instY += 6;
    });

    // 7. FOOTER
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('Thank you for choosing AirFlow Airlines • For assistance: support@airflow.com • +91 1800-AIRFLOW', 105, 275, {
        align: 'center',
    });

    // Save PDF
    const filename = `AirFlow_BoardingPass_${bookingRef}.pdf`;
    doc.save(filename);
    return filename;
}

export default generateBoardingPassPDF;
