let display = document.getElementById('result');
let currentInput = '';
let internalExpression = '';
let buffer = '';
let equationsLog = [];
let memoryValue = 0; // Memory variable

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

function appendTrigFunc(trigFunc) {
    if (trigFunc == 'sin') {
        currentInput += "sin(";
        internalExpression += "Math.sin(";
    } else if (trigFunc == 'cos') {
        currentInput += "cos(";
        internalExpression += "Math.cos(";
    } else if (trigFunc == "tan") {
        currentInput += "tan(";
        internalExpression += "Math.tan(";
    }
    display.innerText = currentInput;
}

function appendInverseTrigFunc(inverseTrigFunc) {
    if (inverseTrigFunc == 'asin') {
        currentInput += "asin(";
        internalExpression += "Math.asin(";
    } else if (inverseTrigFunc == 'acos') {
        currentInput += "acos(";
        internalExpression += "Math.acos(";
    } else if (inverseTrigFunc == "atan") {
        currentInput += "atan(";
        internalExpression += "Math.atan(";
    }
    display.innerText = currentInput;
}

function appendLog(logBase) {
    console.log('appendLog called with logBase:', logBase);
    if (logBase === '10') {
        currentInput += 'log(';
        internalExpression += 'Math.log10(';
    } else if (logBase === 'e') {
        currentInput += 'ln(';
        internalExpression += 'Math.log(';
    } else {
        console.error('Invalid log base:', logBase);
        return;
    }
    console.log('currentInput:', currentInput);
    console.log('internalExpression:', internalExpression);
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

function appendExpFunc(expFunc) {
    if (expFunc == 'exp') {
        currentInput += "exp(";
        internalExpression += "Math.exp(";
    } else if (expFunc == 'pow') {
        currentInput += "^";
        internalExpression += "**";
    }
    display.innerText = currentInput;
}

function appendSqrt() {
    currentInput += "√(";
    internalExpression += "sqrt(";
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
            logEquation(expression, data.result);
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

function logEquation(expression, result) {
    let equations = JSON.parse(localStorage.getItem('equations')) || [];
    equations.push({ expression, result });
    localStorage.setItem('equations', JSON.stringify(equations));
}

function toggleEquationsList() {
    const equationsList = document.getElementById('equations-list');
    equationsList.classList.toggle('hidden');
    if (!equationsList.classList.contains('hidden')) {
        displayEquations();
    }
}

function displayEquations() {
    const equations = JSON.parse(localStorage.getItem('equations')) || [];
    const equationsUl = document.getElementById('equations');
    equationsUl.innerHTML = '';
    equations.forEach(eq => {
        const li = document.createElement('li');
        li.textContent = `${eq.expression} = ${eq.result}`;
        equationsUl.appendChild(li);
    });
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
    } else if (buffer.endsWith('sin')) {
        buffer = buffer.slice(0, -3);
        appendTrigFunc('sin')
    } else if (buffer.endsWith('cos')) {
        buffer = buffer.slice(0, -3);
        appendTrigFunc('cos')
    } else if (buffer.endsWith('tan')) {
        buffer = buffer.slice(0, -3);
        appendTrigFunc('tan')
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

// Memory functions
function memoryStore() {
    memoryValue = parseFloat(currentInput) || 0;
}

function memoryRecall() {
    currentInput = memoryValue.toString();
    internalExpression = currentInput;
    display.innerText = currentInput;
}

function memoryClear() {
    memoryValue = 0;
}



window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.appendCharacter = appendCharacter;
window.appendOperator = appendOperator;
window.appendParenthesis = appendParenthesis;
window.calculate = calculate;
window.squareInput = squareInput;
window.toggleSettingsMenu = toggleSettingsMenu;
window.appendPi = appendPi;
window.toggleEquationsList = toggleEquationsList;
window.displayEquations = displayEquations;
window.makeNegative = makeNegative;
window.appendTrigFunc = appendTrigFunc;
window.appendInverseTrigFunc = appendInverseTrigFunc;
window.appendLog = appendLog;
window.appendExpFunc = appendExpFunc;
window.memoryStore = memoryStore;
window.memoryRecall = memoryRecall;
window.memoryClear = memoryClear;