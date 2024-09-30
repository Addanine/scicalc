import React, { useState, useEffect } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentInput, setCurrentInput] = useState('');
  const [internalExpression, setInternalExpression] = useState('');
  const [buffer, setBuffer] = useState('');
  const [equationsLog, setEquationsLog] = useState([]);
  const [memoryValue, setMemoryValue] = useState(0);
  const [laterValueForLog, setLaterValueForLog] = useState('10');
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [equationsListOpen, setEquationsListOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      setBuffer(prev => prev + key);

      if (buffer.endsWith('sqrt')) {
        setBuffer(prev => prev.slice(0, -4));
        appendOperator('√');
      } else if (buffer.endsWith('log')) {
        setBuffer(prev => prev.slice(0, -3));
        appendLog('10');
      } else if (buffer.endsWith('asin')) {
        setBuffer(prev => prev.slice(0, -3));
        appendInverseTrigFunc('asin');
      } else if (buffer.endsWith('acos')) {
        setBuffer(prev => prev.slice(0, -3));
        appendInverseTrigFunc('acos');
      } else if (buffer.endsWith('atan')) {
        setBuffer(prev => prev.slice(0, -3));
        appendInverseTrigFunc('atan');
      } else if (buffer.endsWith('sin')) {
        setBuffer(prev => prev.slice(0, -3));
        appendTrigFunc('sin');
      } else if (buffer.endsWith('cos')) {
        setBuffer(prev => prev.slice(0, -3));
        appendTrigFunc('cos');
      } else if (buffer.endsWith('tan')) {
        setBuffer(prev => prev.slice(0, -3));
        appendTrigFunc('tan');
      } else if (/[0-9]/.test(key)) {
        appendCharacter(key);
      } else if (/[+\-*/^√]/.test(key)) {
        appendOperator(key);
      } else if (key === 'Enter') {
        calculate();
      } else if (key === 'Backspace') {
        deleteLast();
        setBuffer(prev => prev.slice(0, -1));
      } else if (key === '(' || key === ')') {
        appendParenthesis(key);
      } else if (key === '.') {
        appendCharacter(key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [buffer]);

  const clearDisplay = () => {
    setCurrentInput('');
    setInternalExpression('');
    setDisplay('0');
  };

  const deleteLast = () => {
    setCurrentInput(prev => prev.slice(0, -1));
    setInternalExpression(prev => prev.slice(0, -1));
    setDisplay(prev => prev.slice(0, -1) || '0');
  };

  const changePositiveNegative = () => {
    if (currentInput.charAt(0) === '-') {
      setCurrentInput(prev => prev.slice(1));
      setInternalExpression(prev => prev.slice(1));
    } else {
      setCurrentInput(prev => `-${prev}`);
      setInternalExpression(prev => `-${prev}`);
    }
    setDisplay(currentInput);
  };

  const appendCharacter = (character) => {
    if (currentInput === '0' && character !== '.') {
      setCurrentInput(character);
      setInternalExpression(character);
    } else {
      if (currentInput.includes("vlog(")) {
        const postVLog = currentInput.split("vlog(");
        const lastPart = postVLog[postVLog.length - 1];
        if (!lastPart.includes(")")) {
          setLaterValueForLog(lastPart);
        }
      }

      setCurrentInput(prev => prev + character);
      setInternalExpression(prev => prev + character);
    }
    setDisplay(currentInput + character);
  };

  const appendTrigFunc = (trigFunc) => {
    setCurrentInput(prev => prev + `${trigFunc}(`);
    setInternalExpression(prev => prev + `${trigFunc}(`);
    setDisplay(prev => prev + `${trigFunc}(`);
  };

  const appendInverseTrigFunc = (inverseTrigFunc) => {
    setCurrentInput(prev => prev + `${inverseTrigFunc}(`);
    setInternalExpression(prev => prev + `${inverseTrigFunc}(`);
    setDisplay(prev => prev + `${inverseTrigFunc}(`);
  };

  const appendLog = (logBase) => {
    if (logBase === '10') {
      setCurrentInput(prev => prev + 'log(');
      setInternalExpression(prev => prev + 'log(');
    } else if (logBase === 'e') {
      const operatorsOnly = currentInput.replace(/[0-9]+/g, "");
      const lastOperator = operatorsOnly.charAt(operatorsOnly.length - 1);
      const e = lastOperator === "" ? currentInput : currentInput.split(lastOperator);

      setCurrentInput(prev => prev + "vlog(");
      if (Array.isArray(e)) {
        setInternalExpression(prev => {
          const newExpr = prev.slice(0, -e[1].length);
          return newExpr + `log(${laterValueForLog}, ${e[e.length - 1]}`;
        });
      } else {
        setInternalExpression(prev => {
          const newExpr = prev.slice(e.length);
          return newExpr + `log(${laterValueForLog}, ${e}`;
        });
      }
    }
    setDisplay(prev => prev + (logBase === '10' ? 'log(' : 'vlog('));
  };

  const appendOperator = (operator) => {
    if (/[+\-*/^√]$/.test(currentInput)) {
      setCurrentInput(prev => prev.slice(0, -1) + operator);
      setInternalExpression(prev => prev.slice(0, -1) + operator);
    } else {
      setCurrentInput(prev => prev + operator);
      setInternalExpression(prev => prev + operator);
    }
    setDisplay(prev => prev + operator);
  };

  const appendPi = () => {
    if (/[0-9π]$/.test(currentInput)) {
      setCurrentInput(prev => prev + 'π');
      setInternalExpression(prev => prev + '*π');
    } else {
      setCurrentInput(prev => prev + 'π');
      setInternalExpression(prev => prev + 'π');
    }
    setDisplay(prev => prev + 'π');
  };

  const appendParenthesis = (parenthesis) => {
    if (parenthesis === '(' && /[0-9)]$/.test(currentInput)) {
      setCurrentInput(prev => prev + '(');
      setInternalExpression(prev => prev + '*(');
    } else if (parenthesis === ')' && /[0-9(]/.test(currentInput)) {
      setCurrentInput(prev => prev + ')');
      setInternalExpression(prev => prev + ')');
    } else {
      setCurrentInput(prev => prev + parenthesis);
      setInternalExpression(prev => prev + parenthesis);
    }
    setDisplay(prev => prev + parenthesis);
  };

  const appendExpFunc = (expFunc) => {
    if (expFunc === 'exp') {
      setCurrentInput(prev => prev + "exp(");
      setInternalExpression(prev => prev + "Math.exp(");
    } else if (expFunc === 'pow') {
      setCurrentInput(prev => prev + "^");
      setInternalExpression(prev => prev + "**");
    }
    setDisplay(prev => prev + (expFunc === 'exp' ? "exp(" : "^"));
  };

  const appendSqrt = () => {
    setCurrentInput(prev => prev + "√(");
    setInternalExpression(prev => prev + "sqrt(");
    setDisplay(prev => prev + "√(");
  };

  const calculate = () => {
    if (/\/0(?!\d)/.test(internalExpression)) {
      setDisplay('Error: Division by zero');
      return;
    }

    let expression = internalExpression.replace(/(\d)(\()/g, '$1*(').replace(/(\))(\d)/g, ')*$2');

    fetch('/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: expression })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setDisplay('Error');
      } else {
        logEquation(expression, data.result);
        setCurrentInput(data.result.toString());
        setInternalExpression(data.result.toString());
        setDisplay(data.result.toString());
      }
    })
    .catch(error => {
      setDisplay('Error');
    });
  };

  const squareInput = () => {
    setCurrentInput(prev => `(${prev})^2`);
    setInternalExpression(prev => `(${prev})^2`);
    setDisplay(prev => `(${prev})^2`);
  };

  const toggleSettingsMenu = () => {
    setSettingsMenuOpen(prev => !prev);
  };

  const toggleEquationsList = () => {
    setEquationsListOpen(prev => !prev);
  };

  const logEquation = (expression, result) => {
    setEquationsLog(prev => [...prev, { expression, result }]);
    localStorage.setItem('equations', JSON.stringify([...equationsLog, { expression, result }]));
  };

  const displayEquations = () => {
    return equationsLog.reverse().map((eq, index) => (
      <li key={index}>
        <div className='equation-container'>
          <div className='equation-text' onClick={() => recallEquation(eq.expression, eq.result)}>
            {eq.expression} = {eq.result}
          </div>
          <img 
            src="plus.svg" 
            alt="Add Equation" 
            className="add-equation" 
            onClick={(e) => {
              e.stopPropagation();
              addEquationToInput(eq.result);
            }}
            style={{cursor: 'pointer'}}
          />
        </div>
      </li>
    ));
  };

  const addEquationToInput = (result) => {
    if (/[0-9]$/.test(currentInput) || /[+\-*/]$/.test(currentInput)) {
      setCurrentInput(prev => prev + '+' + result);
      setInternalExpression(prev => prev + '+' + result);
    } else {
      setCurrentInput(result.toString());
      setInternalExpression(result.toString());
    }
    setDisplay(prev => prev + '+' + result);
  };

  const recallEquation = (expression, result) => {
    setCurrentInput(result.toString());
    setInternalExpression(expression);
    setDisplay(result.toString());
  };

  const memoryStore = () => {
    setMemoryValue(parseFloat(currentInput) || 0);
  };

  const memoryRecall = () => {
    setCurrentInput(memoryValue.toString());
    setInternalExpression(memoryValue.toString());
    setDisplay(memoryValue.toString());
  };

  const memoryClear = () => {
    setMemoryValue(0);
  };

  return (
    <div className="calculator">
      <div id="result">{display}</div>
      {/* Add buttons for all calculator functions */}
      <button onClick={clearDisplay}>C</button>
      <button onClick={deleteLast}>←</button>
      <button onClick={changePositiveNegative}>±</button>
      {/* Add more buttons for other operations */}
      <button onClick={calculate}>=</button>
      <button onClick={toggleSettingsMenu}>Settings</button>
      <button onClick={toggleEquationsList}>History</button>
      {settingsMenuOpen && (
        <div id="settings-menu">
          {/* Add settings options */}
        </div>
      )}
      {equationsListOpen && (
        <div id="equations-list">
          <ul id="equations">
            {displayEquations()}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calculator;