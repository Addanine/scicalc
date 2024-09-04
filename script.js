// Calculate the expression and update the display
function calculate(expression) {
    let result;

    try {
        // Evaluate the expression
        result = eval(expression);
    } catch (error) {
        result = "Error";
    }

    document.getElementById('result').innerText = result;
}

// Clear the display
function clearDisplay() {
    document.getElementById('result').innerText = '0';
}

// Delete the last character from the display
function deleteLast() {
    let display = document.getElementById('result');
    display.innerText = display.innerText.slice(0, -1) || '0';
}

// Append a character to the display
function appendCharacter(character) {
    let display = document.getElementById('result');
    if (display.innerText === '0' && character !== '.') {
        display.innerText = character;
    } else {
        display.innerText += character;
    }
}

// Append an operator to the display
function appendOperator(operator) {
    let display = document.getElementById('result');
    if (/[+\-*/]$/.test(display.innerText)) {
        display.innerText = display.innerText.slice(0, -1) + operator;
    } else {
        display.innerText += operator;
    }
}

// Append parenthesis to the display
function appendParenthesis(parenthesis) {
    let display = document.getElementById('result');
    if (display.innerText === '0') {
        display.innerText = parenthesis;
    } else {
        display.innerText += parenthesis;
    }
}

//Add text to screen when typing from a keyboard
const body = document.getElementById("body");

body.addEventListener("keydown", (e) => {
    display.innerText += !e.key;
});