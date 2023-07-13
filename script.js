const equation = {
    display: document.querySelector('#calculation'),
    arr: []
}

const history = {
    display: document.querySelector('#history'),
    arr: []
}

const functionButtonElements = document.querySelector('#function-panel').querySelectorAll('.button');
const numberButtonElements = document.querySelector('#numpad').querySelectorAll('.button');
const operationButtonElements = document.querySelectorAll('.operation');

const themeSwatches = document.querySelectorAll('.theme');
const root = document.querySelector(':root');

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
}


let previousEntry;
let decimalPlaces = 10 ** 9;
let isEquationSolved = false;
let isFloatingPointNum = false;
let isFactorialNum = false;
let isNegativeNum = false;
let inputNegativeNum = false;
let toggleNegativeBrackets = false;
let areBracketsEnabled = false;
let areIndicesToggled = false;
let showErrorMessage = false;
let errorMessage = `Error: number too large`
let numOfErrors = 0;


const round = {
    str: function(str) {
        let num = Number(str);
        return str = Math.round(num*decimalPlaces)/decimalPlaces;
    },
    arr: function(arr) {
        let num = Number(convert.arrToStr(arr));
        num = Math.round(num*decimalPlaces)/decimalPlaces;
        arr = convert.strToArr(num.toString());
        if (arr[0] === '-') {
            console.log(arr)
            arr.shift()
            arr[0] *= -1;
        }
        return arr;
    }
}

