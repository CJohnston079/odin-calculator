const calculationDisplay = document.querySelector('#calculation')

const functionKeyElements = document.querySelector('#function-panel').querySelectorAll('.button');
const numberKeyElements = document.querySelector('#numpad').querySelectorAll('.button');
const operationKeyElements = document.querySelectorAll('.operation');

const functionKeys = {
    equals: operationKeyElements[6],
    clear: operationKeyElements[1],
    allClear: operationKeyElements[0],
    memoryClear: functionKeyElements[0],
    memoryAdd: functionKeyElements[1],
    memorySubtract: functionKeyElements[2],
    memoryRecall: functionKeyElements[3],
    brackets: functionKeyElements[4],
    pi: functionKeyElements[5],
    factorial: functionKeyElements[6],
    percent: functionKeyElements[7],
    power: functionKeyElements[8],
    root: functionKeyElements[9]
}

const numberKeys = {
    '0': { element: numberKeyElements[10], value: 0 },
    '1': { element: numberKeyElements[0], value: 1 },
    '2': { element: numberKeyElements[1], value: 2 },
    '3': { element: numberKeyElements[2], value: 3 },
    '4': { element: numberKeyElements[3], value: 4 },
    '5': { element: numberKeyElements[4], value: 5 },
    '6': { element: numberKeyElements[5], value: 6 },
    '7': { element: numberKeyElements[6], value: 7 },
    '8': { element: numberKeyElements[7], value: 8 },
    '9': { element: numberKeyElements[8], value: 9 },
}

const operationKeys = {
    add: { element: operationKeyElements[2], value: '+' },
    subtract: { element: operationKeyElements[3], value: '-' },
    multiply: { element: operationKeyElements[4], value: '*' },
    divide: { element: operationKeyElements[5], value: '/' }
}

let calculation = 0;
let history = [];

function updateMainDisplay() {
    calculationDisplay.textContent = calculation;
}

function updateCalculation(value) {
    calculation += value;
    console.log(calculation);
    return calculation
}

function inputEquation(object) {
    for (const key in object) {
        object[key].element.addEventListener('mousedown', () => {
            updateCalculation(object[key].value);
            updateMainDisplay();
        });
    } 
}

inputEquation(numberKeys);
inputEquation(operationKeys);

functionKeys.equals.addEventListener('mousedown', calculate);

function calculate() {
    console.log('calculating...')
    history.push(calculation);
}

functionKeys.clear.addEventListener('mousedown', () => {
    clearCharacter(),
    updateMainDisplay();
})

function clearCharacter() {
    calculation = calculation.slice(0,-1)
    return calculation
}

functionKeys.allClear.addEventListener('mousedown', () => {
    calculation = 0;
    updateMainDisplay();
    return calculation
})