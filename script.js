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
    // '.': { element: numberButtonElements[11], value: '.' },
    // 'plusMinus': { element: numberButtonElements[9], value: 'plusMinus' },
}

const operationButtons = {
    add: { element: operationButtonElements[2], value: '+' },
    subtract: { element: operationButtonElements[3], value: '-' },
    multiply: { element: operationButtonElements[4], value: '*' },
    divide: { element: operationButtonElements[5], value: '/' }
}

let equation = '';
let equationArray = [];
let history = [];
// let previousNumberSlice = 0;

function updateMainDisplay() {
    if (equation === '') {
        calculationDisplay.textContent = 0;
        return
    }
    calculationDisplay.textContent = equation;
}

function updateEquation(object, key) {
    if (object === operationButtons && isNaN(Number(equation[equation.length-1])) === true) return 
    equation += object[key].value;
    pushCharacter()
    return equation
}

function pushCharacter() {
    if (isNaN(Number(equation[equation.length-1])) === true) {
        equationArray.push(equation[equation.length-1]);
    } else {
        equationArray.push(Number(equation[equation.length-1]));
    }
    
    console.log(equationArray)
}

function inputEquation(object) {
    for (const key in object) {
        object[key].element.addEventListener('mousedown', () => {
            updateEquation(object, key);
            updateMainDisplay();
        });
    } 
}

inputEquation(numberButtons);
inputEquation(operationButtons);

// functionButtons.equals.addEventListener('mousedown', pushCharacter);
functionButtons.equals.addEventListener('mousedown', calculate);

function convertItemsToNumbers(array) {
    let slicePosition = 0;
    let equationArrayTemp = [];

    for (let i=0; i <= array.length; i++) {
        if (isNaN(array[i]) || i === array.length) {

            let number = Number(array.slice(slicePosition, i).toString().replaceAll(',',''));
            let operation = (array[i]);
            slicePosition = i+1;
            
            equationArrayTemp.push(number)
            
            if (array[i] !== undefined) {
                equationArrayTemp.push(operation)
            }
            
        }
        equationArray = equationArrayTemp;
    }
    return equationArray;
}

function calculate() {
    if (isNaN(Number(equation[equation.length-1])) === true) return
    convertItemsToNumbers(equationArray)
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
    equation = equationArray;
    updateMainDisplay()
    updateHistory()
}

function showResult() {
    equation = equationArray;
}

function updateHistory() {
    history.push(equation)
    if (history.length > 3) {
        history.pop();
    }
    return history
}

function clearHistory() {
    history = [];
    return history
}

function clearEquationArray() {
    equationArray = [];
    return equationArray
}

function clearCharacter() {
    equation = equation.slice(0,-1);
    equationArray.pop();
    console.log(equationArray)
    return equation
}

functionButtons.clear.addEventListener('mousedown', () => {
    clearCharacter(),
    updateMainDisplay();
})

functionButtons.allClear.addEventListener('mousedown', () => {
    equation = '';
    clearEquationArray();
    clearHistory();
    updateMainDisplay();
    return equation
})