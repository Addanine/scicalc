let display = document.getElementById('result');
let currentInput = '';
let internalExpression = '';
let buffer = '';
let equationsLog = [];
let memoryValue = 0;
var laterValueForLog = "10"




export function clearDisplay(setCurrentInput, setInternalExpression, setDisplay) {
    setCurrentInput('');
    setInternalExpression('');
    setDisplay('0');
    console.log("test")
  }
  
  // Delete the last character from the display
  export function deleteLast(currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    const newInput = currentInput.slice(0, -1);
    const newInternalExpression = internalExpression.slice(0, -1);
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput || '0');
  }
  
  // Toggle positive/negative sign
  export function changePositiveNegative(currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    let newInput = currentInput.charAt(0) === '-' ? currentInput.slice(1) : `-${currentInput}`;
    let newInternalExpression = internalExpression.charAt(0) === '-' ? internalExpression.slice(1) : `-${internalExpression}`;
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput);
  }
  
  // Append a character to the display
  export function appendCharacter(character, currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    let newInput = currentInput === '0' && character !== '.' ? character : currentInput + character;
    let newInternalExpression = currentInput === '0' && character !== '.' ? character : internalExpression + character;
    
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput);
  }
  
  // Append a trigonometric function
  export function appendTrigFunc(trigFunc, currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    const func = `${trigFunc}(`;
    setCurrentInput(currentInput + func);
    setInternalExpression(internalExpression + func);
    setDisplay(currentInput + func);
  }
  
  // Append an inverse trigonometric function
  export function appendInverseTrigFunc(inverseTrigFunc, currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    const func = `${inverseTrigFunc}(`;
    setCurrentInput(currentInput + func);
    setInternalExpression(internalExpression + func);
    setDisplay(currentInput + func);
  }
  
  // Append a logarithmic function
  export function appendLog(logBase, currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    let newInput, newInternalExpression;
    
    if (logBase === '10') {
      newInput = currentInput + 'log(';
      newInternalExpression = internalExpression + 'log(';
    } else {
      newInput = currentInput + 'log(';
      newInternalExpression = internalExpression + `log(${logBase}, `;
    }
    
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput);
  }
  
  // Append an operator to the display
  export function appendOperator(operator, currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    const newInput = /[+\-*/^√]$/.test(currentInput) ? currentInput.slice(0, -1) + operator : currentInput + operator;
    const newInternalExpression = /[+\-*/^√]$/.test(internalExpression) ? internalExpression.slice(0, -1) + operator : internalExpression + operator;
    
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput);
  }
  
  // Append Pi to the display
  export function appendPi(currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    const newInput = /[0-9π]$/.test(currentInput) ? currentInput + 'π' : currentInput + 'π';
    const newInternalExpression = /[0-9π]$/.test(internalExpression) ? internalExpression + '*π' : internalExpression + 'π';
    
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput);
  }
  
  // Append parentheses to the display
  export function appendParenthesis(parenthesis, currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    const newInput = parenthesis === '(' && /[0-9)]$/.test(currentInput) ? currentInput + '*' + parenthesis : currentInput + parenthesis;
    const newInternalExpression = parenthesis === '(' && /[0-9)]$/.test(internalExpression) ? internalExpression + '*' + parenthesis : internalExpression + parenthesis;
    
    setCurrentInput(newInput);
    setInternalExpression(newInternalExpression);
    setDisplay(newInput);
  }
  
  // Append square root to the display
  export function appendSqrt(currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay) {
    setCurrentInput(currentInput + '√(');
    setInternalExpression(internalExpression + 'sqrt(');
    setDisplay(currentInput + '√(');
  }
  
  // Calculate the expression
  export function calculate(internalExpression, setDisplay, setCurrentInput, setInternalExpression) {
    if (/\/0(?!\d)/.test(internalExpression)) {
      setDisplay('Error: Division by zero');
      return;
    }
  
    const expression = internalExpression.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2');
    
    fetch('/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setDisplay('Error');
      } else {
        setCurrentInput(data.result.toString());
        setInternalExpression(data.result.toString());
        setDisplay(data.result.toString());
      }
    })
    .catch(() => setDisplay('Error: Cannot communicate with server'));
  }
  
  // Memory functions
  export function memoryStore(currentInput, setMemoryValue) {
    setMemoryValue(parseFloat(currentInput) || 0);
  }
  
  export function memoryRecall(memoryValue, setCurrentInput, setInternalExpression, setDisplay) {
    setCurrentInput(memoryValue.toString());
    setInternalExpression(memoryValue.toString());
    setDisplay(memoryValue.toString());
  }
  
  export function memoryClear(setMemoryValue) {
    setMemoryValue(0);
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