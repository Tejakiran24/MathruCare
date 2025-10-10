// Sample medicine database
const medicineDatabase = {
    fever: ["Paracetamol", "Ibuprofen"],
    headache: ["Aspirin", "Paracetamol"],
    cold: ["Cetirizine", "Vicks Vaporub"],
    cough: ["Dextromethorphan", "Ambroxol"]
};

function searchMedicine() {
    const input = document.getElementById("symptomInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("medicineResults");

    if(input === "") {
        resultsDiv.innerHTML = "Please enter a symptom.";
        return;
    }

    if(medicineDatabase[input]) {
        const medicines = medicineDatabase[input];
        resultsDiv.innerHTML = `Recommended Medicines: <b>${medicines.join(", ")}</b>`;
    } else {
        resultsDiv.innerHTML = "No medicines found for this symptom.";
    }
}
// Simple front-end registration and login (for demo purposes)
let users = [];

document.getElementById("registerForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    if(password !== confirmPassword){
        message.textContent = "Passwords do not match!";
        return;
    }

    // Save user in array (later replace with database)
    users.push({name, email, password});
    message.style.color = "green";
    message.textContent = "Registration successful! You can now login.";
    this.reset();
});

document.getElementById("loginForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const user = users.find(u => u.email === email && u.password === password);
    if(user){
        message.style.color = "green";
        message.textContent = `Welcome, ${user.name}!`;
        this.reset();
    } else {
        message.style.color = "red";
        message.textContent = "Invalid email or password!";
    }
});
document.addEventListener("DOMContentLoaded", function() {

    const searchInput = document.getElementById('medicineSearchInput');
    const resultsGrid = document.getElementById('medicineResults');

    // Attach the search function to the button and the Enter key
    document.querySelector('.search-box button').addEventListener('click', searchMedicines);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMedicines();
        }
    });

    async function searchMedicines() {
        const query = searchInput.value.trim();
        resultsGrid.innerHTML = ''; // Clear previous results

        if (query === '') {
            resultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">Please enter a medicine name to search.</p>';
            return;
        }

        // Display a loading message while fetching data
        resultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">Searching for medicines...</p>';

        try {
            // In a real application, this would be an API call to your backend
            // const response = await fetch(`http://localhost:3000/api/medicines/search?query=${query}`);
            // const medicines = await response.json();

            // --- DEMO MOCK DATA (REPLACE WITH REAL API CALL) ---
            const mockMedicines = [
                { id: 1, name: "Paracetamol 500mg", description: "Used for pain relief and fever.", price: 15.00 },
                { id: 2, name: "Ibuprofen 200mg", description: "A nonsteroidal anti-inflammatory drug (NSAID).", price: 25.50 },
                { id: 3, name: "Cetirizine 10mg", description: "An antihistamine used to relieve allergy symptoms.", price: 10.75 }
            ];
            
            // Simulate a filter based on the search query
            const filteredMedicines = mockMedicines.filter(med => 
                med.name.toLowerCase().includes(query.toLowerCase())
            );

            // Clear the loading message
            resultsGrid.innerHTML = '';

            if (filteredMedicines.length === 0) {
                resultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-dark);">No medicines found. Please try a different search term.</p>';
            } else {
                // Render the medicine cards
                filteredMedicines.forEach(medicine => {
                    const card = document.createElement('div');
                    card.classList.add('medicine-card');
                    card.innerHTML = `
                        <h3>${medicine.name}</h3>
                        <p>${medicine.description}</p>
                        <div class="price">₹${medicine.price.toFixed(2)}</div>
                        <button class="order-btn" data-id="${medicine.id}">Add to Cart</button>
                    `;
                    resultsGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Failed to fetch medicines:', error);
            resultsGrid.innerHTML = '<p style="text-align: center; color: red;">An error occurred while searching. Please try again later.</p>';
        }
    }
});