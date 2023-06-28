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
let isEquationSolved = false;
let floatingPointInputted = false;
let isFactorialInputted = false;
let insertNegativeNum = false;
let isNegativeNum = false;
let toggleNegativeBrackets = false;
let areBracketsEnabled = false;
let decimalPlaces = 1000000000;

for (const key in operationButtons) {
    operationButtons[key].element.addEventListener('mousedown', () => {
        inputOperation(key)
    });
}

for (const key in numberButtons) {
    if (numberButtons[key].value === '.' || numberButtons[key].value === '±') continue;
    numberButtons[key].element.addEventListener('mousedown', () => {
        inputNumber(key)
    });
}

numberButtons['.'].element.addEventListener('mousedown', inputFloatingPoint);
numberButtons['±'].element.addEventListener('mousedown', toggleNegativeNum);

functionButtons.equals.addEventListener('mousedown', calculate);

functionButtons.brackets.addEventListener('mousedown', toggleBrackets);
functionButtons.pi.addEventListener('mousedown', inputPi);
functionButtons.factorial.addEventListener('mousedown', inputFactorial);

function udpdateEquation(object, key) {
    isEquationSolved === true ? isEquationSolved = false : {};
    equationStr += object[key].value;
    pushToEquationArr();
    updateDisplay();
}

function updateDisplay() {
    equationStr !== '' ? calculationDisplay.textContent = equationStr : 
    calculationDisplay.textContent = 0;
    console.log(equationArr);
}

function round(num, decimalPlaces) {
    num = Math.round(num*decimalPlaces)/decimalPlaces;
    return num;
}

function updateEquationOld(object, key) {
    // if (object === operationButtons && isNaN(Number(equationStr[equationStr.length-1])) === true && equationArr[equationArr.length-1] !== '!') {
    //     if (object[key].value === '-' && insertNegativeNum === false) {
    //         insertNegativeNum = true;
    //         console.log(`Add negative: ${insertNegativeNum}`);
    //         equationStr += object[key].value;
    //         isNegativeNum = true;
    //         updateDisplay();
    //         return;
    //     } else if (equationStr[equationStr.length-1] !== ')') {
    //         console.log('Please enter a valid sign before operating.');
    //         return;
    //     }
    // }

    // if (object === numberButtons ) {
    //     if (isEquationSolved === true) {
    //         clear.equation();
    //     }
    //     if (equationArr[equationArr.length-1] === ')') {
    //         equationArr.push('*');
    //     }
    // }

    // if (object === operationButtons) {
    //     floatingPointInputted = false;
    //     isFactorialInputted = false;
    //     isNegativeNum = false;
    // } 
    
    // isEquationSolved = false;
    // udpdateEquation(object, key);
}

function inputOperation(key) {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true && equationArr[equationArr.length-1] !== '!') {
        if (operationButtons[key].value === '-' && insertNegativeNum === false) {
            insertNegativeNum = true;
            console.log(`Add negative: ${insertNegativeNum}`);
            equationStr += operationButtons[key].value;
            isNegativeNum = true;
            updateDisplay();
            return;
        } else if (equationStr[equationStr.length-1] !== ')') {
            console.log('Please enter a valid sign before operating.');
            return;
        }
    }
    floatingPointInputted = false;
    isFactorialInputted = false;
    isNegativeNum = false;
    udpdateEquation(operationButtons, key);
}

function inputNumber(key) {
    if (isEquationSolved === true) {
        clear.equation();
    }
    if (equationArr[equationArr.length-1] === ')') {
        equationArr.push('*'); // adds multipliers between brackets if no operation is specified
    }
    udpdateEquation(numberButtons, key)
}

function inputPi() {
    if (floatingPointInputted === true) return;
    equationStr += round(Math.PI, 100);
    equationArr.push(Math.PI);
    floatingPointInputted = true;
    updateDisplay()
}

function inputFactorial() {
    if (isNegativeNum === true || floatingPointInputted === true) return;
    if (isNaN(Number(equationStr[equationStr.length-1])) && isFactorialInputted === false) return;
    // udpdateEquation(functionButtons, functionButtons.factorial)
    equationStr += '!';
    equationArr.push('!');
    updateDisplay()
    isFactorialInputted = true;
}

