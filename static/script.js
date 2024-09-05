document.addEventListener('DOMContentLoaded', () => {
    let display = document.getElementById('result');
    let currentInput = '';

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
        if (/[+\-*/]$/.test(currentInput)) {
            currentInput = currentInput.slice(0, -1) + operator;
        } else {
            currentInput += operator;
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

    function calculate() {
        try {
            let result = eval(currentInput);
            result = Math.round(result * 1e10) / 1e10;
            currentInput = result.toString();
            display.innerText = currentInput;
        } catch (error) {
            display.innerText = 'Error';
        }
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (/[0-9]/.test(key)) {
            appendCharacter(key);
        } else if (/[+\-*/]/.test(key)) {
            appendOperator(key);
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'Escape') {
            clearDisplay();
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
});