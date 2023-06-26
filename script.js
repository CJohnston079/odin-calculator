const calculationDisplay = document.querySelector('#calculation');

const functionButtonElements = document.querySelector('#function-panel').querySelectorAll('.button');
const numberButtonElements = document.querySelector('#numpad').querySelectorAll('.button');
const operationButtonElements = document.querySelectorAll('.operation');

const functionButtons = {
    equals: operationButtonElements[6],
    clear: operationButtonElements[1],
    allClear: operationButtonElements[0],
    brackets: functionButtonElements[4],
    pi: functionButtonElements[5],
    factorial: functionButtonElements[6],
    percent: functionButtonElements[7],
    power: functionButtonElements[8],
    root: functionButtonElements[9]
}

const memoryButtons = {
    memoryClear: functionButtonElements[0],
    memoryAdd: functionButtonElements[1],
    memorySubtract: functionButtonElements[2],
    memoryRecall: functionButtonElements[3]
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
let addNegativeNum = false;
let addNegativeBrackets = true;
let bracketsEnabled = false;
let decimalPlaces = 1000000000;

numberButtons['.'].element.addEventListener('mousedown', addFloatingPoint);
numberButtons['±'].element.addEventListener('mousedown', toggleNegativeNum);

functionButtons.equals.addEventListener('mousedown', calculate);

functionButtons.brackets.addEventListener('mousedown', toggleBrackets);
functionButtons.pi.addEventListener('mousedown', insertPi);
functionButtons.factorial.addEventListener('mousedown', insertFactorial);

enableEquationInput(numberButtons);
enableEquationInput(operationButtons);

function enableEquationInput(object) {
    for (const key in object) {
        if (object[key].value === '.' || object[key].value === '±') continue;
        object[key].element.addEventListener('mousedown', () => {
            updateEquation(object, key)
            // updateMainDisplay();
        });
    }
}

function round(num, decimalPlaces) {
    num = Math.round(num*decimalPlaces)/decimalPlaces;
    return num;
}

function updateEquation(object, key) {
    if (object === operationButtons && isNaN(Number(equationStr[equationStr.length-1])) === true && equationArr[equationArr.length-1] !== '!') {
        if (object[key].value === '-' && addNegativeNum === false) {
            addNegativeNum = true;
            console.log(`Add negative: ${addNegativeNum}`);
            equationStr += object[key].value;
            updateMainDisplay();
            return;
        } else if (equationStr[equationStr.length-1] !== ')') {
            console.log('Please enter a valid sign before operating.');
            return;
        }
    }

    if (object === numberButtons ) {
        if (equationSolved === true) {
            equationStr = '';
            equationArr = [];
        }
        if (equationArr[equationArr.length-1] === ')') {
            equationArr.push('*');
        }
    }

    if (object === operationButtons) floatingPointAdded = false;
    
    equationSolved = false;
    equationStr += object[key].value;
    pushToEquationArr();
    updateMainDisplay();
}

function updateMainDisplay() {
    if (equationStr === '') {
        calculationDisplay.textContent = 0;
        return;
    }
    calculationDisplay.textContent = equationStr;
    console.log(equationArr);
}

function insertPi() {
    if (floatingPointAdded === true) return;
    equationStr += round(Math.PI, 100);
    equationArr.push(Math.PI);
    floatingPointAdded = true;
    updateMainDisplay()
}

function insertFactorial() {
    if (isNaN(Number(equationStr[equationStr.length-1]))) return;
    equationStr += '!';
    equationArr.push('!');
    updateMainDisplay()
}

function addFloatingPoint() {
    if (floatingPointAdded === true) return;
    floatingPointAdded = true;

    if (equationSolved === true || equationStr === '' || isNaN(Number(equationStr[equationStr.length-1]))) {
        updateEquation(numberButtons, ['0'])
    }

    updateEquation(numberButtons, ['.']),
    updateMainDisplay();
}

function toggleNegativeNum() {
    for (let i = equationArr.length-1; i >= 0; i--) {
        if (i === 0 || isNaN(Number(equationArr[i-1])) === true && equationArr[i-1] !== '.') {
            if (equationArr[i] === '(' || equationArr[i] === ')') return;
            equationArr[i] *= -1;
            equationArrToString(equationArr);
            if (Object.is(equationArr[i], -0) === true) { // add minus sign to floating point numbers beginning with 0
                equationStr[i] *= equationStr = equationStr.substring(0,i) + '-0' + equationStr.substring(i+1, equationStr.length); 
            }
            break;
        }
    }
    updateMainDisplay();
}

function toggleBrackets() {
    if (bracketsEnabled === true && equationStr[equationStr.length-1] === '(') return;
    if (equationStr[equationStr.length-1] === '.') return;

    if (addNegativeNum === true) {
        addNegativeNum = false
        console.log(`Add negative: ${addNegativeNum}`);
        addNegativeBrackets = true;
        console.log(`Add negative brackets: ${addNegativeBrackets}`);
    }

    if (equationSolved === true) {
        equationStr = '';
        equationArr = [];
        equationSolved = false;
    }    

    if (bracketsEnabled === false) {
        equationStr += '(';
        bracketsEnabled = true;
        if (isNaN(equationArr[equationArr.length-1]) === false) {
            equationArr.push('*');
        }
    } else {
        equationStr += ')';
        bracketsEnabled = false;
    }
    pushToEquationArr();
    updateMainDisplay();
}

function pushToEquationArr() {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true) {
        equationArr.push(equationStr[equationStr.length-1]);
    } else {
        equationArr.push(Number(equationStr[equationStr.length-1]));
        if (addNegativeNum === true) {
            equationArr[equationArr.length-1] *= -1;
            addNegativeNum = false;
            console.log(`Add negative: ${addNegativeNum}`);
        }
    }
}

