const equation = {
    display: document.querySelector('#calculation'),
    arr: [],
    history: []
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
let floatingPointInputted = false;
let isFactorialInputted = false;
let inputNegativeNum = false;
let isNegativeNum = false;
let toggleNegativeBrackets = false;
let areBracketsEnabled = false;
let indicesToggled = false;


const round = {
    str: function(str) {
        str = Math.round(num*decimalPlaces)/decimalPlaces;
        return str;
    },
    arr: function(arr) {
        let num = Number(convert.arrToStr(arr));
        num = Math.round(num*decimalPlaces)/decimalPlaces;
        return convert.strToArr(num.toString());
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
    colorChange: function(element, duration) {
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
    greyToColour: function(element, duration) {
        element.style.animation = `cl-grey-to-accent ${duration}ms linear`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

const update = {
    previousEntry: function() {
        previousEntry = equation.arr[equation.arr.length-1];
        return previousEntry;
    },
    theme: function(themeIndex) {
        root.style.setProperty('--cl-theme', `var(--theme-${themeIndex})`);
        setTimeout(() => {
            document.documentElement.style.transition = '2000ms';
        }, 100)
        return;
    },
    equation: {
        arr: function(character) {
            isEquationSolved === true ? isEquationSolved = false : {};
    
            if (isNaN(Number(character)) === true) {
                equation.arr.push(character);
            } else {
                equation.arr.push(Number(character));
                if (inputNegativeNum === true) {
                    equation.arr[equation.arr.length-1] *= -1;
                }
            }
            update.previousEntry();
            update.equation.display(character);
        },
        history: function() {
            history.push(equation.display.textContent)
            if (history.length > 3) {
                history.pop();
            }
            return history;
        },
        display: function(char) {
            if (isEquationSolved === true) {

                clear.display();

                for (let i = 0; i < equation.arr.length; i++) {
                    let character = document.createElement('span');
                    character.classList.add('character');
                    character.textContent = (equation.arr[i])

                    equation.display.append(character);
                }

                animate.colorChange(equation.display, 2000);
                console.log(equation.arr);

                return;
            }

            if (inputNegativeNum === true) {
                equation.display.lastChild.textContent = previousEntry*-1;
                animate.slideX(equation.display, 100);
                // animate.fade(equation.display.lastChild, 400, 'normal');
                inputNegativeNum = false;
                console.log(equation.arr);
                if (indicesToggled !== true) return;
            }

            let character = document.createElement('span');
            character.classList.add('character');

            if (indicesToggled === true) {
                if (equation.arr[equation.arr.length-2] === '^') {
                    equation.display.lastChild.textContent = '';
                }
                character = document.createElement('sup');
                character.textContent = previousEntry;
                character.classList.add('indices');
                character.classList.add('accented-colour');
                equation.display.append(character);

                if (equation.arr[equation.arr.length-2] !== '^') {
                    animate.slideX(equation.display, 100);
                    animate.fade(equation.display.lastChild, 400, 'normal');
                } else {
                    animate.greyToColour(equation.display.lastChild, 2000);
                }

                update.previousEntry();
                console.log(equation.arr);
                return;
            }

            switch(previousEntry) {
                case '+':
                    character.textContent = '+';
                    character.classList.add('accented-colour');
                    character.classList.add('extra-padding');
                    break;
                case '-':
                    character.textContent = '-';
                    character.classList.add('accented-colour');
                    character.classList.add('extra-padding');
                    break;
                case '*':
                    character.textContent = '+';
                    character.classList.add('accented-colour');
                    character.classList.add('extra-padding');
                    character.classList.add('multiply');
                    break;
                case '/':
                    character.textContent = '÷';
                    character.classList.add('accented-colour');
                    character.classList.add('extra-padding');
                    break;
                case '!':
                    character.textContent = '!';
                    character.classList.add('accented-colour');
                    break;
                case '%':
                    character.textContent = '%';
                    character.classList.add('accented-colour');
                    break;
                case '^':
                    character = document.createElement('sup');
                    character.textContent = 'x';
                    character.classList.add('mid-colour');
                    character.classList.add('indices');
                    indicesToggled = true;
                    break;
                case '√':
                    character.textContent = '√';
                    character.classList.add('mid-colour');
                    break;
                case Math.PI:
                    console.log('pi')
                    character.textContent = 3.14;
                    break;
                default:
                    character.textContent = previousEntry;
            }

            equation.display.append(character);
            animate.slideX(equation.display, 100);
            animate.fade(equation.display.lastChild, 400, 'normal');
            console.log(equation.arr);
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
        floatingPointInputted = false;
        isFactorialInputted = false;
        isNegativeNum = false;
        indicesToggled = false;
        update.equation.arr(operationButtons[key].value);
    },
    number: function(key) {
        if (isEquationSolved === true) {
            clear.equation();
            clear.display();
        }
        if (previousEntry === ')' && equation.arr.length > 0) {
            equation.arr.push('*'); // adds multipliers between brackets if no operation is specified
        }
        update.equation.arr(numberButtons[key].value)
    },
    pi: function() {
        if (floatingPointInputted === true || typeof previousEntry === 'number') return;
        if (isEquationSolved === true) clear.equation();
        equation.arr.push(Math.PI);
        floatingPointInputted = true;
        update.previousEntry();
        update.equation.display();
    },
    factorial: function() {
        if (isNegativeNum === true || floatingPointInputted === true) return;
        if (isNaN(Number(previousEntry)) && isFactorialInputted === false) return;
        isFactorialInputted = true;
        update.equation.arr('!')
    },
    percentage: function() {
        if (isNaN(previousEntry)) return;
        update.equation.arr('%')
    },
    exponent: function() {
        if (isNaN(Number(previousEntry)) === true && previousEntry !== '!' && previousEntry !== ')') return;
        floatingPointInputted = false;
        isFactorialInputted = false;
        isNegativeNum = false;
        indicesToggled = false;
        update.equation.arr('^');
    },
    root: function() {
        if (previousEntry === '√') return;
        if (isNaN(Number(previousEntry)) === false) {
            equation.arr.push('*');
        }
        isEquationSolved === true ? clear.equation() : {};
        update.equation.arr('√')
    },
    floatingPoint: function() {
        if (floatingPointInputted === true) return;
        floatingPointInputted = true;
    
        if (isEquationSolved === true || equation.arr.length < 1 || isNaN(Number(previousEntry))) {
            input.number(['0']);
        }
    
        input.number(['.']);
    },
    negativeSign: function() {
        if (inputNegativeNum === true || previousEntry === '√') return;
    
        inputNegativeNum = true;
        isNegativeNum = true;
        
        let character = document.createElement('span');
        character.classList.add('character');
        character.textContent = '';
        character.classList.add('negative-num');
        equation.display.append(character);
        animate.slideX(equation.display, 100);
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
        if (isFactorialInputted === true) return;
        for (let i = equation.arr.length-1; i >= 0; i--) {
            if (i === 0 || isNaN(Number(equation.arr[i-1])) === true && equation.arr[i-1] !== '.') {
                if (equation.arr[i] === '(' || equation.arr[i] === ')' || equation.arr[i] === '√' || equation.arr[i-1] === '√') return;
                equation.arr[i] *= -1;

                equation.display.children[i].classList.toggle('negative-num');

                if (equation.arr[i] > 0) {
                    equation.display.children[i].classList.add('shrink-margin');
                } else {
                    equation.display.children[i].classList.remove('shrink-margin');
                }
                
                break;
            }
        }
        update.previousEntry()
        isNegativeNum = true;
        console.log(equation.arr);
        return
    },
    brackets() {
        if (areBracketsEnabled === true && previousEntry === '(') return;
        if (previousEntry === '.') return;
    
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
            update.equation.arr('(');
            if (isNaN(previousEntry) === false) {
                equation.arr.push('*'); // multiply brackets with adjacent numbers if no operation is specified
            }
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
            str[i] === '.' ? extractedDigits.push(str[i]) :
          extractedDigits.push(Number(str[i]));
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
        
        const operations = ['+', '-', '*', '/', '!', '%', '^', '√'];
        if (equation.arr.some(character => operations.includes(character)) === false) return;

        const inoperableChars = ['+', '-', '*', '/', '^', '√'];
        if (isNaN(Number(previousEntry)) === true && inoperableChars.includes(previousEntry)) return
        
        areBracketsEnabled === true ? input.closedBracket() : {};
        equation.arr.includes('(') ? resolve.brackets() : {};
        equation.arr = convert.arrToEquation(equation.arr);

        calculate.expressions(equation.arr);
    
        isEquationSolved = true;

        equation.arr = convert.numToDigits(equation.arr);
        equation.arr = round.arr(equation.arr);

        update.equation.display();
        update.equation.history();
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
    '√': function(a) {
        if (isNegativeNum === true) {
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
        let test = []

        for (let i = arr.length-1; i >= 0; i--) {
            if (isNaN(Number(arr[i])) && arr[i] !== '.') break;
            test.unshift(arr[i]);
        }

        operation === '+' ? memory.value += Number(test.join('')) :
        memory.value -= Number(test.join(''));

        console.log(`Stored memory: ${memory.value}`);
        return;
    },
    recall: function(arr) {
        if (isNaN(Number(previousEntry)) === false) return;
        if (memory.value === 0) return;

        let mem = memory.value.toString()

        if (floatingPointInputted && mem.includes('.')) return;
        
        for (let i = 0; i < mem.length; i++) {
            if (isNaN(Number(mem[i]))) {
                floatingPointInputted = true;
                arr.push(mem[i]);
                update.previousEntry();
                update.equation.display();
                continue;
            }
            arr.push(Number(mem[i]));
            update.previousEntry();
            update.equation.display();
        }

        console.log(equation.arr);
        return;
    }
}

const clear = {
    equation: function() {
        equation.arr = [];
        return equation.arr;
    },
    equationHistory: function() {
        history = [];
        return history;
    },
    display: function() {
        equation.display.textContent = '';
    },
    variables: function() {
        isEquationSolved = false;
        floatingPointInputted = false;
        isFactorialInputted = false;
        inputNegativeNum = false;
        isNegativeNum = false;
        indicesToggled = false
        areBracketsEnabled = false;
    },
    character: function() {
        if (equation.arr.length < 1 && equation.display.lastChild.classList.contains('negative-num')) {
            equation.display.style.animation = 'fade 200ms reverse';
            setTimeout(clear.display, 200);
        }

        if (equation.arr.length < 1) return;
        if (previousEntry === '.') floatingPointInputted = false;
        if (previousEntry === '!') isFactorialInputted = false;
    
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
            // if (equationStr[equationStr.length-2] !== equation.arr[equation.arr.length-2] ) {
            //     equation.arr.pop()
            // }
        } else if (previousEntry === ')') {
            areBracketsEnabled = true;
        }

        if (equation.arr[equation.arr.length-2] === '^') {
            equation.arr.pop();
            indicesToggled = false;
        }

        if (previousEntry === '^') {
            indicesToggled = false;
        }

        equation.arr.pop();
        update.previousEntry();

        animate.slideX(equation.display, 100, 'right');
        equation.display.lastChild.remove();

        console.log(equation.arr);
    },
    all: function() {
        clear.variables();
        clear.equation();
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
