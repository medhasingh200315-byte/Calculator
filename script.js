let currentExpression = '';
let memoryValue = 0;
let lastResult = 0;
const display = document.getElementById('display');

// --- Utility Functions ---

/**
 * Helper function to safely evaluate a mathematical expression string.
 * Uses the Function constructor for evaluation, but includes safety checks.
 * @param {string} expression - The mathematical expression.
 * @returns {number} The result of the evaluation.
 * @throws {Error} if the expression contains invalid characters or results in a math error.
 */
function evaluateExpression(expression) {
    // Basic check to prevent malicious code injection (only allows numbers, operators, etc.)
    if (!/^[0-9+\-*/().\s]*$/.test(expression)) {
        throw new Error("Invalid characters in expression");
    }
    try {
        // Use new Function() for safe evaluation
        const func = new Function('return ' + expression.replace('×', '*').replace('÷', '/'));
        const result = func();
        if (!isFinite(result)) {
            throw new Error("Math error (e.g., division by zero)");
        }
        return result;
    } catch (e) {
        throw new Error("Invalid expression");
    }
}

/**
 * Adds a visual press effect to the button.
 * @param {HTMLElement} button - The button element that was clicked.
 */
function addButtonPressEffect(button) {
    // Check if the button exists and is a valid target before applying effect
    if (!button || button.tagName !== 'BUTTON') return; 
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// --- Display and Input Functions ---

/**
 * Appends a value (number or operator) to the current expression.
 * Includes logic to prevent consecutive operators and duplicate decimals.
 * @param {string} value - The value to append.
 */
function appendToDisplay(value) {
    const lastChar = currentExpression.slice(-1);
    const isOperator = (char) => ['+', '-', '*', '/'].includes(char);
    
    // Prevent consecutive operators, replacing the old one with the new one
    if (isOperator(value) && isOperator(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + value;
    } 
    // Prevent consecutive decimals
    else if (value === '.' && lastChar === '.') {
        return;
    } 
    // Allow appending to the expression
    else {
        currentExpression += value;
    }
    
    display.value = currentExpression;
    // Simple display animation
    display.style.transform = 'scale(1.02)';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Calculates the result of the current expression.
 */
function calculateResult() {
    try {
        const result = evaluateExpression(currentExpression);
        
        // Handle division by zero or other mathematical infinities/NaNs
        if (result === Infinity || isNaN(result)) {
            handleError('Error');
        } else {
            // Display success and update state
            display.value = result;
            display.style.color = '#00b894'; // Success color
            currentExpression = String(result);
            lastResult = result;
            setTimeout(() => {
                display.style.color = '#fff'; // Revert color
            }, 1000);
        }
    } catch (e) {
        handleError('Error');
    }
}

/**
 * Clears the display and resets the current expression.
 */
function clearDisplay() {
    currentExpression = '';
    display.value = '';
    display.style.color = '#fff'; // Ensure color is normal
}

/**
 * Removes the last character from the current expression.
 */
function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    display.value = currentExpression;
}

/**
 * Clears the entry/current expression (used by keyboard delete key).
 */
function clearEntry() {
    currentExpression = '';
    display.value = '';
}

/**
 * Displays an error message and resets the state.
 * @param {string} message - The error message to display.
 */
function handleError(message) {
    display.value = message;
    display.style.color = '#ff6b6b'; // Error color
    currentExpression = '';
    setTimeout(() => {
        display.style.color = '#fff'; // Revert color
    }, 2000);
}

// --- Advanced Math Functions (Apply to current display value) ---

function squareRoot() {
    const value = parseFloat(display.value) || 0;
    if (value < 0) {
        handleError('Error');
        return;
    }
    const result = Math.sqrt(value);
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
}

function percentage() {
    const value = parseFloat(display.value) || 0;
    const result = value / 100;
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
}

function power() {
    const value = parseFloat(display.value) || 0;
    const result = Math.pow(value, 2);
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
}

function factorial() {
    const value = parseInt(display.value) || 0;
    // Factorial limits for safe calculation (0-170 for standard JS number precision)
    if (value < 0 || value > 170 || !Number.isInteger(value)) {
        handleError('Error');
        return;
    }
    let result = 1;
    for (let i = 2; i <= value; i++) {
        result *= i;
    }
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
}

function reciprocal() {
    const value = parseFloat(display.value) || 0;
    if (value === 0) {
        handleError('Error');
        return;
    }
    const result = 1 / value;
    currentExpression = String(result);
    display.value = result;
    lastResult = result;
}

function pi() {
    const lastChar = currentExpression.slice(-1);
    // If the last character was a number or closing parenthesis, assume multiplication
    if (lastChar && (/\d|\)/.test(lastChar))) {
        currentExpression += '*';
    }
    currentExpression += Math.PI;
    display.value = currentExpression;
}

function toggleSign() {
    const value = parseFloat(display.value) || 0;
    const result = -value;
    currentExpression = String(result);
    display.value = result;
}

// --- Memory Functions ---

/**
 * Creates and shows the 'M' indicator when memory is not zero.
 */
function showMemoryIndicator() {
    let indicator = document.querySelector('.memory-indicator');
    const container = document.querySelector('.calculator-container');

    if (memoryValue !== 0) {
        if (!indicator) {
            // Create indicator if it doesn't exist
            indicator = document.createElement('div');
            indicator.className = 'memory-indicator';
            indicator.textContent = 'M';
            indicator.style.cssText = `
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
                transition: opacity 0.3s ease;
            `;
            container.appendChild(indicator);
        }
        indicator.style.opacity = '1';
    } else if (indicator) {
        // Remove indicator if memory is zero
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }
}

function memoryClear() {
    memoryValue = 0;
    showMemoryIndicator();
}

function memoryRecall() {
    currentExpression = String(memoryValue);
    display.value = currentExpression;
    addButtonPressEffect(event.target);
}

/**
 * Calculates the current display value and adds it to the memory.
 * Uses a try/catch block to evaluate the current expression or fall back to the displayed number.
 */
function memoryAdd() {
    let currentValue;
    try {
        currentValue = evaluateExpression(currentExpression);
    } catch {
        currentValue = parseFloat(display.value) || 0;
    }
    memoryValue += currentValue;
    showMemoryIndicator();
    addButtonPressEffect(event.target);
}

/**
 * Calculates the current display value and subtracts it from the memory.
 */
function memorySubtract() {
    let currentValue;
    try {
        currentValue = evaluateExpression(currentExpression);
    } catch {
        currentValue = parseFloat(display.value) || 0;
    }
    memoryValue -= currentValue;
    showMemoryIndicator();
    addButtonPressEffect(event.target);
}

// --- Theme Selector Function ---

/**
 * Sets the body class to change the calculator's theme using CSS variables.
 * @param {string} theme - The theme name ('default', 'dark', or 'neon').
 */
function setTheme(theme) {
    const body = document.body;
    const buttons = document.querySelectorAll('.theme-btn');
    
    // Remove all theme classes first
    body.classList.remove('dark-theme', 'neon-theme');
    
    // Apply the selected theme class
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else if (theme === 'neon') {
        body.classList.add('neon-theme');
    }
    
    // Set the 'active' class on the corresponding theme button
    buttons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase().includes(theme);
        const isDefaultActive = (theme === 'default' && btn.textContent.toLowerCase() === 'default');
        btn.classList.toggle('active', btnText || isDefaultActive);
    });
}

