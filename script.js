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
    percentage: functionButtonElements[7],
    exponent: functionButtonElements[8],
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
    divide: { element: operationButtonElements[5], value: '/' },
    exponent: { element: functionButtonElements[8], value: '^' }
}

let equationStr = '';
let equationArr = [];
let history = [];
let decimalPlaces = 1000000000;
let lastChar;

let isEquationSolved = false;
let floatingPointInputted = false;
let isFactorialInputted = false;
let inputNegativeNum = false;
let isNegativeNum = false;
let toggleNegativeBrackets = false;
let areBracketsEnabled = false;

function round(num, decimalPlaces) {
    num = Math.round(num*decimalPlaces)/decimalPlaces;
    return num;
}

const update = {
    lastChar: function() {
        lastChar = equationArr[equationArr.length-1];
        return lastChar
    },
    display: function() {
        equationStr !== '' ? calculationDisplay.textContent = equationStr : 
        calculationDisplay.textContent = 0;
        console.log(equationArr);
    },
    equation: function(character) {
        isEquationSolved === true ? isEquationSolved = false : {};
        equationStr += character;
        update.equationArr();
        update.display();
    },
    equationArr: function() {
        if (isNaN(Number(equationStr[equationStr.length-1])) === true) {
            equationArr.push(equationStr[equationStr.length-1]);
        } else {
            equationArr.push(Number(equationStr[equationStr.length-1]));
            if (inputNegativeNum === true) {
                equationArr[equationArr.length-1] *= -1;
                inputNegativeNum = false;
            }
        }
        update.lastChar();
    },
    history: function() {
        history.push(equationStr)
        if (history.length > 3) {
            history.pop();
        }
        return history;
    }
}

const input = {
    operation: function(key) {
        if (isNaN(Number(lastChar)) === true && lastChar !== '!' && lastChar !== ')') {
            if (operationButtons[key].value === '-') {
                input.negativeSign()
            }
            return;
        }
        floatingPointInputted = false;
        isFactorialInputted = false;
        isNegativeNum = false;
        update.equation(operationButtons[key].value);
    },
    number: function(key) {
        if (isEquationSolved === true) {
            clear.equation();
        }
        if (lastChar === ')') {
            equationArr.push('*'); // adds multipliers between brackets if no operation is specified
        }
        update.equation(numberButtons[key].value)
    },
    pi: function() {
        if (floatingPointInputted === true) return;
        if (isEquationSolved === true) clear.equation();
        equationStr += round(Math.PI, 100);
        equationArr.push(Math.PI);
        floatingPointInputted = true;
        update.lastChar();
        update.display();
    },
    factorial: function() {
        if (isNegativeNum === true || floatingPointInputted === true) return;
        if (isNaN(Number(lastChar)) && isFactorialInputted === false) return;
        isFactorialInputted = true;
        update.equation('!')
    },
    percentage: function() {
        if (isNaN(lastChar)) return;
        update.equation('%')
    },
    root: function() {
        if (lastChar === '√') return;
        if (isNaN(Number(lastChar)) === false) {
            equationArr.push('*');
        }
        update.equation('√')
    },
    floatingPoint: function() {
        if (floatingPointInputted === true) return;
        floatingPointInputted = true;
    
        if (isEquationSolved === true || equationStr === '' || isNaN(Number(lastChar))) {
            input.number(['0']);
        }
    
        input.number(['.']),
        update.display();
    },
    negativeSign: function() {
        if (inputNegativeNum === true) return;
    
        inputNegativeNum = true;
        isNegativeNum = true;
        
        equationStr += '-';
    
        update.display();
        return;
    },
    closedBracket: function() {
        equationArr.push(')');
        areBracketsEnabled = false;
    },
}

