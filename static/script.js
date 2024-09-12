let display = document.getElementById('result');
let currentInput = '';
let buffer = '';
var lastCharacter = ""

function clearDisplay() {
    currentInput = '';
    display.innerText = '0';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.innerText = currentInput || '0';
}

function appendCharacter(character) {
    if (character === '(' && /[0-9)]$/.test(currentInput)) {
        currentInput += '*';
    }
    if (/[)]$/.test(currentInput) && /[0-9(]/.test(character)) {
        currentInput += '*';
    }
    if (currentInput === '0' && character !== '.') {
        currentInput = character;
    } else {
        currentInput += character;
    }
    display.innerText = currentInput;
}

function appendOperator(operator) {
    if (/[+\-*/^√]$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    lastCharacter = currentInput.slice(-1);
    if (lastCharacter == "√") {
        currentInput += "(";
    }
    display.innerText = currentInput;
}

function appendParenthesis(parenthesis) {
    if (parenthesis === '(' && /[0-9)]$/.test(currentInput)) {
        currentInput += '*';
    }
    if (/[)]$/.test(currentInput) && /[0-9(]/.test(parenthesis)) {
        currentInput += '*';
    }
    currentInput += parenthesis;
    display.innerText = currentInput;
}

function appendSqrt(number) {
    var firstHalf = "sqrt(";
    var middle = number;
    var secondHalf = ")";
    var finalSqrt = "";

    finalSqrt += firstHalf
    finalSqrt += middle
    finalSqrt += secondHalf

    currentInput += finalSqrt;
    display.innerText = currentInput;
}

function calculate() {
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression: currentInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            display.innerText = 'Error';
        } else {
            currentInput = data.result.toString();
            display.innerText = currentInput;
        }
    })
    .catch(error => {
        display.innerText = 'Error';
    });
}

function squareInput() {
    currentInput = `(${currentInput})^2`;
    display.innerText = currentInput;
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    buffer += key;
    if (buffer.endsWith('sqrt')) {
        buffer = buffer.slice(0, -4);
        appendOperator('√');
    } else if (/[0-9]/.test(key)) {
        appendCharacter(key);
    } else if (/[+\-*/^√]/.test(key)) {
        appendOperator(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
        buffer = buffer.slice(0, -1);
    } else if (key === 'Escape') {
        clearDisplay();
        buffer = '';
    } else if (key === '(' || key === ')') {
        appendParenthesis(key);
    } else if (key === '.') {
        appendCharacter(key);
    }
});

window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.appendCharacter = appendCharacter;
window.appendOperator = appendOperator;
window.appendParenthesis = appendParenthesis;
window.calculate = calculate;
window.squareInput = squareInput;