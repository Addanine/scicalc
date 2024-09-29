# test commit for switching to node js

from flask import Flask, render_template, request, jsonify, session
import sympy as sp

app = Flask(__name__)
app.secret_key = "CHANGEMEPLS"
@app.route('/')
def home():
    try:
        session["history"]
    except KeyError:
        session["history"] = []
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json() # Get the JSON object sent from the client
    expression = data.get('expression', '')
    print(expression) # Print the expression to the console
    try:
        #Replace ^ with ** for exponentiation, √ with sqrt, and π with pi
        
        expression = expression.replace('^', '**').replace('√', 'sqrt').replace('π', '(pi)')
        # Parse and evaluate the expression safely using sympy
        result = sp.sympify(expression).evalf()  # evalf() is used to evaluate the expression to a floating point number
        if not session["history"]: # If history is empty, create a new list with the first entry
            session["history"] = [{"result":str(result), "expression":expression}] # Store the result and expression in the history
        else:
            session["history"] = [*session.get("history"),{"result":str(result), "expression":expression}] # Store the result and expression in the history

        return jsonify(result=float(result)) # Return the result as a JSON object
    except Exception as e:
        return jsonify(error=str(e))


@app.route('/history')
def history():
    return session["history"]

if __name__ == '__main__':
    app.run(debug=True, port=8080)
