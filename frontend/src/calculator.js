let display = document.getElementById('result');
let currentInput = '';
let internalExpression = '';
let buffer = '';
let equationsLog = [];
let memoryValue = 0;
var laterValueForLog = "10"



function clearDisplay() { //`clearDisplay` should clear the display
    currentInput = '';
    internalExpression = '';
    display.innerText = '0';
}

function deleteLast() { //`deleteLast` should delete the last character from display
    currentInput = currentInput.slice(0, -1);
    internalExpression = internalExpression.slice(0, -1);
    display.innerText = currentInput || '0';
}

function changePositiveNegative() { // `changePositiveNegative` should toggle the sign of the number
    if (currentInput.charAt(0) == '-') {
        currentInput = currentInput.slice(1);
        internalExpression = internalExpression.slice(1);
    } else {
        currentInput = `-${currentInput}`;
        internalExpression = `-${internalExpression}`;
    }
    display.innerText = currentInput;
}

function appendCharacter(character) { //`appendCharacter` should add character to display
    if (currentInput === '0' && character !== '.') {
        currentInput = character;
        internalExpression = character;
    } else {
        if (currentInput.includes("vlog(")) { //this if statement checks if there is a vLog and allows the input to be correct
            var postVLog = currentInput.split("vlog(");
            postVLog = postVLog[postVLog.length - 1];
            if (postVLog.includes(")")) {
                console.log("vlog closed");
            } else {
                laterValueForLog = postVLog;
            }
        }

        currentInput += character;
        internalExpression += character;
    }
    display.innerText = currentInput;
}

function appendTrigFunc(trigFunc) { //`appendTrigFunc` should add trigonometric function to display
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

function appendInverseTrigFunc(inverseTrigFunc) { // `appendInverseTrigFunc` should add inverse trigonometric function to display
    if (inverseTrigFunc == 'asin') {
        currentInput += "asin(";
        internalExpression += "asin(";
    } else if (inverseTrigFunc == 'acos') {
        currentInput += "acos(";
        internalExpression += "acos(";
    } else if (inverseTrigFunc == "atan") {
        currentInput += "atan(";
        internalExpression += "atan(";
    }
    display.innerText = currentInput;
}

function appendLog(logBase) { //`appendLog` should add log function to display
    console.log('appendLog called with logBase:', logBase);
    if (logBase === '10') {
        currentInput += 'log(';
        internalExpression += 'log(';
    } else if (logBase === 'e') {
        var operatorsOnly = currentInput.replace(/[0-9]+/g, "");
        var lastOperator = operatorsOnly.charAt(operatorsOnly.length - 1);
        if (lastOperator == "") {
            var e = currentInput;
        } else {
            var e = currentInput.split(lastOperator);
        }

        currentInput += "vlog(";
        if (e.constructor === Array) {
            internalExpression = internalExpression.slice(0, -e[1].length)
            internalExpression += `log(${laterValueForLog}, ${e[e.length - 1]}`;
        } else {
            internalExpression = internalExpression.slice(e)
            internalExpression += `log(${laterValueForLog}, ${e}`;
        }

    } else {
        console.error('Invalid log base:', e[e.length - 1]);
        return;
    }
    console.log('currentInput:', currentInput);
    console.log('internalExpression:', internalExpression);
    display.innerText = currentInput;
}

function appendOperator(operator) { //`appendOperator` should add operator to display
    if (/[+\-*/^√]$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -1) + operator;
        internalExpression = internalExpression.slice(0, -1) + operator;
    } else {
        currentInput += operator;
        internalExpression += operator;
    }
    display.innerText = currentInput;
}

function appendPi() { //`appendPi` should add π to display
    if (/[0-9π]$/.test(currentInput)) {
        currentInput += 'π';
        internalExpression += '*π';
    } else {
        currentInput += 'π';
        internalExpression += 'π';
    }
    display.innerText = currentInput;
}

