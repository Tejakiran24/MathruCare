const API_BASE_URL = 'http://localhost:5000';

// Initialize Health Tips and Dark Mode
function initFeatures() {
    // Health Tips Banner
    const tips = [
        "Drink at least 8 glasses of water daily! 💧",
        "A 30-minute walk a day keeps the doctor away! 🚶",
        "Ensure 7-8 hours of sleep for a healthy immune system! 😴",
        "Wash your hands frequently to prevent infections! 🧼",
        "Eat a rainbow sequence of vegetables for complete nutrition! 🥗"
    ];
    const banner = document.createElement('div');
    banner.className = 'health-tip-banner';
    banner.innerHTML = `💡 <b>Tip of the Day:</b> ${tips[Math.floor(Math.random() * tips.length)]}`;
    document.body.prepend(banner);

    // Dark Mode Toggle
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.innerHTML = '🌙';
    btn.onclick = () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        btn.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        btn.innerHTML = '☀️';
    }
    
    document.body.appendChild(btn);
}

// Initialize magnificent radar base animations
function initAnimations() {
    const container = document.createElement('div');
    container.className = 'animation-container';
    
    // Create multiple expanding ripples
    const numRipples = 4;
    for(let i=0; i<numRipples; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-bg';
        // Stagger delays so they don't pulse synchronously
        ripple.style.animationDelay = `${i * (12 / numRipples)}s`;
        container.appendChild(ripple);
    }
    
    document.body.appendChild(container);
}
document.addEventListener('DOMContentLoaded', () => {
    initFeatures();
    initAnimations();
});


function showAlert(elementId, message, isSuccess) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = `alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

// -----------------------------------------------------
// Medicines Page Methods
// -----------------------------------------------------
async function fetchMedicines() {
    const searchInput = document.getElementById('medicineSearchInput');
    if (!searchInput) return;

    const query = searchInput.value;
    const grid = document.getElementById('medicines-grid');
    grid.innerHTML = '<p>Loading medicines...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/medicines?search=${encodeURIComponent(query)}`);
        const medicines = await response.json();
        
        grid.innerHTML = '';
        if (medicines.length === 0) {
            grid.innerHTML = '<p>No medicines found.</p>';
            return;
        }

        medicines.forEach(med => {
            const card = document.createElement('div');
            card.className = 'item-card';
            
            const stockStatus = med.stock > 0 
                ? `<span class="stock-badge">In Stock: ${med.stock}</span>`
                : `<span class="stock-badge" style="background: #f8d7da; color: #721c24;">Out of Stock</span>`;
            
            card.innerHTML = `
                <h3>${med.name}</h3>
                ${stockStatus}
                <p><strong>Price:</strong> ₹${med.price.toFixed(2)}</p>
                ${med.symptoms ? `<p style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.5rem;"><strong>Recommended for:</strong> ${med.symptoms}</p>` : ''}
                <button class="btn btn-primary btn-sm" ${med.stock <= 0 ? 'disabled' : ''} 
                    onclick="showOrderForm(${med.id}, '${med.name}')">
                    ${med.stock > 0 ? 'Order Now' : 'Currently Unavailable'}
                </button>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching medicines:', error);
        grid.innerHTML = '<p>Failed to load medicines. Make sure backend is running.</p>';
    }
}

function showOrderForm(id, name) {
    document.getElementById('order-section').style.display = 'block';
    document.getElementById('medicine_id').value = id;
    document.getElementById('selected-medicine-name').textContent = name;
    // Scroll to order form
    document.getElementById('order-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelOrder() {
    document.getElementById('order-section').style.display = 'none';
    document.getElementById('orderForm').reset();
}

async function submitOrder(e) {
    e.preventDefault();
    const id = document.getElementById('medicine_id').value;
    const name = document.getElementById('selected-medicine-name').textContent;
    const customerName = document.getElementById('order_name').value;
    const phone = document.getElementById('order_phone').value;
    const address = document.getElementById('order_address').value;

    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: customerName,
                address: address,
                phone: phone,
                medicine_id: id,
                medicine_name: name
            })
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('order-alert', data.message, true);
            document.getElementById('orderForm').reset();
            setTimeout(cancelOrder, 3000);
        } else {
            showAlert('order-alert', data.error || 'Failed to place order', false);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showAlert('order-alert', 'Network error. Make sure backend is running.', false);
    }
}

