const calculationDisplay = document.querySelector('#calculation')

const functionButtonElements = document.querySelector('#function-panel').querySelectorAll('.button');
const numberButtonElements = document.querySelector('#numpad').querySelectorAll('.button');
const operationButtonElements = document.querySelectorAll('.operation');

const functionButtons = {
    equals: operationButtonElements[6],
    clear: operationButtonElements[1],
    allClear: operationButtonElements[0],
    memoryClear: functionButtonElements[0],
    memoryAdd: functionButtonElements[1],
    memorySubtract: functionButtonElements[2],
    memoryRecall: functionButtonElements[3],
    brackets: functionButtonElements[4],
    pi: functionButtonElements[5],
    factorial: functionButtonElements[6],
    percent: functionButtonElements[7],
    power: functionButtonElements[8],
    root: functionButtonElements[9]
}

const numberButtons = {
    '0': { element: numberButtonElements[10], value: 0 },
    '1': { element: numberButtonElements[0], value: 1 },
    '2': { element: numberButtonElements[1], value: 2 },
    '3': { element: numberButtonElements[2], value: 3 },
    '4': { element: numberButtonElements[3], value: 4 },
    '5': { element: numberButtonElements[4], value: 5 },
    '6': { element: numberButtonElements[5], value: 6 },
    '7': { element: numberButtonElements[6], value: 7 },
    '8': { element: numberButtonElements[7], value: 8 },
    '9': { element: numberButtonElements[8], value: 9 },
}

const operationButtons = {
    add: { element: operationButtonElements[2], value: '+' },
    subtract: { element: operationButtonElements[3], value: '-' },
    multiply: { element: operationButtonElements[4], value: '*' },
    divide: { element: operationButtonElements[5], value: '/' }
}

let calculation = '';
let history = [];

function updateMainDisplay() {
    calculationDisplay.textContent = calculation;
}

function updateCalculation(button) {
    calculation += button.element.textContent;
    console.log(calculation);
    return calculation
}

function inputEquation(object) {
    for (const key in object) {
        object[key].element.addEventListener('mousedown', () => {
            updateCalculation(object[key]);
            updateMainDisplay();
        });
    } 
}

inputEquation(numberButtons);
inputEquation(operationButtons);

functionButtons.equals.addEventListener('mousedown', calculate);

function calculate() {
    console.log('calculating...')
    history.push(calculation);
}

functionButtons.clear.addEventListener('mousedown', () => {
    clearCharacter(),
    updateMainDisplay();
})

function clearCharacter() {
    calculation = calculation.slice(0,-1)
    return calculation
}

functionButtons.allClear.addEventListener('mousedown', () => {
    calculation = 0;
    updateMainDisplay();
    return calculation
})