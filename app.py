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
    data = request.get_json()
    expression = data.get('expression', '')
    print(expression)
    try:
        #Replace ^ with ** for exponentiation, √ with sqrt, and π with pi
        
        expression = expression.replace('^', '**').replace('√', 'sqrt').replace('π', '(pi)')
        # Parse and evaluate the expression safely using sympy
        result = sp.sympify(expression).evalf()
        if not session["history"]:
            session["history"] = [{"result":str(result), "expression":expression}]
        else:
            session["history"] = [*session.get("history"),{"result":str(result), "expression":expression}]

        return jsonify(result=float(result))
    except Exception as e:
        return jsonify(error=str(e))


@app.route('/history')
def history():
    return session["history"]

if __name__ == '__main__':
    app.run(debug=True)