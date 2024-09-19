let display = document.getElementById('result');
let currentInput = '';
let internalExpression = '';
let buffer = '';

function clearDisplay() {
    currentInput = '';
    internalExpression = '';
    display.innerText = '0';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    internalExpression = internalExpression.slice(0, -1);
    display.innerText = currentInput || '0';
}

function makeNegative() {
    currentInput = `-${currentInput}`;
    internalExpression = `-${internalExpression}`;
    display.innerText = currentInput;
}

function appendCharacter(character) {
    if (currentInput === '0' && character !== '.') {
        currentInput = character;
        internalExpression = character;
    } else {
        currentInput += character;
        internalExpression += character;
    }
    display.innerText = currentInput;
}

function appendOperator(operator) {
    if (/[+\-*/^√]$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -1) + operator;
        internalExpression = internalExpression.slice(0, -1) + operator;
    } else {
        currentInput += operator;
        internalExpression += operator;
    }
    display.innerText = currentInput;
}

function appendPi() {
    if (/[0-9π]$/.test(currentInput)) {
        currentInput += 'π';
        internalExpression += '*π';
    } else {
        currentInput += 'π';
        internalExpression += 'π';
    }
    display.innerText = currentInput;
}

function appendParenthesis(parenthesis) {
    if (parenthesis === '(' && /[0-9)]$/.test(currentInput)) {
        currentInput += '(';
        internalExpression += '*(';
    } else if (parenthesis === ')' && /[0-9(]/.test(currentInput)) {
        currentInput += ')';
        internalExpression += ')';
    } else {
        currentInput += parenthesis;
        internalExpression += parenthesis;
    }
    display.innerText = currentInput;
}

function calculate() {
    if (/\/0(?!\d)/.test(internalExpression)) {
        display.innerText = 'Error: Division by zero';
        return;
    }

    let expression = internalExpression.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2');

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
            internalExpression = currentInput;
            display.innerText = currentInput;
        }
    })
    .catch(error => {
        display.innerText = 'Error';
    });
}

function squareInput() {
    currentInput = `(${currentInput})^2`;
    internalExpression = `(${internalExpression})^2`;
    display.innerText = currentInput;
}

let settingsMenuOpen = false;

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.toggle('hidden');
    settingsMenuOpen = !settingsMenuOpen;
}

function closeSettingsMenu() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.add('hidden');
    settingsMenuOpen = false;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && settingsMenuOpen) {
        closeSettingsMenu();
    }
});

document.addEventListener('click', (event) => {
    const settingsMenu = document.getElementById('settings-menu');
    const settingsButton = document.querySelector('.settings-button');
    
    if (settingsMenuOpen && !settingsMenu.contains(event.target) && !settingsButton.contains(event.target)) {
        closeSettingsMenu();
    }
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
window.toggleSettingsMenu = toggleSettingsMenu;
window.appendPi = appendPi;