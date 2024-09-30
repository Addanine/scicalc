from flask import Flask, send_from_directory, request, jsonify, session
import sympy as sp
import os

# Path to Vite's build output
frontend_dist = os.path.join(os.path.dirname(__file__), '../frontend/dist')

app = Flask(__name__, static_folder=frontend_dist, template_folder=frontend_dist)
app.secret_key = "CHANGEMEPLS"

# Serve Vite-generated assets in production
@app.route('/<path:path>')
def serve_frontend(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()  # Get the JSON object sent from the client
    expression = data.get('expression', '')
    print(expression)  # Print the expression to the console
    try:
        # Replace ^ with ** for exponentiation, √ with sqrt, and π with pi
        expression = expression.replace('^', '**').replace('√', 'sqrt').replace('π', '(pi)')
        # Parse and evaluate the expression safely using sympy
        result = sp.sympify(expression).evalf()  # evalf() is used to evaluate the expression to a floating point number
        if not session["history"]:  # If history is empty, create a new list with the first entry
            session["history"] = [{"result": str(result), "expression": expression}]  # Store the result and expression in the history
        else:
            session["history"] = [*session.get("history"), {"result": str(result), "expression": expression}]  # Store the result and expression in the history

        return jsonify(result=float(result))  # Return the result as a JSON object
    except Exception as e:
        return jsonify(error=str(e))


@app.route('/history')
def history():
    return jsonify(session.get("history", []))



if __name__ == '__main__':
    app.run(debug=True, port=3000)