import sqlite3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Medicines Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            symptoms TEXT
        )
    ''')
    # Orders Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT NOT NULL,
            medicine_id INTEGER,
            medicine_name TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            FOREIGN KEY (medicine_id) REFERENCES medicines(id)
        )
    ''')
    # Appointments Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            problem TEXT NOT NULL,
            doctor_type TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'Scheduled'
        )
    ''')
    
    # Check if medicines list is empty, populate some dummy data
    c.execute("SELECT COUNT(*) FROM medicines")
    if c.fetchone()[0] == 0:
        medicines = [
            ("Paracetamol 500mg", 50.0, 100, "fever, headache, pain, temperature"),
            ("Amoxicillin 250mg", 120.0, 50, "bacterial infection, sore throat, cough"),
            ("Vitamin C 1000mg", 80.0, 200, "immunity, cold, weakness, scurvy"),
            ("Aspirin 75mg", 45.0, 150, "pain, headache, fever, inflammation"),
            ("Ibuprofen 400mg", 60.0, 80, "pain, fever, inflammation, body ache"),
            ("Cetirizine 10mg", 35.0, 300, "allergy, cold, sneezing, cough, runny nose"),
            ("Azithromycin 500mg", 150.0, 40, "infection, throat, bacterial, fever"),
            ("Pantoprazole 40mg", 90.0, 120, "acidity, gas, stomach ache, ulcer")
        ]
        c.executemany("INSERT INTO medicines (name, price, stock, symptoms) VALUES (?, ?, ?, ?)", medicines)
        
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/medicines', methods=['GET'])
def get_medicines():
    search = request.args.get('search', '')
    conn = get_db_connection()
    if search:
        search_term = '%' + search + '%'
        query = "SELECT * FROM medicines WHERE name LIKE ? OR symptoms LIKE ?"
        medicines = conn.execute(query, (search_term, search_term)).fetchall()
    else:
        medicines = conn.execute('SELECT * FROM medicines').fetchall()
    conn.close()
    
    return jsonify([dict(ix) for ix in medicines])

@app.route('/order', methods=['POST'])
def place_order():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid input"}), 400
        
    name = data.get('name')
    address = data.get('address')
    phone = data.get('phone')
    medicine_id = data.get('medicine_id')
    medicine_name = data.get('medicine_name')
    
    if not all([name, address, phone, medicine_name]):
        return jsonify({"error": "Missing fields"}), 400
        
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO orders (name, address, phone, medicine_id, medicine_name)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, address, phone, medicine_id, medicine_name))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Order placed successfully!"}), 201

@app.route('/doctor', methods=['POST'])
def book_appointment():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid input"}), 400
        
    name = data.get('name')
    problem = data.get('problem')
    doctor_type = data.get('doctor_type')
    date = data.get('date')
    
    if not all([name, problem, doctor_type, date]):
        return jsonify({"error": "Missing fields"}), 400
        
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO appointments (name, problem, doctor_type, date)
        VALUES (?, ?, ?, ?)
    ''', (name, problem, doctor_type, date))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Appointment booked successfully!"}), 201

@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    # Helper to get orders and appointments for dashboard display
    conn = get_db_connection()
    orders = conn.execute('SELECT * FROM orders ORDER BY id DESC').fetchall()
    appointments = conn.execute('SELECT * FROM appointments ORDER BY id DESC').fetchall()
    conn.close()
    
    return jsonify({
        "orders": [dict(ix) for ix in orders],
        "appointments": [dict(ix) for ix in appointments]
    })

@app.route('/analyze', methods=['POST'])
def analyze_report():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    # Simulate AI analysis parsing the medical report
    import random
    problems = ["Vitamin Deficiency", "Bacterial Throat Infection", "Seasonal Allergies", "High Acidity"]
    selected_prob = random.choice(problems)
    
    conn = get_db_connection()
    if selected_prob == "Vitamin Deficiency":
        meds = conn.execute("SELECT * FROM medicines WHERE symptoms LIKE '%immunity%'").fetchall()
        text = "Report Analysis Complete. Your lab results indicate low immunity markers and mild scurvy traces (Vitamin C deficiency). We strongly recommend supplementing."
    elif selected_prob == "Bacterial Throat Infection":
        meds = conn.execute("SELECT * FROM medicines WHERE symptoms LIKE '%bacterial%'").fetchall()
        text = "Report Analysis Complete. Throat swab cultures detect bacterial proliferation. Antibiotics courses are recommended to clear the infection."
    elif selected_prob == "High Acidity":
        meds = conn.execute("SELECT * FROM medicines WHERE symptoms LIKE '%acidity%'").fetchall()
        text = "Report Analysis Complete. Your gastro reports point toward excessive acidity and minor stomach ulcerations. An antacid regimen is advised."
    else:
        meds = conn.execute("SELECT * FROM medicines WHERE symptoms LIKE '%allergy%'").fetchall()
        text = "Report Analysis Complete. Elevated IgE levels in your bloodwork confirm seasonal allergies. Anti-histamines will provide quick relief."
    conn.close()
    
    return jsonify({
        "status": "success",
        "analysis": text,
        "recommended_medicines": [dict(ix) for ix in meds]
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
