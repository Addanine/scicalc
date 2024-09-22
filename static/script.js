let display = document.getElementById('result');
let currentInput = '';
let internalExpression = '';
let buffer = '';
let equationsLog = [];

function clearDisplay() { // Clear the display
    currentInput = '';
    internalExpression = '';
    display.innerText = '0';
}

function deleteLast() { // Delete the last character from the current input
    currentInput = currentInput.slice(0, -1);
    internalExpression = internalExpression.slice(0, -1);
    display.innerText = currentInput || '0';
}

function makeNegative() { // Make the current input negative
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

function appendTrigFunc(trigFunc) { // Append a trigonometric function to the current input
    if (trigFunc == 'sin') {
        currentInput += "sin(";
        internalExpression += "sin(";
    } else if (trigFunc == 'cos') {
        currentInput += "cos(";
        internalExpression += "cos(";
    } else if (trigFunc == "tan") {
        currentInput += "tan(";
        internalExpression += "tan(";
    }
    display.innerText = currentInput;
}

function appendLog(logBase) {
    //empty log function
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

function appendParenthesis(parenthesis) { // Append a parenthesis to the current input
    if (parenthesis === '(' && /[0-9)]$/.test(currentInput)) {
        currentInput += '(';
        internalExpression += '*(';
    } else if (parenthesis === ')' && /[0-9(]/.test(currentInput)) { // If the last character is a number or an opening parenthesis
        currentInput += ')';
        internalExpression += ')';
    } else {
        currentInput += parenthesis;
        internalExpression += parenthesis;
    }
    display.innerText = currentInput;
}

function calculate() { // Calculate the current expression
    if (/\/0(?!\d)/.test(internalExpression)) {
        display.innerText = 'Error: Division by zero';
        return;
    }

    let expression = internalExpression.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2'); // Add multiplication signs between numbers and parentheses

    fetch('/calculate', { // Send the expression to the server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Send the expression as JSON
        },
        body: JSON.stringify({ expression: expression }) // Send the expression to the server
    })
    .then(response => response.json()) // Get the response from the server
    .then(data => {
        if (data.error) {
            display.innerText = 'Error';
        } else {
            logEquation(expression, data.result); // Log the equation
            currentInput = data.result.toString();
            internalExpression = currentInput;
            display.innerText = currentInput; // Display the result
        }
    })
    .catch(error => {
        display.innerText = 'Error'; // Display an error message
    });
}

function squareInput() { // Square the current input
    currentInput = `(${currentInput})^2`;
    internalExpression = `(${internalExpression})^2`;
    display.innerText = currentInput;
}

let settingsMenuOpen = false;

function toggleSettingsMenu() { // Toggle the settings menu
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.toggle('hidden');
    settingsMenuOpen = !settingsMenuOpen;
}

function closeSettingsMenu() { // Close the settings menu
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.add('hidden');
    settingsMenuOpen = false;
}

function logEquation(expression, result) { // Log the equation to local storage
    let equations = JSON.parse(localStorage.getItem('equations')) || [];
    equations.push({ expression, result });
    localStorage.setItem('equations', JSON.stringify(equations));
}

function toggleEquationsList() { // Toggle the equations list
    const equationsList = document.getElementById('equations-list');
    equationsList.classList.toggle('hidden');
    if (!equationsList.classList.contains('hidden')) {
        displayEquations();
    }
}

function displayEquations() { //  Display equations in the list
    const equations = JSON.parse(localStorage.getItem('equations')) || [];
    const equationsUl = document.getElementById('equations');
    equationsUl.innerHTML = '';
    equations.forEach(eq => {
        const li = document.createElement('li');
        li.textContent = `${eq.expression} = ${eq.result}`;
        equationsUl.appendChild(li);
    });
}

document.addEventListener('keydown', (event) => { // Close settings menu when pressing escape
    if (event.key === 'Escape' && settingsMenuOpen) {
        closeSettingsMenu();
    }
});

document.addEventListener('click', (event) => { // Close settings menu when clicking outside of it
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
window.toggleEquationsList = toggleEquationsList;
window.displayEquations = displayEquations;
window.makeNegative = makeNegative;
window.appendTrigFunc = appendTrigFunc;
window.appendLog = appendLog;