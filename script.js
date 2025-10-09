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
