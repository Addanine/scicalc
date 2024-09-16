let display = document.getElementById('result');
let currentInput = '';
let buffer = '';

function clearDisplay() {
    currentInput = '';
    display.innerText = '0';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.innerText = currentInput || '0';
}

function appendCharacter(character) {
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
    display.innerText = currentInput;
}

function appendParenthesis(parenthesis) {
    if (parenthesis === '(' && /[0-9)]$/.test(currentInput)) {
        currentInput += '(';
    } else if (parenthesis === ')' && /[0-9(]/.test(currentInput)) {
        currentInput += ')';
    } else {
        currentInput += parenthesis;
    }
    display.innerText = currentInput;
}

function calculate() {
    if (/\/0(?!\d)/.test(currentInput)) {
        display.innerText = 'Error: Division by zero';
        return;
    }

    let expression = currentInput.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2');

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression: expression })
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
    calculate();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.toggle('hidden');
}

function initDarkMode() {
    const darkModeSwitch = document.getElementById('dark-mode-switch');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    }

    darkModeSwitch.addEventListener('change', toggleDarkMode);
}

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
});



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
        buffer = ''; // Clear buffer
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