const toggle = {
    negativeNum() {
        if (isFactorialInputted === true) return;
        for (let i = equationArr.length-1; i >= 0; i--) {
            if (i === 0 || isNaN(Number(equationArr[i-1])) === true && equationArr[i-1] !== '.') {
                if (equationArr[i] === '(' || equationArr[i] === ')') return;
                equationArr[i] *= -1;
                equationStr = convert.arrToStr(equationArr);
                if (Object.is(equationArr[i], -0) === true) { // add minus sign to floating point numbers beginning with 0
                    equationStr[i] *= equationStr = equationStr.substring(0,i) + '-0' + equationStr.substring(i+1, equationStr.length); 
                }
                break;
            }
        }
        isNegativeNum = true;
        update.display();
    },
    brackets() {
        if (areBracketsEnabled === true && equationStr[equationStr.length-1] === '(') return;
        if (equationStr[equationStr.length-1] === '.') return;
    
        if (inputNegativeNum === true) {
            inputNegativeNum = false
            toggleNegativeBrackets = true;
        }
    
        if (isEquationSolved === true) {
            clear.equation();
            isEquationSolved = false;
        }    
    
        if (areBracketsEnabled === false) {
            equationStr += '(';
            areBracketsEnabled = true;
            if (isNaN(lastChar) === false) {
                equationArr.push('*'); // multiply brackets with adjacent numbers if no operation is specified
            }
        } else {
            equationStr += ')';
            areBracketsEnabled = false;
        }
        update.equationArr();
        update.display();
    }
}

const convert = {
    arrToStr: function(arr) {
        return arr.join('');
    },
    strToArr: function(str) {
        return Array.from(str);
    },
    arrToEquation: function(arr) {
        let slicePosition = 0;
        let equation = [];
    
        for (let i=0; i <= arr.length; i++) {
            if (arr[i] !== '.' && isNaN(arr[i]) || i === arr.length) {
    
                let num = Number(arr.slice(slicePosition, i).toString().replaceAll(',',''));
                let operation = arr[i];
                
                if (Object.is(arr[slicePosition], -0) === true) {
                    num *= -1; // convert floating points numbers beginning with 0 to negative
                }
    
                slicePosition = i+1;
               
                equation.push(num);
                
                if (arr[i] !== undefined) {
                    equation.push(operation);
                }
            }
        }
        arr = equation;
        return arr;
    }
}

const resolve = {
    equation: function() {
        const inoperableChars = ['+', '-', '*', '/']
        if (isNaN(Number(lastChar)) === true && inoperableChars.includes(lastChar)) return
        
        areBracketsEnabled === true ? input.closedBracket() : {};
        equationArr.includes('(') ? resolve.brackets() : {};
        equationArr = convert.arrToEquation(equationArr);

        calculate.expressions(equationArr);
    
        isEquationSolved = true;
    
        equationStr = convert.arrToStr(equationArr);
        equationStr = (round(equationStr, decimalPlaces)).toString();
        equationArr = convert.strToArr(equationStr);

        update.display();
        update.history();
    },
    brackets: function() {
        let slicePosition = 0;
        let bracketEquation = [];
        let deleteCount = 0
    
        for (let i = 0; i < equationArr.length; i++) {
            if (equationArr[i] === '(') {
                slicePosition = i;
            }
            if (equationArr[i] === ')') {
                bracketEquation = equationArr.slice(slicePosition+1, i);
                deleteCount = bracketEquation.length+2;
    
                bracketEquation = convert.arrToEquation(bracketEquation);
    
                calculate.expressions(bracketEquation);
                
                if (toggleNegativeBrackets === true) {
                    bracketEquation[0] *= -1;
                    toggleNegativeBrackets = false;
                }
                
                equationArr.splice(slicePosition, deleteCount, bracketEquation[0]);
    
                i = slicePosition+1;
            }
        }
    }
}