const animate = {
    slideX: function(element, duration, direction) {
        let offsetWidth = 15;

        if (element.lastChild.offsetWidth !== undefined) offsetWidth = element.lastChild.offsetWidth;
        if (inputNegativeNum === true && equation.display.lastChild.textContent !== '') offsetWidth = 15;

        direction === 'right' ? offsetWidth *= -1 : {};

        root.style.setProperty('--offset-width', `translateX(${offsetWidth}px)`); // dynamically adjust translate value
        element.style.animation = `slide-from-right ${duration}ms linear`;

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    slideY: function(element, duration) {
        element.style.animation = `slide-up ${duration}ms linear`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    colourChange: function(element, duration, firstColour, secondColour) {
        root.style.setProperty('--first-colour', `${firstColour}`);
        root.style.setProperty('--second-colour', `${secondColour}`);
        
        element.style.animation = `colour-change ${duration}ms linear`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    fade: function(element, duration, direction) {
        element.style.animation = `fade ${duration}ms linear ${direction}`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    highlight: function(element, duration) {
        element.style.animation = '';
        element.style.animation = `highlight ${duration}ms`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration); 
    }
}

const show = {
    solution: function(arr) {
        for (let i = 0; i < arr.length; i++) {
            let character = document.createElement('span');
            character.classList.add('character');
            character.textContent = (arr[i]);
            equation.display.append(character);
        }
        animate.colourChange(equation.display, 2000, 'var(--cl-theme)', 'var(--foreground)');

        showErrorMessage === true ? show.errorMessage() :
        console.log(arr);
    },
    errorMessage: function() {
        if (numOfErrors > 1) {
            errorMessage = 'Error: multiple errors'
        }
        equation.display.textContent = errorMessage;
        equation.display.classList.add('error');
        console.error(errorMessage);
    }
}

const append = {
    equationToHistory: function() {
        history.display.prepend(history.arr[0]);
        history.display.children.length > 4 ? history.display.lastElementChild.remove() : {};
        animate.slideY(history.display, 200)
        animate.fade(history.display.firstChild, 1000, 'normal');
    },
    solutionToHistory: function() {
        let equals = document.createElement('span');
        equals.classList.add('character');
        equals.classList.add('accented-colour');
        equals.classList.add('extra-padding');
        equals.textContent = ('=');
        history.arr[0].append(equals);
        
        let solution = document.createElement('span');
        solution.classList.add('character');

        showErrorMessage === true ? solution.textContent = 'Error': solution.textContent = convert.arrToEquation(equation.arr);
        history.arr[0].append(solution);
    }
}

const update = {
    previousEntry: function() {
        console.log(equation.arr);
        equation.arr.length > 10 ? clear.equationHistory() : {};
        return previousEntry = equation.arr[equation.arr.length-1];
    },
    theme: function(themeIndex) {
        root.style.setProperty('--cl-theme', `var(--theme-${themeIndex})`);
        setTimeout(() => {
            document.documentElement.style.transition = '2000ms';
        }, 100);
        return;
    },
    history: {
        arr: function() {
            let newEquation = document.createElement('p');
            for (let i = 0; i < equation.display.children.length; i++) {
                let character = equation.display.children[i].cloneNode(true);
                newEquation.appendChild(character);
            }
            history.arr.unshift(newEquation);
            history.arr.length > 4 ? history.arr.pop() : {};
        }
    },
    equation: {
        arr: function(character) {
            isEquationSolved === true ? isEquationSolved = false : {};
    
            if (isNaN(Number(character)) === true) {
                equation.arr.push(character);
            } else {
                equation.arr.push(Number(character));
                inputNegativeNum === true ?  equation.arr[equation.arr.length-1] *= -1 : {};
            }
            update.previousEntry();
            update.equation.display();
        },
        display: function() {
            if (isEquationSolved === true) {
                clear.display();
                show.solution(equation.arr);
                return;
            }

            if (inputNegativeNum === true) {
                equation.display.lastChild.textContent = previousEntry*-1;
                animate.slideX(equation.display, 100);
                // animate.fade(equation.display.lastChild, 400, 'normal');
                inputNegativeNum = false;
                return;
            }

            let char = document.createElement('span');
            char.classList.add('character');

            if (areIndicesToggled === true) {
                if (equation.arr[equation.arr.length-2] === '^') {
                    equation.display.lastChild.textContent = '';
                }
                char = document.createElement('sup');
                if (previousEntry === Math.PI) {
                    char.textContent = 3.14;
                } else {
                    char.textContent = previousEntry;
                }
                char.classList.add('indices');
                char.classList.add('accented-colour');
                equation.display.append(char);

                if (equation.arr[equation.arr.length-2] !== '^') {
                    animate.slideX(equation.display, 100);
                    animate.fade(equation.display.lastChild, 400, 'normal');
                } else {
                    animate.colourChange(equation.display.lastChild, 2000, 'var(--cl-grey)', 'var(--cl-accent)');
                }

                update.previousEntry();
                return;
            }

            switch(previousEntry) {
                case '+':
                    char.textContent = '+';
                    char.classList.add('accented-colour');
                    char.classList.add('extra-padding');
                    break;
                case '-':
                    char.textContent = '-';
                    char.classList.add('accented-colour');
                    char.classList.add('extra-padding');
                    break;
                case '*':
                    char.textContent = '+';
                    char.classList.add('accented-colour');
                    char.classList.add('extra-padding');
                    char.classList.add('multiply');
                    break;
                case '/':
                    char.textContent = '÷';
                    char.classList.add('accented-colour');
                    char.classList.add('extra-padding');
                    break;
                case '!':
                    char.textContent = '!';
                    char.classList.add('accented-colour');
                    break;
                case '%':
                    char.textContent = '%';
                    char.classList.add('accented-colour');
                    break;
                case '^':
                    char = document.createElement('sup');
                    char.textContent = 'x';
                    char.classList.add('mid-colour');
                    char.classList.add('indices');
                    areIndicesToggled = true;
                    break;
                case 'R':
                    char.textContent = '√';
                    char.classList.add('accented-colour');
                    break;
                case Math.PI:
                    char.textContent = 3.14;
                    break;
                default:
                    char.textContent = previousEntry;
            }

            equation.display.append(char);
            animate.slideX(equation.display, 100);
            animate.fade(equation.display.lastChild, 400, 'normal');
        }
    }
}

const input = {
    operation: function(key) {
        if (isNaN(Number(previousEntry)) === true && previousEntry !== '!' && previousEntry !== ')') {
            if (operationButtons[key].value === '-') {
                input.negativeSign()
            }
            return;
        }
        isFloatingPointNum = false;
        isFactorialNum = false;
        isNegativeNum = false;
        areIndicesToggled = false;
        update.equation.arr(operationButtons[key].value);
    },
    number: function(key) {
        if (isEquationSolved === true) {
            clear.equation();
            clear.errors();
            clear.display();
        }
        if (previousEntry === ')' && equation.arr.length > 0) {
            equation.arr.push('*'); // adds multipliers between brackets if no operation is specified
        }
        update.equation.arr(numberButtons[key].value)
    },
    pi: function() {
        if (isFloatingPointNum === true || typeof previousEntry === 'number') return;
        if (isEquationSolved === true) clear.equation();
        equation.arr.push(Math.PI);
        isFloatingPointNum = true;
        update.previousEntry();
        update.equation.display();
    },
    factorial: function() {
        if (isNegativeNum === true || isFloatingPointNum === true || areIndicesToggled === true) return;
        if (isNaN(Number(previousEntry)) && isFactorialNum === false) return;
        isFactorialNum = true;
        update.equation.arr('!')
    },
    percentage: function() {
        if (isNaN(previousEntry) || areIndicesToggled === true) return;
        update.equation.arr('%')
    },
    exponent: function() {
        if (isNaN(Number(previousEntry)) === true && previousEntry !== '!' && previousEntry !== ')') return;
        isFloatingPointNum = false;
        isFactorialNum = false;
        isNegativeNum = false;
        areIndicesToggled = false;
        update.equation.arr('^');
    },
    root: function() {
        if (previousEntry === 'R' || areIndicesToggled === true) return;
        if (isEquationSolved === true) {
            clear.equation();
            clear.display();
        }
        if (isNaN(Number(previousEntry)) === false && equation.arr.length > 0) {
            equation.arr.push('*');
        }
        isEquationSolved === true ? clear.equation() : {};
        update.equation.arr('R')
    },
    floatingPoint: function() {
        if (isFloatingPointNum === true) return;
        isFloatingPointNum = true;
    
        if (isEquationSolved === true || equation.arr.length < 1 || isNaN(Number(previousEntry))) {
            input.number(['0']);
        }
    
        input.number(['.']);
    },
    negativeSign: function() {
        if (inputNegativeNum === true || previousEntry === 'R' || previousEntry == '.') return;
    
        inputNegativeNum = true;
        isNegativeNum = true;
        
        let character = document.createElement('span');

        if (areIndicesToggled === true) {
            if (equation.arr[equation.arr.length-1] === '^') {
                equation.display.lastChild.textContent = '';
            }
            character = document.createElement('sup');
            character.classList.add('indices');
            character.classList.add('accented-colour');
        } else {
            animate.slideX(equation.display, 100);
        }
        
        character.textContent = '';
        character.classList.add('character');
        character.classList.add('negative-num');

        equation.display.append(character);
        animate.fade(equation.display.lastChild, 400, 'normal');

        return;
    },
    closedBracket: function() {
        equation.arr.push(')');
        areBracketsEnabled = false;
    },
}

const toggle = {
    negativeNum() {
        if (isFactorialNum === true) return;
        for (let i = equation.arr.length-1; i >= 0; i--) {
            if (i === 0 || isNaN(Number(equation.arr[i-1])) === true && equation.arr[i-1] !== '.') {
                if (equation.arr[i] === '(' || equation.arr[i] === ')' || equation.arr[i] === 'R' || equation.arr[i-1] === 'R') return;
                
                equation.arr[i] *= -1;
                equation.display.children[i].classList.toggle('negative-num');

                if (equation.arr[i] > 0) {
                    equation.display.children[i].classList.add('shrink-margin');
                    equation.display.children[i].classList.remove('grow-margin');
                    
                } else {
                    equation.display.children[i].classList.remove('shrink-margin');
                    equation.display.children[i].classList.add('grow-margin');
                }
                
                break;
            }
        }
        update.previousEntry();
        isNegativeNum = true;
        return
    },
    brackets() {
        if (areBracketsEnabled === true && previousEntry === '(') return;
        if (previousEntry === '.' || areIndicesToggled === true) return;
    
        if (inputNegativeNum === true) {
            inputNegativeNum = false;
            toggleNegativeBrackets = true;
        }
    
        if (isEquationSolved === true) {
            clear.equation();
            isEquationSolved = false;
        }    
    
        if (areBracketsEnabled === false) {
            areBracketsEnabled = true;
            if (isNaN(previousEntry) === false) {
                equation.arr.push('*'); // multiply brackets with adjacent numbers if no operation is specified
            }
            update.equation.arr('(');
        } else {
            areBracketsEnabled = false;
            update.equation.arr(')');
        }
        update.previousEntry();
    },
    functionPanel: function() {
        document.querySelector('#function-panel').classList.toggle('hidden')
    }
}

const convert = {
    numToDigits: function(arr) {
        const extractedDigits = [];
        const str = arr[0].toString();
      
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '.') {
                extractedDigits.push(str[i])
            } else if (str[i] === '-' ) {
                extractedDigits.push(str[i+1] * -1);
                i++;
            } else {
                extractedDigits.push(Number(str[i]));
            }
        }
        return extractedDigits;  
    },
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
                
                if (operation !== 'R') equation.push(num);
                if (arr[i] !== undefined) equation.push(operation);
            }
        }
        arr = equation;
        return arr;
    }
}

