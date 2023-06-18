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

let equationStr = '';
let equationArr = [];
let history = [];
let equationSolved = false;

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
    if (object === operationButtons && isNaN(Number(equationStr[equationStr.length-1])) === true) return // prevents user from entering consecutive operations
    
    if (object === numberButtons && equationSolved === true) {
        equationStr = '';
        equationArr = [];
    }
    
    equationSolved = false;
    equationStr += object[key].value;
    pushToequationArr();
}

function updateMainDisplay() {
    if (equationStr === '') {
        calculationDisplay.textContent = 0;
        return;
    }
    calculationDisplay.textContent = equationStr;
    console.log(equationArr);
}

function pushToequationArr() {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true) {
        equationArr.push(equationStr[equationStr.length-1]);
    } else {
        equationArr.push(Number(equationStr[equationStr.length-1]));
    }
}

function calculate() {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true) return
    convertItemsToNumbers(equationArr);
    for (let i =0; i < equationArr.length; i++) {
        if (equationArr[i] === '*') {
            equationArr.splice(i-1, 3, equationArr[i-1]*equationArr[i+1]);
        }
        if (equationArr[i] === '/') {
            equationArr.splice(i-1, 3, equationArr[i-1]/equationArr[i+1]);
        }
    }
    for (let i =0; i < equationArr.length; i++) {
        if (equationArr[i] === '+') {
            equationArr.splice(i-1, 3, equationArr[i-1]+equationArr[i+1]);
        }
        if (equationArr[i] === '-') {
            equationArr.splice(i-1, 3, equationArr[i-1]-equationArr[i+1]);
        }
    }
    equationSolved = true;
    solutionToString();
    solutionToArray();
    updateMainDisplay();
    updateHistory();
}

function convertItemsToNumbers(arr) {
    let slicePosition = 0;
    let tempArr = [];

    for (let i=0; i <= arr.length; i++) {
        if (arr[i] !== '.' && isNaN(arr[i]) || i === arr.length) {

            let number = Number(arr.slice(slicePosition, i).toString().replaceAll(',',''));
            let operation = (arr[i]);
            slicePosition = i+1;
            
            tempArr.push(number);
            
            if (arr[i] !== undefined) {
                tempArr.push(operation);
            }
        }
    }
    equationArr = tempArr;
    return equationArr;
}

function solutionToString() {
    equationStr = equationArr.toString();
    return equationStr;
}

function solutionToArray() {
    equationArr = Array.from(equationStr);
    return equationArr;
}

function updateHistory() {
    history.push(equationStr)
    if (history.length > 3) {
        history.pop();
    }
    return history;
}

functionButtons.clear.addEventListener('mousedown', clearCharacter);
functionButtons.allClear.addEventListener('mousedown', clearAll);

function clearCharacter() {
    equationStr = equationStr.slice(0,-1);
    equationArr.pop();
    updateMainDisplay();
    return equationStr
}

function clearAll() {
    equationStr = '';
    clearequationArr();
    clearHistory();
    updateMainDisplay();
    console.clear();
    return equationStr;
}

function clearHistory() {
    history = [];
    return history;
}

function clearequationArr() {
    equationArr = [];
    return equationArr;
}
