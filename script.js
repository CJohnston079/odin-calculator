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
    '±': { element: numberButtonElements[9], value: '±' },
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
let floatingPointAdded = false;

numberButtons['.'].element.addEventListener('mousedown', addFloatingPoint);
numberButtons['±'].element.addEventListener('mousedown', toggleNegativeNum);

functionButtons.equals.addEventListener('mousedown', calculate);

enableEquationInput(numberButtons);
enableEquationInput(operationButtons);

function enableEquationInput(object) {
    for (const key in object) {
        if (object[key].value === '.' || object[key].value === '±') continue;
        object[key].element.addEventListener('mousedown', () => {
            updateEquation(object, key),
            updateMainDisplay();
        });
    }
}

function updateEquation(object, key) {
    if (object === operationButtons && isNaN(Number(equationStr[equationStr.length-1])) === true) return // prevents entry of consecutive operations
    
    if (object === numberButtons && equationSolved === true) {
        equationStr = '';
        equationArr = [];
    }

    if (object === operationButtons) floatingPointAdded = false;
    
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


function addFloatingPoint() {
    if (floatingPointAdded === true) return
    floatingPointAdded = true;

    if (equationSolved === true || equationStr === '' || isNaN(Number(equationStr[equationStr.length-1]))) {
        updateEquation(numberButtons, ['0'])
    }

    updateEquation(numberButtons, ['.']),
    updateMainDisplay();
}

function toggleNegativeNum() {
    for (let i = equationStr.length-1; i >= 0; i--) {
        if (i === 0) {
            if (equationArr[i] > 0) {
                equationStr = equationStr.substring(0,i) + '-' + equationStr.substring(i, equationStr.length);
            } else if (equationArr[i] < 0) {
                equationStr = equationStr.substring(i+1, equationStr.length);
            }
            equationArr[i] = equationArr[i]*-1;
            break  
        }
        if (isNaN(Number(equationStr[i])) === true) {
            if (equationArr[i+1] > 0) {
                equationStr = equationStr.substring(0,i+1) + '-' + equationStr.substring(i+1, equationStr.length);
                equationArr[i+1] = equationArr[i+1]*-1;
            } else {
                equationStr = equationStr.substring(0,i) + equationStr.substring(i+1, equationStr.length);
                equationArr[i] = equationArr[i]*-1;
            }
            break
        }
    }
    updateMainDisplay()
}

function pushToequationArr() {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true) {
        equationArr.push(equationStr[equationStr.length-1]);
    } else {
        equationArr.push(Number(equationStr[equationStr.length-1]));
    }
}

function convertItemsToNumbers(arr) {
    let slicePosition = 0;
    let tempArr = [];

    for (let i=0; i <= arr.length; i++) {
        if (arr[i] !== '.' && isNaN(arr[i]) || i === arr.length) {

            let num = Number(arr.slice(slicePosition, i).toString().replaceAll(',',''));
            let operation = (arr[i]);
            slicePosition = i+1;
            
            tempArr.push(num);
            
            if (arr[i] !== undefined) {
                tempArr.push(operation);
            }
        }
    }
    equationArr = tempArr;
    return equationArr;
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
    if (equationStr[equationStr.length-1] === '.') floatingPointAdded = false;
    equationStr = equationStr.slice(0,-1);
    equationArr.pop();
    updateMainDisplay();
    return equationStr
}

function clearAll() {
    equationStr = '';
    floatingPointAdded = false;
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