function appendParenthesis(parenthesis) { //`appendParenthesis` should add parenthesis to display
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

function appendExpFunc(expFunc) { //`appendExpFunc` should add exponential function to display
    if (expFunc == 'exp') {
        currentInput += "exp(";
        internalExpression += "Math.exp(";
    } else if (expFunc == 'pow') {
        currentInput += "^";
        internalExpression += "**";
    }
    display.innerText = currentInput;
}

function appendSqrt() { //`appendSqrt` should add square root function to display
    currentInput += "√(";
    internalExpression += "sqrt(";
    display.innerText = currentInput;
}

function calculate() { 
    if (/\/0(?!\d)/.test(internalExpression)) {
        display.innerText = 'Error: Division by zero';
        return;
    }

    let expression = internalExpression.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2'); // Add multiplication operator between number and parenthesis

    fetch('/calculate', { // Send the expression to the server
        method: 'POST', // Send a POST request
        headers: { 
            'Content-Type': 'application/json' // Tell the server we are sending JSON
        },
        body: JSON.stringify({ expression: expression }) // Send the expression as JSON
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        if (data.error) {
            display.innerText = 'Error'; // Display an error if the server sends one
        } else {
            logEquation(expression, data.result);
            currentInput = data.result.toString(); // Set the current input to the result
            internalExpression = currentInput;
            display.innerText = currentInput; // Display the result
        }
    })
    .catch(error => {
        display.innerText = 'Error'; // Display an error if the server does not respond
    });
}

function squareInput() {
    currentInput = `(${currentInput})^2`; // Square the current input
    internalExpression = `(${internalExpression})^2`;
    display.innerText = currentInput;
}

let settingsMenuOpen = false;

function toggleSettingsMenu() { //`toggleSettingsMenu` should toggle the settings menu
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.toggle('hidden');
    settingsMenuOpen = !settingsMenuOpen;
}

function closeSettingsMenu() { //`closeSettingsMenu` should close the settings menu
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.add('hidden');
    settingsMenuOpen = false;
}

function logEquation(expression, result) { //`logEquation` should log the equation and result to local storage
    let equations = JSON.parse(localStorage.getItem('equations')) || []; // Get the equations from local storage
    equations.push({ expression, result }); // Add the new equation to the array
    localStorage.setItem('equations', JSON.stringify(equations)); // Save the equations back to local storage
}

function toggleEquationsList() {
    const equationsList = document.getElementById('equations-list');
    equationsList.classList.toggle('hidden');
    if (!equationsList.classList.contains('hidden')) {
        displayEquations();
    }
}

function closeEquationsList() {
    const equationsList = document.getElementById('equations-list');
    if (!equationsList.classList.contains('hidden')) {
        equationsList.classList.add('hidden');
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeEquationsList();
        clearDisplay();
    }
});

document.addEventListener('click', (event) => {
    const equationsList = document.getElementById('equations-list');
    const equationsToggleButton = document.querySelector('.history-button');
    const isClickInsideEquationsList = equationsList.contains(event.target);

    if (!isClickInsideEquationsList && !equationsToggleButton.contains(event.target)) {
        closeEquationsList();
    }
});




function displayEquations() {
    const equations = JSON.parse(localStorage.getItem('equations')) || [];
    const equationsUl = document.getElementById('equations');
    equationsUl.innerHTML = '';

    equations.reverse().forEach((eq, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class='equation-container'>
                <div class='equation-text'>
                    ${eq.expression} = ${eq.result}
                </div>
                <img src="plus.svg" alt="Add Equation" class="add-equation" id="add-equation-${index}" style="cursor: pointer;">
            </div>
        `;
        
        li.querySelector('.equation-text').addEventListener('click', () => {
            recallEquation(eq.expression, eq.result);
        });

        const plusIcon = li.querySelector(`#add-equation-${index}`);
        plusIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the recallEquation function from being triggered
            addEquationToInput(eq.result);
        });

        equationsUl.appendChild(li);
    });
}


function addEquationToInput(result) {
    if (/[0-9]$/.test(currentInput) || /[+\-*/]$/.test(currentInput)) {
        currentInput += '+' + result;
        internalExpression += '+' + result;
    } else {
        currentInput = result.toString();
        internalExpression = result.toString();
    }
    display.innerText = currentInput;
}


function recallEquation(expression, result) {
    currentInput = result.toString();
    internalExpression = expression;
    display.innerText = currentInput;
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
    } else if (buffer.endsWith('log')) {
        buffer = buffer.slice(0, -3);
        appendLog('10')
    } else if (buffer.endsWith('asin')) {
        buffer = buffer.slice(0, -3);
        appendInverseTrigFunc('asin')
    } else if (buffer.endsWith('acos')) {
        buffer = buffer.slice(0, -3);
        appendInverseTrigFunc('acos')
    } else if (buffer.endsWith('atan')) {
        buffer = buffer.slice(0, -3);
        appendInverseTrigFunc('atan')
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
    }  else if (key === '(' || key === ')') {
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