function convertItemsToNumbers(arr) {
    let slicePosition = 0;
    let tempArr = [];

    for (let i=0; i <= arr.length; i++) {
        if (arr[i] !== '.' && isNaN(arr[i]) || i === arr.length) {

            let num = Number(arr.slice(slicePosition, i).toString().replaceAll(',',''));
            let operation = arr[i];
            
            if (Object.is(arr[slicePosition], -0) === true) {
                num *= -1; // convert floating points numbers beginning with 0 to negative
            }

            slicePosition = i+1;
           
            tempArr.push(num);
            
            if (arr[i] !== undefined) {
                tempArr.push(operation);
            }
        }
    }
    console.log(`Converted array: [${tempArr}]`);
    arr = tempArr;
    return arr;
}

function calculate() {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true && equationStr[equationStr.length-1] !== ')' && equationStr[equationStr.length-1] !== '!') return
    
    if (bracketsEnabled === true) {
        if (isNaN(Number(equationStr[equationStr.length-1])) === false) {
            equationArr.push(')');
            bracketsEnabled = false;
        } else {
            return;
        }
    }
    
    if (equationArr.includes('(') === true) {
        calculateBrackets();
    }
    equationArr = convertItemsToNumbers(equationArr);

    console.log(`Equation to be passed into performOperations:\n${equationArr}`)
    
    performOperations(equationArr);

    equationSolved = true;
    equationArrToString(equationArr);
    equationStr = (round(equationStr, decimalPlaces)).toString();
    solutionToArray(equationStr);
    updateMainDisplay();
    updateHistory();
}

function calculateBrackets() {
    let slicePosition = 0;
    let bracketEquation = [];
    let deleteCount = 0

    for (let i = 0; i < equationArr.length; i++) {
        if (equationArr[i] === '(') {
            slicePosition = i;
        }
        if (equationArr[i] === ')') {
            console.log('Calculating brackets...');

            bracketEquation = equationArr.slice(slicePosition+1, i);
            deleteCount = bracketEquation.length+2;
            console.log(`Bracket equation:[${bracketEquation}]`);

            bracketEquation = convertItemsToNumbers(bracketEquation);
            console.log(`Bracket equation after calculation: [${bracketEquation[0]}]`);

            performOperations(bracketEquation);
            
            if (addNegativeBrackets === true) {
                bracketEquation[0] *= -1;
                console.log(`Brackets multiplied by -1 = [${bracketEquation[0]}]`);

                addNegativeBrackets = false;
                console.log(`Add negative brackets: ${addNegativeBrackets}`);
            }
            
            equationArr.splice(slicePosition, deleteCount, bracketEquation[0]);

            i = slicePosition+1;
        }
    }
}

function performOperations(arr) {
    console.log(`Performing operations... ${arr}`);

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '!') {
            arr.splice(i - 1, 3, calculateFactorial(arr[i-1]));
            i--;
        }
    }
  
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '*') {
            arr.splice(i - 1, 3, arr[i - 1] * arr[i + 1]);
            i--;
        }
        if (arr[i] === '/') {
            arr.splice(i - 1, 3, arr[i - 1] / arr[i + 1]);
            i--;
        }
    }

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '+') {
            arr.splice(i - 1, 3, arr[i - 1] + arr[i + 1]);
            i--;
        }
        if (arr[i] === '-') {
            arr.splice(i - 1, 3, arr[i - 1] - arr[i + 1]);
            i--;
        }
    }
    console.log(arr)
    return arr[0];
}

function calculateFactorial(num) {
    for (let i = num-1; i >= 1; i--) {
        num *= i;
        console.log(num);
    }
    return num
}

function equationArrToString(arr) {
    equationStr = arr.join('');
    return equationStr;
}

function solutionToArray(str) {
    equationArr = Array.from(str);
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

    if (addNegativeNum === true) {
        addNegativeNum = false;
        console.log(`Add negative: ${addNegativeNum}`);
        equationStr = equationStr.slice(0,-1);
        updateMainDisplay();
        return;
    }
    if (equationStr[equationStr.length-2] === '-' && isNaN(Number(equationStr[equationStr.length-3])) === true) addNegativeNum = true;

    if (equationStr[equationStr.length-1] === '(') {
        bracketsEnabled = false;
    } else if (equationStr[equationStr.length-1] === ')') {
        bracketsEnabled = true;
    }

    equationStr = equationStr.slice(0,-1);
    equationArr.pop();
    updateMainDisplay();
    return equationStr;
}

function clearAll() {
    equationStr = '';
    equationSolved = false;
    floatingPointAdded = false;
    addNegativeNum = false;
    bracketsEnabled = false
    clearEquationArr();
    clearHistory();
    updateMainDisplay();
    console.clear();
    return equationStr;
}

function clearHistory() {
    history = [];
    return history;
}

function clearEquationArr() {
    equationArr = [];
    return equationArr;
}