const resolve = {
    equation: function() {
        
        const operations = ['+', '-', '*', '/', '!', '%', '^', 'R'];
        if (equation.arr.some(character => operations.includes(character)) === false) return;

        const inoperableChars = ['+', '-', '*', '/', '^', 'R'];
        if (isNaN(Number(previousEntry)) === true && inoperableChars.includes(previousEntry)) return

        update.history.arr();
        
        areIndicesToggled === true ? areIndicesToggled = false : {};
        areBracketsEnabled === true ? input.closedBracket() : {};
        equation.arr.includes('(') ? resolve.brackets() : {};
        equation.arr = convert.arrToEquation(equation.arr);

        calculate.expressions(equation.arr);

        console.log(equation.arr)

        if (isNaN(equation.arr) || equation.arr[0] === Infinity) {
            showErrorMessage = true;
        }
        isEquationSolved = true;
        
        equation.arr = convert.numToDigits(equation.arr);
        equation.arr = round.arr(equation.arr);
        
        append.solutionToHistory();
        append.equationToHistory();
        update.equation.display();
    },
    brackets: function() {
        let slicePosition = 0;
        let bracketEquation = [];
        let deleteCount = 0
    
        for (let i = 0; i < equation.arr.length; i++) {
            if (equation.arr[i] === '(') {
                slicePosition = i;
            }
            if (equation.arr[i] === ')') {
                bracketEquation = equation.arr.slice(slicePosition+1, i);
                deleteCount = bracketEquation.length+2;
    
                bracketEquation = convert.arrToEquation(bracketEquation);
    
                calculate.expressions(bracketEquation);
                
                if (toggleNegativeBrackets === true) {
                    bracketEquation[0] *= -1;
                    toggleNegativeBrackets = false;
                }
                
                equation.arr.splice(slicePosition, deleteCount, bracketEquation[0]);
    
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
            if (arr[i] !== 'R') continue;
            if (arr[i+1] < 0) {
                errorMessage = 'Error: imaginary number'
                numOfErrors++;
            }
            arr.splice(i, 2, operate['R'](arr[i+1]));
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

            if (operation === '/' && arr[i+1] === 0) {
                arr.splice(i - 1, 3, NaN);
                errorMessage = 'Error: cannot divide by 0'
                numOfErrors++;
            }

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
    'R': function(a) {
        if (isNegativeNum === false) {
            return Math.sqrt(a)
        }
    },
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
        memory.value = 0;
        console.log(`Stored memory: ${memory.value}`);
        return;
    },
    update: function(arr, operation) {
        let memValue = []

        for (let i = arr.length-1; i >= 0; i--) {
            if (isNaN(Number(arr[i])) && arr[i] !== '.') break;
            memValue.unshift(arr[i]);
        }

        operation === '+' ? memory.value += Number(memValue.join('')) :
        memory.value -= Number(memValue.join(''));

        console.log(`Stored memory: ${memory.value}`);
        return;
    },
    recall: function(arr) {
        if (isNaN(Number(previousEntry)) === false) return;
        if (memory.value === 0) return;

        let mem = memory.value.toString()

        if (isFloatingPointNum && mem.includes('.')) return;
        
        for (let i = 0; i < mem.length; i++) {
            if (isNaN(Number(mem[i]))) {
                isFloatingPointNum = true;
                arr.push(mem[i]);
                update.previousEntry();
                update.equation.display();
                continue;
            }
            arr.push(Number(mem[i]));
            update.previousEntry();
            update.equation.display();
        }
        return;
    }
}

const clear = {
    equation: function() {
        equation.arr = [];
        isFloatingPointNum = false;
        return equation.arr;
    },
    equationHistory: function() {
        history.arr = [];
        for (let i = history.display.children.length-1; i >= 0; i--) {
            setTimeout(() => {
                history.display.children[i].style.animation = '';
                animate.fade(history.display.children[i], 200, 'reverse');
                setTimeout(() => {
                    history.display.children[i].style.opacity = 0;
                }, 200)
            }, (i+1)*200)
        }
        setTimeout(() => {
            history.display.textContent = '';
        }, 1100);
        return;
    },
    display: function() {
        equation.display.textContent = '';
    },
    errors: function() {
        errorMessage = 'Error: number too large';
        showErrorMessage = false;
        numOfErrors = 0;
        equation.display.classList.remove('error');
    },
    variables: function() {
        isEquationSolved = false;
        isFloatingPointNum = false;
        isFactorialNum = false;
        inputNegativeNum = false;
        isNegativeNum = false;
        areIndicesToggled = false
        areBracketsEnabled = false;
    },
    character: function() {
        if (equation.arr.length < 1) return;

        isEquationSolved === true ? isEquationSolved = false : {};
        if (equation.arr.length < 1 && equation.display.lastChild.classList.contains('negative-num')) {
            inputNegativeNum = false;
            animate.fade(equation.display, 200, 'reverse');
            setTimeout(clear.display, 200);
        }

        if (equation.arr.length < 1) return;
        if (previousEntry === '.') isFloatingPointNum = false;
        if (previousEntry === '!') isFactorialNum = false;
    
        if (inputNegativeNum === true) {
            inputNegativeNum = false;
            equation.display.lastChild.remove();
            return;
        }

        if (isNegativeNum === true) {
            isNegativeNum = false;
        }
    
        if (previousEntry === '(') {
            areBracketsEnabled = false;
            if (equation.arr.length > 1 && equation.display.children[equation.arr.length-2].textContent !== equation.arr[equation.arr.length-2] ) {
                equation.arr.pop();
            }
        } else if (previousEntry === ')') {
            areBracketsEnabled = true;
        }

        if (equation.arr[equation.arr.length-3] === ')' && equation.display.children[equation.arr.length-2].textContent !== equation.arr[equation.arr.length-2]) {
            console.log('test');
            equation.arr.pop(); // removes default multiplication sign if inserted automatically between bracket and number
        }

        if (equation.arr[equation.arr.length-2] === '^') {
            equation.arr.pop();
            areIndicesToggled = false;
        }

        if (previousEntry === '^') {
            areIndicesToggled = false;
        }

        equation.arr.pop();
        update.previousEntry();
        animate.fade(equation.display.lastChild, 200, 'reverse')

        if (equation.arr.length < 1) {
            setTimeout(() => {
                equation.display.lastChild.remove();
            }, 200);
        } else {
            setTimeout(() => {
                equation.display.lastChild.remove();
                animate.slideX(equation.display, 100, 'right');
            }, 100);
        }
    },
    all: function() {
        clear.variables();
        clear.equation();
        clear.errors();
        clear.equationHistory();
        equation.display.style.animation = 'fade 200ms reverse';
        setTimeout(clear.display, 200)
        console.clear();
    }
}

const select = {
    theme: function() {
        let themeIndex = Math.floor(Math.random()*10);
        update.theme(themeIndex);
    }
}

themeSwatches.forEach((swatch, index) => {
    swatch.addEventListener('mousedown', () => {
        update.theme(index);
    });
});

select.theme();

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
functionButtons.exponent.addEventListener('mousedown', input.exponent);
functionButtons.root.addEventListener('mousedown', input.root);

functionButtons.equals.addEventListener('mousedown', resolve.equation);
functionButtons.clear.addEventListener('mousedown', clear.character);
functionButtons.allClear.addEventListener('mousedown', clear.all);

memoryButtons.memoryClear.addEventListener('mousedown', memory.clear);
memoryButtons.memoryAdd.addEventListener('mousedown', () => {
    memory.update(equation.arr, '+');
});
memoryButtons.memorySubtract.addEventListener('mousedown', () => {
    memory.update(equation.arr, '-');
});
memoryButtons.memoryRecall.addEventListener('mousedown', () => {
    memory.recall(equation.arr);
});

document.addEventListener('keydown', activateKeyboardShortcut)

function activateKeyboardShortcut(e) {
    switch (e.keyCode) {
        case 187:
            if (e.shiftKey === true) {
                input.operation('add');
                animate.highlight(operationButtons['add'].element, 500);
            } else if (e.ctrlKey === true) {
                memory.update(equation.arr, '+');
                animate.highlight(memoryButtons.memoryAdd, 500);
            } else if (e.altKey === true) {
                toggle.negativeNum();
                animate.highlight(numberButtons['±'].element, 500);
            }
            break;
        case 189:
            if (e.ctrlKey === true) {
                memory.update(equation.arr, '-');
                animate.highlight(memoryButtons.memorySubtract, 500);
            } else {
                input.operation('subtract');
                animate.highlight(operationButtons['subtract'].element, 500);
            }
            break;
        case 191:
            input.operation('divide');
            animate.highlight(operationButtons['divide'].element, 500);
            break;
        case 13:
            resolve.equation();
            animate.highlight(functionButtons.equals, 500);
            break;
        case 27:
            clear.all();
            animate.highlight(functionButtons.allClear, 500);
            break;
        case 8:
            if (e.ctrlKey === true) {
                memory.clear();
                animate.highlight(memoryButtons.memoryClear, 500);
            } else {
                clear.character();
                animate.highlight(functionButtons.clear, 500);
            }
            break;
        case 49:
            if (e.shiftKey !== true) {
                input.number(1);
                animate.highlight(numberButtons[1].element, 500);
            } else {
                input.factorial();
                animate.highlight(functionButtons.factorial, 500);
            }
            break;
        case 50:
            input.number(2);
            animate.highlight(numberButtons[2].element, 500);
            break;
        case 51:
            input.number(3);
            animate.highlight(numberButtons[3].element, 500);
            break;
        case 52:
            input.number(4);
            animate.highlight(numberButtons[4].element, 500);
            break;
        case 53:
            if (e.shiftKey !== true) {
                input.number(5);
                animate.highlight(numberButtons[5].element, 500);
            } else {
                input.percentage();
                animate.highlight(functionButtons.percentage, 500);
            }
            break;
        case 54:
            if (e.shiftKey !== true) {
                input.number(6);
                animate.highlight(numberButtons[6].element, 500);
            } else {
                input.exponent();
                animate.highlight(functionButtons.exponent, 500);
            }
            break;
        case 55:
            input.number(7);
            animate.highlight(numberButtons[7].element, 500);
            break;
        case 56:
            if (e.shiftKey !== true) {
                input.number(8);
                animate.highlight(numberButtons[8].element, 500);
            } else {
                input.operation('multiply');
                animate.highlight(operationButtons['multiply'].element, 500);
            }
            break;
        case 57:
            if (e.shiftKey !== true) {
                input.number(9);
                animate.highlight(numberButtons[9].element, 500);
            } else if (areBracketsEnabled === false) {
                toggle.brackets();
                animate.highlight(functionButtons.brackets, 500);
            }
            break;
        case 48:
            if (e.shiftKey !== true) {
                input.number(0);
                animate.highlight(numberButtons[0].element, 500);
            } else if (areBracketsEnabled === true) {
                toggle.brackets();
            }
            break;
        case 190:
            input.floatingPoint();
            animate.highlight(numberButtons['.'].element, 500);
            break;
        case 80:
            if (e.ctrlKey === true) {
                input.pi();
                animate.highlight(functionButtons.pi, 500);
            } 
            break;
        case 82:
            if (e.ctrlKey === true) {
                input.root();
                animate.highlight(functionButtons.root, 500);
            } 
            break;
        case 77:
            if (e.ctrlKey === true) {
                memory.recall();
                animate.highlight(memoryButtons.recall, 500);
            } 
            break;
    }
}