function inputPercentage() {
    /*
    Determine what a specific percentage is of another number.
    For example, enter 600 x 15 and hit the percent key.
    You see the answer is 90, which means that 90 is 15 percent of 600.

    Calculate a percentage of a number and add it to the number.
    For example, enter 34 + 7 and hit the percent key.
    You immediately see the answer is 36.38.
    This is useful for figuring sales tax on purchase items.

    Figure a percentage of a number and subtract it from the number.
    For example, enter 79 – 30 and hit the percent key.
    You see the answer is 55.3.
    This is useful for figuring sale prices on purchase items.
    */
}

function inputFloatingPoint() {
    if (floatingPointInputted === true) return;
    floatingPointInputted = true;

    if (isEquationSolved === true || equationStr === '' || isNaN(Number(equationStr[equationStr.length-1]))) {
        updateEquationOld(numberButtons, ['0'])
    }

    updateEquationOld(numberButtons, ['.']),
    updateDisplay();
}

function toggleNegativeNum() {
    if (isFactorialInputted === true) return;
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
    isNegativeNum = true;
    updateDisplay();
}

function toggleBrackets() {
    if (areBracketsEnabled === true && equationStr[equationStr.length-1] === '(') return;
    if (equationStr[equationStr.length-1] === '.') return;

    if (insertNegativeNum === true) {
        insertNegativeNum = false
        console.log(`Add negative: ${insertNegativeNum}`);
        toggleNegativeBrackets = true;
        console.log(`Add negative brackets: ${toggleNegativeBrackets}`);
    }

    if (isEquationSolved === true) {
        equationStr = '';
        equationArr = [];
        isEquationSolved = false;
    }    

    if (areBracketsEnabled === false) {
        equationStr += '(';
        areBracketsEnabled = true;
        if (isNaN(equationArr[equationArr.length-1]) === false) {
            equationArr.push('*');
        }
    } else {
        equationStr += ')';
        areBracketsEnabled = false;
    }
    pushToEquationArr();
    updateDisplay();
}

function pushToEquationArr() {
    if (isNaN(Number(equationStr[equationStr.length-1])) === true) {
        equationArr.push(equationStr[equationStr.length-1]);
    } else {
        equationArr.push(Number(equationStr[equationStr.length-1]));
        if (insertNegativeNum === true) {
            equationArr[equationArr.length-1] *= -1;
            insertNegativeNum = false;
            console.log(`Add negative: ${insertNegativeNum}`);
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
    
    if (areBracketsEnabled === true) {
        if (isNaN(Number(equationStr[equationStr.length-1])) === false) {
            equationArr.push(')');
            areBracketsEnabled = false;
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

    isEquationSolved = true;
    equationArrToString(equationArr);
    equationStr = (round(equationStr, decimalPlaces)).toString();
    solutionToArray(equationStr);
    updateDisplay();
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
            
            if (toggleNegativeBrackets === true) {
                bracketEquation[0] *= -1;
                console.log(`Brackets multiplied by -1 = [${bracketEquation[0]}]`);

                toggleNegativeBrackets = false;
                console.log(`Add negative brackets: ${toggleNegativeBrackets}`);
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

const clear = {
    equation: function() {
        equationStr = '';
        equationArr = [];
        return equationArr;
    },
    equationHistory: function() {
        history = [];
        return history;
    },
    variables: function() {
        isEquationSolved = false;
        floatingPointInputted = false;
        isFactorialInputted = false;
        insertNegativeNum = false;
        isNegativeNum = false;
        areBracketsEnabled = false;
    },
    character: function() {
        if (equationStr[equationStr.length-1] === '.') floatingPointInputted = false;
        if (equationStr[equationStr.length-1] === '!') isFactorialInputted = false;
    
        if (insertNegativeNum === true) {
            insertNegativeNum = false;
            equationStr = equationStr.slice(0,-1);
            updateDisplay();
            return;
        }
    
        if (equationStr[equationStr.length-2] === '-' && isNaN(Number(equationStr[equationStr.length-3])) === true) {
            insertNegativeNum = true;
        }
    
        if (equationStr[equationStr.length-1] === '(') {
            areBracketsEnabled = false;
        } else if (equationStr[equationStr.length-1] === ')') {
            areBracketsEnabled = true;
        }
    
        equationStr = equationStr.slice(0,-1);
        equationArr.pop();
        updateDisplay();
        return equationArr;
    },
    all: function() {
        clear.variables();
        clear.equation();
        clear.equationHistory();
        updateDisplay();
        console.clear();
        return equationArr;
    }
}

functionButtons.clear.addEventListener('mousedown', clear.character);
functionButtons.allClear.addEventListener('mousedown', clear.all);