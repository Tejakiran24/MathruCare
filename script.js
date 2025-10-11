// ====================================================================
// CORE SITE FUNCTIONS (Homepage Search, Login, Register)
// ====================================================================

// Sample medicine database for the homepage symptom search
const medicineDatabase = {
    fever: ["Paracetamol", "Ibuprofen"],
    headache: ["Aspirin", "Paracetamol"],
    cold: ["Cetirizine", "Vicks Vaporub"],
    cough: ["Dextromethorphan", "Ambroxol"]
};

function searchMedicine() {
    const input = document.getElementById("symptomInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("medicineResults");

    if (input === "") {
        resultsDiv.innerHTML = "Please enter a symptom.";
        return;
    }

    if (medicineDatabase[input]) {
        const medicines = medicineDatabase[input];
        resultsDiv.innerHTML = `Recommended Medicines: <b>${medicines.join(", ")}</b>`;
    } else {
        resultsDiv.innerHTML = "No medicines found for this symptom.";
    }
}

// Handles user registration (communicates with the back-end)
document.getElementById("registerForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = data.message;
            this.reset();
            window.location.href = 'login.html';
        } else {
            message.style.color = "red";
            message.textContent = data.message || "Registration failed. Please try again.";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = "An error occurred. Check server connection.";
        console.error('Fetch error:', error);
    }
});

// Handles user login (communicates with the back-end)
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = data.message;
            window.location.href = 'dashboard.html';
        } else {
            message.style.color = "red";
            message.textContent = data.message || "Invalid email or password!";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = "An error occurred. Check server connection.";
        console.error('Fetch error:', error);
    }
});

// ====================================================================
// ORDER MEDICINE & CONSULT DOCTOR (Search functionality for both pages)
// ====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const medicineSearchInput = document.getElementById('medicineSearchInput');
    const medicineResultsGrid = document.getElementById('medicineResults');
    const doctorSearchInput = document.getElementById('doctorSearchInput');
    const doctorResultsGrid = document.getElementById('doctorResults');

    const searchMedicinesButton = document.querySelector('#order_medicine.html .search-box button');
    if (searchMedicinesButton) {
        searchMedicinesButton.addEventListener('click', searchMedicines);
    }
    if (medicineSearchInput) {
        medicineSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMedicines();
            }
        });
    }

    async function searchMedicines() {
        const query = medicineSearchInput.value.trim();
        medicineResultsGrid.innerHTML = '';

        if (query === '') {
            medicineResultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">Please enter a medicine name to search.</p>';
            return;
        }

        medicineResultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">Searching for medicines...</p>';

        try {
            const mockMedicines = [
                { id: 1, name: "Paracetamol 500mg", description: "Used for pain relief and fever.", price: 15.00 },
                { id: 2, name: "Ibuprofen 200mg", description: "A nonsteroidal anti-inflammatory drug (NSAID).", price: 25.50 },
                { id: 3, name: "Cetirizine 10mg", description: "An antihistamine used to relieve allergy symptoms.", price: 10.75 }
            ];
            
            const filteredMedicines = mockMedicines.filter(med => 
                med.name.toLowerCase().includes(query.toLowerCase())
            );

            medicineResultsGrid.innerHTML = '';

            if (filteredMedicines.length === 0) {
                medicineResultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No medicines found. Please try a different search term.</p>';
            } else {
                filteredMedicines.forEach(medicine => {
                    const card = document.createElement('div');
                    card.classList.add('medicine-card');
                    card.innerHTML = `
                        <h3>${medicine.name}</h3>
                        <p>${medicine.description}</p>
                        <div class="price">₹${medicine.price.toFixed(2)}</div>
                        <button class="order-btn" data-id="${medicine.id}">Add to Cart</button>
                    `;
                    medicineResultsGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Failed to fetch medicines:', error);
            medicineResultsGrid.innerHTML = '<p style="text-align: center; color: red;">An error occurred while searching. Please try again later.</p>';
        }
    }

    const searchDoctorsButton = document.querySelector('#consult_doctor.html .search-box button');
    if (searchDoctorsButton) {
        searchDoctorsButton.addEventListener('click', searchDoctors);
    }
    if (doctorSearchInput) {
        doctorSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDoctors();
            }
        });
    }

    async function searchDoctors() {
        const query = doctorSearchInput.value.trim();
        doctorResultsGrid.innerHTML = '';

        if (query === '') {
            doctorResultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">Please enter a specialty or doctor\'s name.</p>';
            return;
        }

        doctorResultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">Searching for doctors...</p>';

        try {
            const mockDoctors = [
                { id: 1, name: "Dr. Anya Sharma", specialty: "Cardiologist", experience: "15 years", image: "images/doctor1.jpg" },
                { id: 2, name: "Dr. Rajesh Kumar", specialty: "Pediatrician", experience: "10 years", image: "images/doctor2.jpg" },
                { id: 3, name: "Dr. Priya Singh", specialty: "Dermatologist", experience: "8 years", image: "images/doctor3.jpg" }
            ];

            const filteredDoctors = mockDoctors.filter(doctor =>
                doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
                doctor.name.toLowerCase().includes(query.toLowerCase())
            );

            doctorResultsGrid.innerHTML = '';

            if (filteredDoctors.length === 0) {
                doctorResultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No doctors found. Please try a different search term.</p>';
            } else {
                filteredDoctors.forEach(doctor => {
                    const card = document.createElement('div');
                    card.classList.add('doctor-card');
                    card.innerHTML = `
                        <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
                        <h3>${doctor.name}</h3>
                        <p class="specialty">${doctor.specialty}</p>
                        <p class="experience">${doctor.experience} experience</p>
                        <button class="book-btn" data-id="${doctor.id}">Book an Appointment</button>
                    `;
                    doctorResultsGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
            doctorResultsGrid.innerHTML = '<p style="text-align: center; color: red;">An error occurred while searching. Please try again later.</p>';
        }
    }
});


// ====================================================================
// UPLOAD REPORT JS
// This code handles the form submission for uploading a medical report.
// ====================================================================
document.getElementById('uploadForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const messageArea = document.getElementById('uploadMessage');
    
    messageArea.innerHTML = 'Uploading...';
    messageArea.style.color = 'black';

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        messageArea.style.color = 'green';
        messageArea.textContent = 'Report uploaded successfully!';
        form.reset();

    } catch (error) {
        messageArea.style.color = 'red';
        messageArea.textContent = 'An error occurred during the upload.';
        console.error('Upload error:', error);
    }
});