// -----------------------------------------------------
// Doctors Page Methods
// -----------------------------------------------------
async function bookAppointment(e) {
    e.preventDefault();
    const name = document.getElementById('doc_name').value;
    const type = document.getElementById('doc_type').value;
    const date = document.getElementById('doc_date').value;
    const problem = document.getElementById('doc_problem').value;

    try {
        const response = await fetch(`${API_BASE_URL}/doctor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                doctor_type: type,
                date: date,
                problem: problem
            })
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('booking-alert', data.message, true);
            document.getElementById('bookingForm').reset();
        } else {
            showAlert('booking-alert', data.error || 'Failed to book appointment', false);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showAlert('booking-alert', 'Network error. Make sure backend is running.', false);
    }
}

// -----------------------------------------------------
// Dashboard Page Methods
// -----------------------------------------------------
function calculateBMI() {
    const h = parseFloat(document.getElementById('bmi_height').value);
    const w = parseFloat(document.getElementById('bmi_weight').value);
    const resEl = document.getElementById('bmi-result');

    if (!h || !w || h <= 0 || w <= 0) {
        resEl.textContent = 'Please enter valid numbers for height and weight.';
        resEl.style.backgroundColor = '#f8d7da';
        resEl.style.color = '#721c24';
        resEl.style.display = 'block';
        return;
    }

    const hInMeters = h / 100;
    const bmi = w / (hInMeters * hInMeters);
    let category = '';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obese';

    resEl.innerHTML = `Your BMI is <strong>${bmi.toFixed(1)}</strong> (${category}).`;
    
    // Set colors based on category
    if (category === 'Normal weight') {
        resEl.style.backgroundColor = '#d4edda';
        resEl.style.color = '#155724';
    } else if (category === 'Overweight' || category === 'Underweight') {
        resEl.style.backgroundColor = '#fff3cd';
        resEl.style.color = '#856404';
    } else {
        resEl.style.backgroundColor = '#f8d7da';
        resEl.style.color = '#721c24';
    }
    
    resEl.style.display = 'block';
}

async function loadDashboardData() {
    const ordersList = document.getElementById('orders-list');
    const appointmentsList = document.getElementById('appointments-list');
    if (!ordersList || !appointmentsList) return;

    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        const data = await response.json();

        // Render Orders
        ordersList.innerHTML = '';
        if (data.orders.length === 0) {
            ordersList.innerHTML = '<li>No orders found.</li>';
        } else {
            data.orders.forEach(o => {
                ordersList.innerHTML += `
                    <li>
                        <strong>${o.medicine_name}</strong> - Ordered by ${o.name}<br>
                        <small style="color: var(--text-light)">Status: ${o.status}</small>
                    </li>
                `;
            });
        }

        // Render Appointments
        appointmentsList.innerHTML = '';
        if (data.appointments.length === 0) {
            appointmentsList.innerHTML = '<li>No appointments found.</li>';
        } else {
            data.appointments.forEach(a => {
                appointmentsList.innerHTML += `
                    <li>
                        <strong>${a.doctor_type}</strong> for ${a.name}<br>
                        <small style="color: var(--text-light)">Date: ${a.date} | Status: ${a.status}</small>
                    </li>
                `;
            });
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        ordersList.innerHTML = '<li>Failed to load data.</li>';
        appointmentsList.innerHTML = '<li>Failed to load data.</li>';
    }
}

// -----------------------------------------------------
// Reports Display & Upload Methods
// -----------------------------------------------------
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('upload-status');
    const resultSec = document.getElementById('analysis-results');
    const textEl = document.getElementById('analysis-text');
    const grid = document.getElementById('recommended-meds-grid');
    
    statusEl.style.display = 'block';
    statusEl.textContent = 'Analyzing medical report securely with AI... ⏳';
    document.getElementById('loading-spinner').style.display = 'block';
    resultSec.style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            statusEl.textContent = 'Analysis Complete! ✅';
            document.getElementById('loading-spinner').style.display = 'none';
            textEl.textContent = data.analysis;
            
            const metricsEl = document.getElementById('analysis-metrics');
            if (metricsEl && data.metrics) {
                metricsEl.innerHTML = '';
                for (const [key, value] of Object.entries(data.metrics)) {
                    metricsEl.innerHTML += `<div><strong style="color: var(--secondary);">${key}:</strong> ${value}</div>`;
                }
            }
            
            grid.innerHTML = '';
            if(data.recommended_medicines.length === 0) {
                 grid.innerHTML = '<p>No specific medicines matched your report.</p>';
            } else {
                 data.recommended_medicines.forEach(med => {
                     const card = document.createElement('div');
                     card.className = 'item-card';
                     card.innerHTML = `
                         <h3>${med.name}</h3>
                         <p><strong>Price:</strong> ₹${med.price.toFixed(2)}</p>
                         <p style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.5rem;"><strong>Good for:</strong> ${med.symptoms}</p>
                         <button class="btn btn-primary btn-sm" onclick="showOrderForm(${med.id}, '${med.name}')">Prescribe & Order Now</button>
                     `;
                     grid.appendChild(card);
                 });
            }
            resultSec.style.display = 'block';
        } else {
            statusEl.textContent = 'Failed to analyze: ' + data.error;
            statusEl.style.color = 'var(--error)';
        }
    } catch (error) {
        console.error(error);
        statusEl.textContent = 'Network error while analyzing report.';
        statusEl.style.color = 'var(--error)';
    }
}

// -----------------------------------------------------
// Modern UI Interactions (Counters & Scroll Animations)
// -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Scroll Fade-in Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .customer-care, footer').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    const numObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText.replace('+','');
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target + "+";
                    }
                };
                updateCount();
                obs.unobserve(counter); // animate once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => numObserver.observe(counter));
});
