const mainDisplay = document.querySelector('#display').firstElementChild;

const functionsKeysArray = document.querySelector('#function-panel').querySelectorAll('.button');
const numberKeysArray = document.querySelector('#numpad').querySelectorAll('.button');
const operationKeysArray = document.querySelectorAll('.operation');

const functionKeys = {
    memoryClear: functionsKeysArray[0],
    memoryAdd: functionsKeysArray[1],
    memorySubtract: functionsKeysArray[2],
    memoryRecall: functionsKeysArray[3],
    brackets: functionsKeysArray[4],
    pi: functionsKeysArray[5],
    factorial: functionsKeysArray[6],
    percent: functionsKeysArray[7],
    power: functionsKeysArray[8],
    root: functionsKeysArray[9]
}

const numberKeys = {
    '0': numberKeysArray[10],
    '1': numberKeysArray[0],
    '2': numberKeysArray[1],
    '3': numberKeysArray[2],
    '4': numberKeysArray[3],
    '5': numberKeysArray[4],
    '6': numberKeysArray[5],
    '7': numberKeysArray[6],
    '8': numberKeysArray[7],
    '9': numberKeysArray[8]
};

const operationKeys = {
    allClear: operationKeysArray[0],
    clear: operationKeysArray[1],
    add: operationKeysArray[2],
    subtract: operationKeysArray[3],
    multiply: operationKeysArray[4],
    divide: operationKeysArray[5],
    equals: operationKeysArray[6]
}

function updateMainDisplay(key) {
    mainDisplay.textContent = key.textContent;
}

for (const key in numberKeys) {
    numberKeys[key].addEventListener('mousedown', () => {
        updateMainDisplay(numberKeys[key]);
    });
}