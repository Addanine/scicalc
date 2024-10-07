import React, { useState, useEffect } from 'react';
<button onClick={() => appendCharacter('1', currentInput, internalExpression, setCurrentInput, setInternalExpression, setDisplay)}>1</button>
import './style.css';


import {
  clearDisplay,
  deleteLast,
  appendCharacter,
  appendOperator,
  appendParenthesis,
  appendTrigFunc,
  appendInverseTrigFunc,
  appendLog,
  appendPi,
  appendSqrt,
  calculate,
  memoryStore,
  memoryRecall,
  memoryClear,
} from './calculator.js';


function App() {
  // State variables to store input, internal expression, and memory
  const [currentInput, setCurrentInput] = useState('');
  const [internalExpression, setInternalExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [memoryValue, setMemoryValue] = useState(0);
  const [equations, setEquations] = useState([]);

  // Clear the display
  const clearDisplay = () => {
    setCurrentInput('');
    setInternalExpression('');
    setDisplay('0');
  };

  // Append a character to the display
  const appendCharacter = (character) => {
    const newInput = currentInput + character;
    setCurrentInput(newInput);
    setInternalExpression(newInput);
    setDisplay(newInput);
  };

  // Handle calculation by sending a request to the backend
  const calculate = async () => {
    if (/\/0(?!\d)/.test(internalExpression)) {
      setDisplay('Error: Division by zero');
      return;
    }

    // Prepare the expression
    const expression = internalExpression.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2');

    // Send calculation to backend
    try {
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });
      const data = await response.json();

      if (data.error) {
        setDisplay('Error');
      } else {
        setCurrentInput(data.result.toString());
        setInternalExpression(data.result.toString());
        setDisplay(data.result.toString());
      }
    } catch (error) {
      setDisplay('Error: Cannot communicate with server');
    }
  };

  // Add equation to history
  const logEquation = (expression, result) => {
    const newEquations = [...equations, { expression, result }];
    setEquations(newEquations);
    localStorage.setItem('equations', JSON.stringify(newEquations));
  };

  // Render calculator buttons
  const renderButtons = () => {
    const buttons = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '0', '=', 'C'];
    return buttons.map((btn) => (
      <button
        key={btn}
        onClick={() => {
          if (btn === '=') calculate();
          else if (btn === 'C') clearDisplay();
          else appendCharacter(btn);
        }}
      >
        {btn}
      </button>
    ));
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">{renderButtons()}</div>
    </div>
  );
}


export default App;


