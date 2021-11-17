function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    if (b === 0) {
        return "Can't divide by 0!";
    } else {
        return a/b;
    }
}

function exponent(a,b) {
    return a**b;
}

const screenTop = document.querySelector('.screenTop');
const screenBottom = document.querySelector('.screenBottom');

const numbers = Array.from(document.querySelectorAll('.number'));
numbers.forEach(number => number.addEventListener('click', appendNumber));

let firstNum = 0;
let secondNum = 0;
let tempNum = false;

function appendNumber(e) {
    if (tempNum === true && screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1) === '=') {
        screenTop.textContent = '';
        screenBottom.textContent = this.textContent;
        tempNum = false;    
    } else if (screenBottom.textContent=='0' || tempNum === true || isNaN(Number(screenBottom.textContent))) {
        screenBottom.textContent = this.textContent;
        tempNum = false;    
    } else if (screenBottom.textContent.includes('.') && screenBottom.textContent.substring(screenBottom.textContent.length-4, screenBottom.textContent.length-3)) {
        return;
    } else if (screenBottom.textContent.length === 16) {
        return;
    } else {
        screenBottom.textContent += this.textContent;
    }
}

const backspace = document.querySelector('#backspace');
backspace.addEventListener('click', deleteNum);

function deleteNum() {
    if (screenBottom.textContent.length === 1) {
        screenBottom.textContent = '0';
    } else if (isNaN(Number(screenBottom.textContent))) {
        screenBottom.textContent = '0';
        screenTop.textContent = '';
    } else {
        screenBottom.textContent = screenBottom.textContent.substring(0, screenBottom.textContent.length - 1);
    }
}

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    screenBottom.textContent = '0';
    screenTop.textContent = '';
})

const plusMinus = document.querySelector('#plusMinus');
plusMinus.addEventListener('click', () => {
    if (tempNum === true) {
        screenTop.textContent = '';
        screenBottom.textContent = '0';
    }
    let newNum = -Number(screenBottom.textContent);
    screenBottom.textContent = newNum.toString();
    tempNum = false;
})

const decimal = document.querySelector('#decimal');
decimal.addEventListener('click', () => {
    if (screenBottom.textContent === "Can't divide by 0!" || tempNum === true) {
        screenTop.textContent = ''
        screenBottom.textContent = '0';
    } else if (screenBottom.textContent.includes('.')) {
        return;
    } else {
        screenBottom.textContent += '.';
    }
})

function operate(a,b,operator) {
    if (operator === '+') {
        return add(a,b);
    } else if (operator === '-') {
        return subtract(a,b);
    } else if (operator === '×') {
        return multiply(a,b);
    } else if (operator === '÷') {
        return divide(a,b);
    } else if (operator === '^') {
        return exponent(a,b);
    }
}

const equal = document.querySelector('#equal');
equal.addEventListener('click', () => {
    if (operators.includes(screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1))) {
        secondNum = Number(screenBottom.textContent);
        let operator = screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1);
        if (secondNum.toString().length > 9) {
            screenTop.textContent += secondNum.toExponential(2).toString() + ' ' + '=' + ' ';
        } else {
            screenTop.textContent += secondNum.toString() + ' ' + '=' + ' ';
        }
        if (operate(firstNum, secondNum, operator) === "Can't divide by 0!") {
            screenBottom.textContent = "Can't divide by 0!";
        } else {
            let result = operate(firstNum, secondNum, operator);
            if (result.toString().length > 16) {
                screenBottom.textContent = result.toExponential(2).toString();
            } else {
                screenBottom.textContent = (Math.round((result + Number.EPSILON)*100)/100).toString();
                firstNum = result;
            }
        }
        tempNum = true;
    }
});


const operations = Array.from(document.querySelectorAll('.operation'));
operations.forEach(operation => operation.addEventListener('click', appendOperation));

let operators = ['+', '-', '×', '÷', '^'];

function appendOperation(e) {
    let operator = this.textContent;
    if (operator === 'xy') {
        operator = '^';
    }
    if (screenBottom.textContent === "Can't divide by 0!") {
        screenBottom.textContent = '0';
        screenTop.textContent = '';
    } else if (screenTop.textContent === '' || screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1) === '=') {
        firstNum = Number(screenBottom.textContent);
        if (screenBottom.textContent.length >= 9) {
            screenTop.textContent = firstNum.toExponential(2).toString() + ' ' + operator + ' ';
        } else {
            screenTop.textContent = screenBottom.textContent + ' ' + operator + ' ';
        }
        tempNum = true;
    } else if (operators.includes(screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1))) {
        secondNum = Number(screenBottom.textContent);
        let result = operate(firstNum,secondNum,screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1));
        if (result.toString().length > 16) {
            result = result.toExponential(2);
            screenBottom.textContent = result.toString();
            screenTop.textContent = result.toString() + ' ' + operator + ' ';
            tempNum = true;
            firstNum = result;
        } else if (result === "Can't divide by 0!") {
            screenBottom.textContent = "Can't divide by 0!";
            screenTop.textContent = '';
        } else if (tempNum === true) {
            screenTop.textContent = screenTop.textContent.replace(screenTop.textContent.substring(screenTop.textContent.length-2,screenTop.textContent.length-1), operator);
        } else {
            screenBottom.textContent = (Math.round((result + Number.EPSILON)*100)/100).toString();
            screenTop.textContent = (Math.round((result + Number.EPSILON)*100)/100).toString() + ' ' + operator + ' ';
            tempNum = true;
            firstNum = result;
        }
    }
}
