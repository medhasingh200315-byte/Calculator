let currentExpression = '';
let memoryValue = 0;
let lastResult = 0;
const display = document.getElementById('display');

function memoryClear() {
    memoryValue = 0;
    showMemoryIndicator();
}

function memoryRecall() {
    currentExpression = String(memoryValue);
    display.value = currentExpression;
    addButtonPressEffect(event.target);
}

function memoryAdd() {
    const currentValue = parseFloat(display.value) || 0;
    memoryValue += currentValue;
    showMemoryIndicator();
    addButtonPressEffect(event.target);
}

function memorySubtract() {
    const currentValue = parseFloat(display.value) || 0;
    memoryValue -= currentValue;
    showMemoryIndicator();
    addButtonPressEffect(event.target);
}

function showMemoryIndicator() {
    const indicator = document.querySelector('.memory-indicator');
    if (memoryValue !== 0) {
        if (!indicator) {
            const memIndicator = document.createElement('div');
            memIndicator.className = 'memory-indicator';
            memIndicator.textContent = 'M';
            memIndicator.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: #00b894;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            `;
            document.querySelector('.calculator-container').appendChild(memIndicator);
        }
    } else if (indicator) {
        indicator.remove();
    }
}

function squareRoot() {
    const value = parseFloat(display.value) || 0;
    if (value < 0) {
        display.value = 'Error';
        display.style.color = '#ff6b6b';
        setTimeout(() => { display.style.color = '#fff'; }, 2000);
        return;
    }
    const result = Math.sqrt(value);
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
    addButtonPressEffect(event.target);
}

function percentage() {
    const value = parseFloat(display.value) || 0;
    const result = value / 100;
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
    addButtonPressEffect(event.target);
}

function power() {
    const value = parseFloat(display.value) || 0;
    const result = Math.pow(value, 2);
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
    addButtonPressEffect(event.target);
}

function factorial() {
    const value = parseInt(display.value) || 0;
    if (value < 0 || value > 170) {
        display.value = 'Error';
        display.style.color = '#ff6b6b';
        setTimeout(() => { display.style.color = '#fff'; }, 2000);
        return;
    }
    let result = 1;
    for (let i = 2; i <= value; i++) {
        result *= i;
    }
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
    addButtonPressEffect(event.target);
}

function reciprocal() {
    const value = parseFloat(display.value) || 0;
    if (value === 0) {
        display.value = 'Error';
        display.style.color = '#ff6b6b';
        setTimeout(() => { display.style.color = '#fff'; }, 2000);
        return;
    }
    const result = 1 / value;
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
    addButtonPressEffect(event.target);
}

function pi() {
    currentExpression = String(Math.PI);
    display.value = Math.PI;
    addButtonPressEffect(event.target);
}

function toggleSign() {
    const value = parseFloat(display.value) || 0;
    const result = -value;
    currentExpression = String(result);
    display.value = result;
    addButtonPressEffect(event.target);
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    display.value = currentExpression;
    addButtonPressEffect(event.target);
}

function clearEntry() {
    currentExpression = '';
    display.value = '';
    addButtonPressEffect(event.target);
}

function createParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 8000);
        }, i * 200);
    }
}

function addButtonPressEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

function appendToDisplay(value) {
    const lastChar = currentExpression.slice(-1);
    const isOperator = (char) => ['+', '-', '*', '/'].includes(char);
    if (isOperator(value) && isOperator(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + value;
    } else if (value === '.' && lastChar === '.') {
        return;
    } else {
        currentExpression += value;
    }
    display.value = currentExpression;
    display.style.transform = 'scale(1.02)';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 100);
}

function calculateResult() {
    try {
        const result = evaluateExpression(currentExpression);
        if (result === Infinity || isNaN(result)) {
            display.value = 'Error';
            display.style.color = '#ff6b6b';
            currentExpression = '';
            setTimeout(() => {
                display.style.color = '#fff';
            }, 2000);
        } else {
            display.value = result;
            display.style.color = '#00b894';
            currentExpression = String(result);
            lastResult = result;
            setTimeout(() => {
                display.style.color = '#fff';
            }, 1000);
        }
    } catch (e) {
        display.value = 'Error';
        display.style.color = '#ff6b6b';
        currentExpression = '';
        setTimeout(() => {
            display.style.color = '#fff';
        }, 2000);
    }
}

function clearDisplay() {
    currentExpression = '';
    display.value = '';
    display.style.color = '#fff';
}

function evaluateExpression(expression) {
    const numbers = expression.split(/[-+*/]/).map(Number);
    const operators = expression.split('').filter(char => ['+', '-', '*', '/'].includes(char));
    if (operators.length === 0) {
        return numbers[0];
    }
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const nextNumber = numbers[i + 1];
        if (operator === '+') result += nextNumber;
        if (operator === '-') result -= nextNumber;
        if (operator === '*') result *= nextNumber;
        if (operator === '/') {
            if (nextNumber === 0) {
                throw new Error("Division by zero");
            }
            result /= nextNumber;
        }
    }
    return result;
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        addButtonPressEffect(e.target);
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/[0-9]/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape' || key === 'c') {
        clearDisplay();
    } else if (key === 'Delete') {
        clearEntry();
    } else if (key === 'r' || key === 'R') {
        squareRoot();
    } else if (key === 'p' || key === 'P') {
        percentage();
    } else if (key === 's' || key === 'S') {
        power();
    } else if (key === 'f' || key === 'F') {
        factorial();
    } else if (key === 'i' || key === 'I') {
        reciprocal();
    } else if (key === 't' || key === 'T') {
        toggleSign();
    }
});

createParticles();
setInterval(createParticles, 10000);