// --- Background Particles ---

/**
 * Creates individual background particles for the ambient effect.
 */
function createParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            // Random start position
            particle.style.left = Math.random() * 100 + '%';
            // Random animation timing for a scattered effect
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            document.body.appendChild(particle);
            
            // Clean up particle after its animation ends (8 seconds)
            setTimeout(() => {
                particle.remove();
            }, 8000);
        }, i * 200);
    }
}

// --- Event Listeners and Initialization ---

// Add button press visual effect to all calculator buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Pass e.currentTarget to ensure the effect is applied to the button itself, not a child element
        addButtonPressEffect(e.currentTarget);
    });
});

// Global keyboard event listener for calculator input
document.addEventListener('keydown', (event) => {
    const key = event.key;
    // Numbers and basic operators
    if (/[0-9]/.test(key) || ['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } 
    // Calculate result
    else if (key === 'Enter' || key === '=') {
        calculateResult();
    } 
    // Backspace
    else if (key === 'Backspace') {
        backspace();
    } 
    // Clear display/all
    else if (key === 'Escape' || key === 'c') {
        clearDisplay();
    } 
    // Specific function shortcuts (using single letters)
    else if (key === 'Delete') {
        clearEntry(); // Clear the current number, not memory
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

// Initialize background particles and set an interval to refresh them
createParticles();
setInterval(createParticles, 10000);
