// Stars
const starsContainer = document.getElementById('starsContainer');
for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--dur', (2 + Math.random() * 3) + 's');
    star.style.setProperty('--delay', (Math.random() * 4) + 's');
    starsContainer.appendChild(star);
}

// Search tabs
document.querySelectorAll('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Tracker
async function trackFlight() {

    const flightCode =
        document.getElementById('flightInput').value.trim();

    if (!flightCode) return;

    const trackerResult =
        document.getElementById('trackerResult');

    const statusBadge =
        document.getElementById('statusBadge');

    const progressBar =
        document.getElementById('progressBar');

    try {

        const response = await fetch(
            `${API_BASE}/tracker/track?flight=${encodeURIComponent(flightCode)}`
        );

        const apiResult = await response.json();

        if (!apiResult.success || !apiResult.data) {

            statusBadge.textContent = 'Unknown';

            document.getElementById('trackedFlight')
                .textContent = flightCode.toUpperCase();

            document.getElementById('trackedRoute')
                .textContent = 'Flight data unavailable';

            progressBar.style.width = '0%';

            trackerResult.classList.add('show');
            return;
        }

        const flight = apiResult.data;

        document.getElementById('trackedFlight')
            .textContent = flight.flight || flightCode.toUpperCase();

        document.getElementById('trackedRoute')
            .textContent =
            `${flight.departure} → ${flight.arrival}`;

        document.getElementById('deptTime')
            .textContent =
            flight.scheduled_departure || '';

        document.getElementById('arrTime')
            .textContent =
            flight.scheduled_arrival || '';

        statusBadge.textContent =
            flight.status || 'Unknown';

        progressBar.style.width =
            getStatusProgress(flight.status) + '%';

        trackerResult.classList.add('show');

    } catch (error) {

        console.error(error);

        statusBadge.textContent = 'Error';

        trackerResult.classList.add('show');
    }
}
function getStatusStyles(status) {
    const base = {
        background: 'rgba(148,163,184,0.15)',
        borderColor: 'rgba(148,163,184,0.3)',
        color: '#94a3b8'
    };

    if (status === 'On Time') {
        return { background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80' };
    }
    if (status === 'Delayed') {
        return { background: 'rgba(251,191,36,0.15)', borderColor: 'rgba(251,191,36,0.3)', color: '#fbbf24' };
    }
    if (status === 'Boarding') {
        return { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)', color: '#3b82f6' };
    }
    if (status === 'Cancelled') {
        return { background: 'rgba(248,113,113,0.15)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' };
    }
    return base;
}

function getStatusProgress(status) {
    if (status === 'On Time') return 70;
    if (status === 'Delayed') return 40;
    if (status === 'Boarding') return 55;
    if (status === 'Cancelled') return 0;
    if (status === 'Landed') return 100;
    return 25;
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

reveals.forEach(reveal => observer.observe(reveal));

function toggleOffers() {
    const offers = document.getElementById("extraOffers");

    if (!offers) {
        alert("extraOffers not found");
        return;
    }

    offers.classList.toggle("show");
}

function renderSearchResults(flights, error = "") {

    const container = document.getElementById("searchResults");

    if (!container) return;

    if (error) {
        container.innerHTML = `<h3>${error}</h3>`;
        return;
    }

    if (!flights || flights.length === 0) {
        container.innerHTML = `<h3>No Flights Found</h3>`;
        return;
    }

    container.innerHTML = flights.map(f => `
        <div class="flight-card">
            <div class="flight-route">
                <strong>${f.from} → ${f.to}</strong>
            </div>

            <div>${f.departure} - ${f.arrival}</div>

            <div>₹${f.price}</div>

            <button class="book-btn">Book Now</button>
        </div>
    `).join("");
}

function toggleChat() {
    const chatBox = document.getElementById('aiChatBox');
    chatBox.classList.toggle('open');

}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const body = document.getElementById('chatBody');
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message user';
    userMessage.textContent = text;
    body.appendChild(userMessage);
    body.scrollTop = body.scrollHeight;
    input.value = '';

    setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'ai-message assistant';
        reply.textContent = 'Thanks for your question! This is a demo assistant. For booking support, please contact our customer care team.';
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
    }, 600);
}

document.getElementById('chatInput').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", searchFlights);

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let current = 0;

/* SHOW SLIDE */
function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}
setInterval(() => {
    current++;
    if (current >= slides.length) {
        current = 0;
    }
    showSlide(current);
}, 5000);
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        current = index;
        showSlide(current);
    });
});

const API_BASE = window.location.protocol === 'file:'
    ? 'http://127.0.0.1:5000/api'
    : window.location.origin + '/api';
const HOME_URL = 'http://127.0.0.1:5000/#';
let currentBookingFlightId = null;
let selectedFlight = null;

function parseAirportCode(value) {
    const match = value.match(/\(([^)]+)\)/);
    return match ? match[1].trim().toUpperCase() : value.trim().toUpperCase();
}

function openModal(flightId, from, to, time, price, duration) {
    currentBookingFlightId = flightId;
    selectedFlight = { id: flightId, from, to, time, price, duration };
    document.getElementById('flightSummary').innerHTML =
        `<b>✈ ${from} → ${to}</b> &nbsp;·&nbsp; ${time} &nbsp;·&nbsp; ${duration} &nbsp;·&nbsp; <b>${price}</b>`;
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('successMsg').classList.remove('show');
    document.getElementById('bookingError').textContent = '';
    document.getElementById('bookingModal').classList.add('show');
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('show');
}

document.getElementById('bookingModal').addEventListener('click', e => {
    if (e.target === document.getElementById('bookingModal')) closeModal();
});

async function searchFlights() {

    const response = await fetch(`${API_BASE}/flights/search?from=DEL&to=BOM`);

    const data = await response.json();

    console.log(data);
}

async function searchDELToBOM() {
    const response = await fetch(`${API_BASE}/flights/search?from=DEL&to=BOM`);
    const data = await response.json();
    console.log('Search DEL→BOM result:', data);
    return data;
}

async function createBookingExample() {
    const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            flight_id: 1
        })
    });
    const data = await response.json();
    console.log('Booking create example result:', data);
    return data;
}

/*const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});*/

reveals.forEach(reveal => observer.observe(reveal));

async function confirmBooking() {
    const firstName = document.getElementById('bookingFirstName').value.trim();
    const lastName = document.getElementById('bookingLastName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const seatClass = document.getElementById('bookingSeatClass').value.trim() || 'Economy';
    const passengers = parseInt(document.getElementById('bookingPassengers').value, 10) || 1;
    const error = document.getElementById('bookingError');

    if (!selectedFlight || !currentBookingFlightId || !firstName || !lastName || !email || !phone) {
        error.textContent = 'Please complete all booking fields.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/bookings/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                flight_id: selectedFlight.id,
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                seat_class: seatClass,
                passengers
            })
        });
        const data = await response.json();

        if (data.success) {
            document.getElementById('bookingForm').style.display = 'none';
            document.getElementById('successMsg').classList.add('show');
            error.textContent = '';
            setTimeout(closeModal, 3500);
        } else {
            error.textContent = data.message || 'Could not complete booking.';
        }
    } catch (err) {
        error.textContent = 'Network error, please try again.';
    }
}
