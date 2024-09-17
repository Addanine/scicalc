let display = document.getElementById('result');
let currentInput = '';
let buffer = '';

function clearDisplay() { // Clear current input
    currentInput = '';
    display.innerText = '0';
}

function deleteLast() { // Delete last character from current input
    currentInput = currentInput.slice(0, -1);
    display.innerText = currentInput || '0';
}

function appendCharacter(character) { // Append character to current input
    if (currentInput === '0' && character !== '.') {
        currentInput = character;
    } else {
        currentInput += character;
    }
    display.innerText = currentInput;
}

function appendOperator(operator) { // Append operator to current input
    if (/[+\-*/^√]$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    display.innerText = currentInput;
}

function appendParenthesis(parenthesis) { // Append parenthesis to current input
    if (parenthesis === '(' && /[0-9)]$/.test(currentInput)) {
        currentInput += '(';
    } else if (parenthesis === ')' && /[0-9(]/.test(currentInput)) { // If current input ends with a number or open parenthesis
        currentInput += ')'; // Append closing parenthesis
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

    let expression = currentInput.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2'); // Add multiplication operator between number and parenthesis

    fetch('/calculate', { // Send expression to server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression: expression }) // Send expression as JSON
    })
    .then(response => response.json()) // Parse response as JSON
    .then(data => { // Display result
        if (data.error) {
            display.innerText = 'Error'; // Display error message
        } else {
            currentInput = data.result.toString();
            display.innerText = currentInput;
        }
    })
    .catch(error => {
        display.innerText = 'Error';
    });
}

function appendPi() {
    currentInput += 'π';
    display.innerText = currentInput;
}

function squareInput() {
    currentInput = `(${currentInput})^2`;
    display.innerText = currentInput;
}

function toggleDarkMode() { // Toggle dark mode
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function appendPi() {
    currentInput += 'π';
    display.innerText = currentInput;
}

let settingsMenuOpen = false;

function toggleSettingsMenu() { // Toggle settings menu
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.toggle('hidden');
    settingsMenuOpen = !settingsMenuOpen;
}

function closeSettingsMenu() { // Close settings menu
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.add('hidden');
    settingsMenuOpen = false;
}

document.addEventListener('keydown', (event) => { // Close settings menu on escape key press
    if (event.key === 'Escape' && settingsMenuOpen) { 
        closeSettingsMenu();
    }
});

document.addEventListener('click', (event) => { // Close settings menu on click outside of menu
    const settingsMenu = document.getElementById('settings-menu');
    const settingsButton = document.querySelector('.settings-button');
    
    if (settingsMenuOpen && !settingsMenu.contains(event.target) && !settingsButton.contains(event.target)) {
        closeSettingsMenu();
    }
});

document.addEventListener('keydown', (event) => { // Handle keyboard input
    const key = event.key;
    buffer += key;
    if (buffer.endsWith('sqrt')) {
        buffer = buffer.slice(0, -4);
        appendOperator('√');
    } else if (buffer.endsWith('pi')) {
        buffer = buffer.slice(0, -2);
        appendPi();
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

document.getElementById('dark-mode-switch').addEventListener('change', toggleDarkMode); // Toggle dark mode on switch change

window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.appendCharacter = appendCharacter;
window.appendOperator = appendOperator;
window.appendParenthesis = appendParenthesis;
window.calculate = calculate;
window.squareInput = squareInput;
window.toggleSettingsMenu = toggleSettingsMenu;