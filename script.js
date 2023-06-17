const calculationDisplay = document.querySelector('#calculation');

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
    '.': { element: numberButtonElements[11], value: '.' },
    // 'plusMinus': { element: numberButtonElements[9], value: 'plusMinus' },
}

const operationButtons = {
    add: { element: operationButtonElements[2], value: '+' },
    subtract: { element: operationButtonElements[3], value: '-' },
    multiply: { element: operationButtonElements[4], value: '*' },
    divide: { element: operationButtonElements[5], value: '/' }
}

let equationDisplay = '';
let equationArray = [];
let history = [];

functionButtons.equals.addEventListener('mousedown', calculate);

enableEquationInput(numberButtons);
enableEquationInput(operationButtons);

function enableEquationInput(object) {
    for (const key in object) {
        object[key].element.addEventListener('mousedown', () => {
            updateEquation(object, key);
            updateMainDisplay();
        });
    } 
}

function updateEquation(object, key) {
    if (object === operationButtons && isNaN(Number(equationDisplay[equationDisplay.length-1])) === true) return // prevents user from entering consecutive operations
    equationDisplay += object[key].value;
    pushToEquationArray();
}

function updateMainDisplay() {
    if (equationDisplay === '') {
        calculationDisplay.textContent = 0;
        return;
    }
    calculationDisplay.textContent = equationDisplay;
    console.log(equationArray);
}

function pushToEquationArray() {
    if (isNaN(Number(equationDisplay[equationDisplay.length-1])) === true) {
        equationArray.push(equationDisplay[equationDisplay.length-1]);
    } else {
        equationArray.push(Number(equationDisplay[equationDisplay.length-1]));
    }
}

function calculate() {
    if (isNaN(Number(equationDisplay[equationDisplay.length-1])) === true) return
    convertItemsToNumbers(equationArray);
    for (let i =0; i < equationArray.length; i++) {
        if (equationArray[i] === '*') {
            equationArray.splice(i-1, 3, equationArray[i-1]*equationArray[i+1]);
        }
        if (equationArray[i] === '/') {
            equationArray.splice(i-1, 3, equationArray[i-1]/equationArray[i+1]);
        }
    }
    for (let i =0; i < equationArray.length; i++) {
        if (equationArray[i] === '+') {
            equationArray.splice(i-1, 3, equationArray[i-1]+equationArray[i+1]);
        }
        if (equationArray[i] === '-') {
            equationArray.splice(i-1, 3, equationArray[i-1]-equationArray[i+1]);
        }
    }
    resultToString();
    updateMainDisplay();
    resetEquationArray()
    updateHistory();
}

function convertItemsToNumbers(array) {
    let slicePosition = 0;
    let equationArrayTemp = [];

    for (let i=0; i <= array.length; i++) {
        if (isNaN(array[i]) || i === array.length) {

            let number = Number(array.slice(slicePosition, i).toString().replaceAll(',',''));
            let operation = (array[i]);
            slicePosition = i+1;
            
            equationArrayTemp.push(number);
            
            if (array[i] !== undefined) {
                equationArrayTemp.push(operation);
            }
        }
    }
    equationArray = equationArrayTemp;
    return equationArray;
}

function resultToString() {
    equationDisplay = equationArray.toString();
    return equationDisplay;
}

function resetEquationArray() {
    equationArray = Array.from(equationDisplay);
    return equationArray;
}

function updateHistory() {
    history.push(equationDisplay)
    if (history.length > 3) {
        history.pop();
    }
    return history;
}

functionButtons.clear.addEventListener('mousedown', clearCharacter);
functionButtons.allClear.addEventListener('mousedown', clearAll);

function clearCharacter() {
    equationDisplay = equationDisplay.slice(0,-1);
    equationArray.pop();
    updateMainDisplay();
    return equationDisplay
}

function clearAll() {
    equationDisplay = '';
    clearEquationArray();
    clearHistory();
    updateMainDisplay();
    console.clear();
    return equationDisplay;
}

function clearHistory() {
    history = [];
    return history;
}

function clearEquationArray() {
    equationArray = [];
    return equationArray;
}