const calculate = {
    expressions: function(arr) {
        calculate.factorial(arr)
        calculate.percentage(arr)
        calculate.root(arr);
        calculate.operations(arr, '^');
        calculate.operations(arr, '*');
        calculate.operations(arr, '/');
        calculate.operations(arr, '+');
        calculate.operations(arr, '-');
    },
    factorial: function(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '!') continue;

            arr.splice(i - 1, 3, operate['!'](arr[i-1]));
            i--;
        }
    },
    root: function(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '√') continue;

            arr.splice(i - 1, 3, operate['√'](arr[i+1]));
            i--;
        }
    },
    percentage: function(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '%') continue;

            let a = arr[i-1];
            let b = arr[i-3];
            let operation = arr[i-2]

            arr.splice(i - 1, 3, operate['%'](a, b, operation));
            i--;
        }
    },
    operations: function(arr, operation) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== operation) continue;

            arr.splice(i - 1, 3, operate[operation](arr[i - 1], arr[i + 1]));
            i--;
        }
    }
}

const operate = {
    '+': function(a, b) { return a + b },
    '-': function(a, b) { return a - b },
    '*': function(a, b) { return a * b },
    '/': function(a, b) { return a / b },
    '^': function(a, b) { return a ** b },
    '√': function(a) { return Math.sqrt(a) },
    '!': function(a) {
        for (let i = a-1; i >= 1; i--) {
            a *= i;
        }
        return a;
    },
    '%': function(a, b, operation) {
        a *= 0.01;
        operation === '+' || operation === '-' ? a *= b : {};
        return a;
    }
}

    const memory = {
    value: 0,
    clear: function() {
        return memory.value = 0;
    },
    update: function(arr, operation) {
        let test = []

        for (let i = arr.length-1; i >= 0; i--) {
            if (isNaN(Number(arr[i]))) break;
            test.unshift(arr[i]);
        }

        if (operation === '+') {
            return memory.value += Number(test.join(''));
        } else {
            return memory.value -= Number(test.join(''));
        }

    },
    // recall: function(arr) {
    //     console.log(arr)
    //     arr.concat(memory.arr);
    //     console.log(arr)
    //     update.display();
    // }
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
        inputNegativeNum = false;
        isNegativeNum = false;
        areBracketsEnabled = false;
    },
    character: function() {
        if (lastChar === '.') floatingPointInputted = false;
        if (lastChar === '!') isFactorialInputted = false;
    
        if (inputNegativeNum === true) {
            inputNegativeNum = false;
            equationStr = equationStr.slice(0,-1);
            update.display();
            return;
        }
    
        if (equationStr[equationStr.length-2] === '-' && isNaN(Number(equationStr[equationStr.length-3])) === true) {
            inputNegativeNum = true;
        }
    
        if (lastChar === '(') {
            areBracketsEnabled = false;
            if (equationStr[equationStr.length-2] !== equationArr[equationArr.length-2] ) {
                equationArr.pop()
            }
        } else if (lastChar === ')') {
            areBracketsEnabled = true;
        }
    
        equationStr = equationStr.slice(0,-1);
        equationArr.pop();
        update.display();
        return equationArr;
    },
    all: function() {
        clear.variables();
        clear.equation();
        clear.equationHistory();
        update.display();
        console.clear();
        return equationArr;
    }
}


for (const key in operationButtons) {
    operationButtons[key].element.addEventListener('mousedown', () => {
        input.operation(key)
    });
}

for (const key in numberButtons) {
    if (numberButtons[key].value === '.' || numberButtons[key].value === '±') continue;
    numberButtons[key].element.addEventListener('mousedown', () => {
        input.number(key)
    });
}

numberButtons['.'].element.addEventListener('mousedown', input.floatingPoint);
numberButtons['±'].element.addEventListener('mousedown', toggle.negativeNum);

functionButtons.brackets.addEventListener('mousedown', toggle.brackets);
functionButtons.pi.addEventListener('mousedown', input.pi);
functionButtons.factorial.addEventListener('mousedown', input.factorial);
functionButtons.percentage.addEventListener('mousedown', input.percentage);
// functionButtons.exponent.addEventListener('mousedown', input.exponent);
functionButtons.root.addEventListener('mousedown', input.root);

functionButtons.equals.addEventListener('mousedown', resolve.equation);
functionButtons.clear.addEventListener('mousedown', clear.character);
functionButtons.allClear.addEventListener('mousedown', clear.all);

memoryButtons.memoryClear.addEventListener('mousedown', memory.clear);