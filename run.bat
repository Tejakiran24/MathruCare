@echo off
echo Starting MathruCare Application...

cd backend
echo Setting up Python virtual environment...
python -m venv venv
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo Starting Flask backend...
start "Backend" python app.py

cd ..\frontend
echo Starting Frontend...
start index.html

echo MathruCare is running!
