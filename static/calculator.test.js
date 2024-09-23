// calculator.test.js
// NOTICE: The following snippet is a jest test file. It is used to test the functions in calculator.js
// OTHER NOTICE: PLEASE INSTALL JEST USING "npm install jest --save-dev" BEFORE RUNNING THE TESTS
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
let window, document;

beforeEach(() => {
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
    global.navigator = {
        userAgent: 'node.js',
    };
    require('./script'); // Ensure the script is loaded in the DOM
});

describe('Calculator Functions', () => {
    test('appendCharacter should add character to display', () => {
        window.appendCharacter('1');
        expect(document.getElementById('result').innerText).toBe('1');
    });

    test('appendOperator should add operator to display', () => {
        window.appendOperator('+');
        expect(document.getElementById('result').innerText).toBe('+');
    });

    test('appendTrigFunc should add trigonometric function to display', () => {
        window.appendTrigFunc('sin');
        expect(document.getElementById('result').innerText).toBe('sin(');
    });

    test('appendLog should add log function to display', () => {
        window.appendLog('10');
        expect(document.getElementById('result').innerText).toBe('log(');
    });

    test('clearDisplay should clear the display', () => {
        window.clearDisplay();
        expect(document.getElementById('result').innerText).toBe('0');
    });

    test('deleteLast should delete the last character from display', () => {
        window.appendCharacter('123');
        window.deleteLast();
        expect(document.getElementById('result').innerText).toBe('12');
    });

    test('makeNegative should toggle the sign of the number', () => {
        window.appendCharacter('5');
        window.makeNegative();
        expect(document.getElementById('result').innerText).toBe('-5');
    });

    test('appendParenthesis should add parenthesis to display', () => {
        window.appendParenthesis('(');
        expect(document.getElementById('result').innerText).toBe('(');
    });

    test('appendPi should add π to display', () => {
        window.appendPi();
        expect(document.getElementById('result').innerText).toBe('π');
    });

    test('squareInput should square the input', () => {
        window.appendCharacter('2');
        window.squareInput();
        expect(document.getElementById('result').innerText).toBe('(2)^2');
    });

    test('memoryStore should store the current value', () => {
        window.appendCharacter('10');
        window.memoryStore();
        expect(window.memoryValue).toBe(10);
    });

    test('memoryRecall should recall the stored value', () => {
        window.memoryValue = 10;
        window.memoryRecall();
        expect(document.getElementById('result').innerText).toBe('10');
    });

    test('memoryClear should clear the stored value', () => {
        window.memoryValue = 10;
        window.memoryClear();
        expect(window.memoryValue).toBe(0);
    });

    test('appendInverseTrigFunc should add inverse trigonometric function to display', () => {
        window.appendInverseTrigFunc('asin');
        expect(document.getElementById('result').innerText).toBe('asin(');
    });

    test('appendExpFunc should add exponential function to display', () => {
        window.appendExpFunc('exp');
        expect(document.getElementById('result').innerText).toBe('exp(');
    });
});