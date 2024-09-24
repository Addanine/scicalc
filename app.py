from flask import Flask, render_template, request, jsonify
import sympy as sp

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data.get('expression', '')
    try:
        # Replace ^ with ** for exponentiation, √ with sqrt, and π with pi
        expression = expression.replace('^', '**').replace('√', 'sqrt').replace('π', 'pi')
        # Parse and evaluate the expression safely using sympy
        result = sp.sympify(expression).evalf()
        return jsonify(result=float(result))
    except Exception as e:
        return jsonify(error=str(e))

if __name__ == '__main__':
    app.run(debug=True)