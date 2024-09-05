document.addEventListener('DOMContentLoaded', () => {
    let display = document.getElementById('display');
    let currentInput = '';

    function clearDisplay() {
        currentInput = '';
        display.innerText = '0';
    }

    function deleteLast() {
        currentInput = currentInput.slice(0, -1);
        display.innerText = currentInput || '0';
    }

    function appendNumber(number) {
        currentInput += number;
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
        currentInput += parenthesis;
        display.innerText = currentInput;
    }

    function calculate() {
        try {
            currentInput = eval(currentInput).toString();
            display.innerText = currentInput;
        } catch (error) {
            display.innerText = 'Error';
        }
    }

    window.clearDisplay = clearDisplay;
    window.deleteLast = deleteLast;
    window.appendCharacter = appendCharacter;
    window.appendNumber = appendNumber;
    window.appendOperator = appendOperator;
    window.appendParenthesis = appendParenthesis;
    window.calculate = calculate;

    

    //Add text to screen when typing from a keyboard
    const body = document.getElementById("body");

    body.addEventListener("keydown", (e) => {
       if (e.key == "Shift" || e.key == "Meta" || e.key == "Alt" || e.key == "Escape" || e.key == "Tab" || e.key == "CapsLock" || e.key == "Control" || e.key == "ArrowUp" || e.key == "ArrowRight" || e.key == "ArrowDown" || e.key == "ArrowLeft") {
    
        } else if (e.key == "Backspace") {
            deleteLast();
        } else if (e.key == "Enter") {
            calculate();
        } else {
            appendNumber(!e.key);
        }
    });
});

