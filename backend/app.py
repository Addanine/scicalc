from flask import Flask, send_from_directory, request, jsonify, session
import sympy as sp
import os
from flask_cors import CORS

# Create Flask app
app = Flask(__name__, static_folder='../frontend/public', template_folder='../frontend/public')
app.secret_key = "CHANGEMEPLS"

CORS(app)

# Ensure the session is permanent for retaining history
@app.before_request
def make_session_permanent():
    session.permanent = True

# Serve the Vite-generated assets
@app.route('/frontend/html', methods=['GET'])
def serve_frontend(path):
    full_path = os.path.join(app.static_folder, path)
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/', methods=['GET'])
def home():
    return send_from_directory(app.static_folder, 'index.html')

# Endpoint for handling calculations
@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()  # Get the JSON object sent from the client
    expression = data.get('expression', '')
    print(f"Received expression: {expression}")  # Print the expression for debugging

    try:
        # Replace ^ with ** for exponentiation, √ with sqrt, and π with pi
        expression = expression.replace('^', '**').replace('√', 'sqrt').replace('π', '(pi)')
        
        # Parse and evaluate the expression safely using sympy
        result = sp.sympify(expression).evalf()  # Evaluate the expression as a floating point number
        
        # Check and initialize session history
        if "history" not in session:
            session["history"] = []  # Initialize the history list
        
        # Store the result and expression in the history
        session["history"].append({"result": str(result), "expression": expression})
        
        return jsonify(result=float(result))  # Return the result as a JSON object
    except Exception as e:
        print(f"Error occurred: {e}")  # Print the error for debugging
        return jsonify(error=str(e)), 400  # Return the error message with a 400 status code

# Endpoint for retrieving history
@app.route('/history', methods=['GET'])
def history():
    return jsonify(session.get("history", []))

if __name__ == '__main__':
    app.run(debug=True, port=3000)
