from flask import Flask, send_from_directory, request, jsonify, session
import sympy as sp
import os

# Path to Vite's build output
frontend_dist = os.path.join(os.path.dirname(__file__), '../frontend/dist')

app = Flask(__name__, static_folder=frontend_dist, template_folder=frontend_dist)
app.secret_key = "CHANGEMEPLS"

# Make sure to initialize session properly
@app.before_request
def make_session_permanent():
    session.permanent = True

# Serve Vite-generated assets in production
@app.route('/<path:path>')
def serve_frontend(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()  # Get the JSON object sent from the client
    expression = data.get('expression', '')
    print(f"Received expression: {expression}")  # Print the expression to the console for debugging
    try:
        # Replace ^ with ** for exponentiation, √ with sqrt, and π with pi
        expression = expression.replace('^', '**').replace('√', 'sqrt').replace('π', '(pi)')
        
        # Parse and evaluate the expression safely using sympy
        result = sp.sympify(expression).evalf()  # evalf() is used to evaluate the expression to a floating point number
        
        # Check and initialize session history properly
        if "history" not in session:
            session["history"] = []  # Initialize the history list
        
        # Store the result and expression in the history
        session["history"].append({"result": str(result), "expression": expression})
        
        return jsonify(result=float(result))  # Return the result as a JSON object
    except Exception as e:
        print(f"Error occurred: {e}")  # Print the error for debugging
        return jsonify(error=str(e)), 400  # Return the error message with a 400 status code

@app.route('/history')
def history():
    # Return the calculation history from the session
    return jsonify(session.get("history", []))

if __name__ == '__main__':
    app.run(debug=True, port=3000)
