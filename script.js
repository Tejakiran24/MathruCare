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

// ====================================================================
// REGISTER FORM
// ====================================================================
document.getElementById("registerForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
        message.style.color = "red";
        message.textContent = "Passwords do not match!";
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            message.textContent = data.message || "Registration failed";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = "Server error. Check connection.";
        console.error(error);
    }
});

// ====================================================================
// LOGIN FORM
// ====================================================================
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            message.style.color = "green";
            message.textContent = data.message;
            window.location.href = 'features.html'; // redirect after login
        } else {
            message.style.color = "red";
            message.textContent = data.message || "Invalid credentials";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = "Server error. Check connection.";
        console.error(error);
    }
});

// ====================================================================
// ORDER MEDICINE & CONSULT DOCTOR SEARCH
// ====================================================================
document.addEventListener("DOMContentLoaded", function() {
    // Medicine search
    const medicineSearchInput = document.getElementById('medicineSearchInput');
    const medicineResultsGrid = document.getElementById('medicineResults');

    async function searchMedicines() {
        const query = medicineSearchInput.value.trim();
        medicineResultsGrid.innerHTML = '';

        if (query === '') {
            medicineResultsGrid.innerHTML = '<p>Please enter a medicine name to search.</p>';
            return;
        }

        const mockMedicines = [
            { id: 1, name: "Paracetamol 500mg", description: "Pain relief & fever", price: 15 },
            { id: 2, name: "Ibuprofen 200mg", description: "NSAID", price: 25 },
            { id: 3, name: "Cetirizine 10mg", description: "Allergy relief", price: 10 }
        ];

        const filteredMedicines = mockMedicines.filter(med =>
            med.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredMedicines.length === 0) {
            medicineResultsGrid.innerHTML = '<p>No medicines found.</p>';
        } else {
            filteredMedicines.forEach(med => {
                const card = document.createElement('div');
                card.classList.add('medicine-card');
                card.innerHTML = `
                    <h3>${med.name}</h3>
                    <p>${med.description}</p>
                    <div class="price">₹${med.price.toFixed(2)}</div>
                    <button class="order-btn" data-id="${med.id}">Add to Cart</button>
                `;
                medicineResultsGrid.appendChild(card);
            });
        }
    }

        // small helper to attach Enter key handlers to inputs (reduces duplicate code)
        function attachEnterKey(inputEl, handler) {
            if (!inputEl) return;
            inputEl.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handler();
            });
        }

        attachEnterKey(medicineSearchInput, searchMedicines);
        const medSearchBtn = document.querySelector('#order_medicine .search-box button');
        if (medSearchBtn) medSearchBtn.addEventListener('click', searchMedicines);

    // Doctor search
    const doctorSearchInput = document.getElementById('doctorSearchInput');
    const doctorResultsGrid = document.getElementById('doctorResults');

    async function searchDoctors() {
        const query = doctorSearchInput.value.trim();
        doctorResultsGrid.innerHTML = '';

        if (query === '') {
            doctorResultsGrid.innerHTML = '<p>Please enter a specialty or doctor\'s name.</p>';
            return;
        }

        const mockDoctors = [
            { id: 1, name: "Dr. Anya Sharma", specialty: "Cardiologist", experience: "15 yrs", image: "images/doctor1.jpg" },
            { id: 2, name: "Dr. Rajesh Kumar", specialty: "Pediatrician", experience: "10 yrs", image: "images/doctor2.jpg" },
            { id: 3, name: "Dr. Priya Singh", specialty: "Dermatologist", experience: "8 yrs", image: "images/doctor3.jpg" }
        ];

        const filteredDoctors = mockDoctors.filter(doc =>
            doc.name.toLowerCase().includes(query.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredDoctors.length === 0) {
            doctorResultsGrid.innerHTML = '<p>No doctors found.</p>';
        } else {
            filteredDoctors.forEach(doc => {
                const card = document.createElement('div');
                card.classList.add('doctor-card');
                card.innerHTML = `
                    <img src="${doc.image}" alt="${doc.name}" class="doctor-image">
                    <h3>${doc.name}</h3>
                    <p class="specialty">${doc.specialty}</p>
                    <p class="experience">${doc.experience} experience</p>
                    <button class="book-btn" data-id="${doc.id}">Book Appointment</button>
                `;
                doctorResultsGrid.appendChild(card);
            });
        }
    }

    attachEnterKey(doctorSearchInput, searchDoctors);
    const doctorSearchBtn = document.querySelector('#consult_doctor .search-box button');
    if (doctorSearchBtn) doctorSearchBtn.addEventListener('click', searchDoctors);
});

// ====================================================================
// UPLOAD REPORT
// ====================================================================
document.getElementById('uploadForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const messageArea = document.getElementById('uploadMessage');

    messageArea.textContent = 'Uploading...';
    messageArea.style.color = 'black';

    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // simulate upload
        messageArea.style.color = 'green';
        messageArea.textContent = 'Report uploaded successfully!';
        form.reset();
    } catch (error) {
        messageArea.style.color = 'red';
        messageArea.textContent = 'An error occurred during upload.';
        console.error(error);
    }
});
