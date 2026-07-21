const display = document.getElementById("display");
const powerButton = document.querySelector(".on-off");

let isPowerOn = false;
let displayValue = "0";
let firstOperand = null;
let pendingOperator = null;
let waitingForOperand = false;
let calculationFinished = false;

function resetCalculator() {
    displayValue = "0";
    firstOperand = null;
    pendingOperator = null;
    waitingForOperand = false;
    calculationFinished = false;
}

function updateDisplay(value = displayValue) {
    display.value = isPowerOn ? value : "";
}

function togglePower() {
    isPowerOn = !isPowerOn;
    resetCalculator();
    powerButton.classList.toggle("on", isPowerOn);
    updateDisplay();
}

function clearDisplay() {
    if (!isPowerOn) {
        return;
    }

    resetCalculator();
    updateDisplay();
}

function appendNumber(number) {
    if (!isPowerOn) {
        return;
    }

    if (number === ".") {
        if (waitingForOperand || calculationFinished) {
            displayValue = "0.";
            waitingForOperand = false;
            calculationFinished = false;
        } else if (!displayValue.includes(".")) {
            displayValue += ".";
        }

        updateDisplay();
        return;
    }

    if (waitingForOperand || calculationFinished || displayValue === "0") {
        displayValue = number;
    } else if (displayValue.length < 15) {
        displayValue += number;
    }

    waitingForOperand = false;
    calculationFinished = false;
    updateDisplay();
}

function calculate(left, right, operator) {
    switch (operator) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return right === 0 ? null : left / right;
        default:
            return null;
    }
}

function formatResult(result) {
    if (!Number.isFinite(result)) {
        return null;
    }

    // JavaScript의 부동소수점 오차가 화면에 길게 표시되지 않도록 정리합니다.
    return String(Number(result.toFixed(10)));
}

function showCalculationError() {
    display.value = "Error";
    console.error("0으로 나눌 수 없습니다.");
    resetCalculator();
    calculationFinished = true;
}

function appendOperator(operator) {
    if (!isPowerOn) {
        return;
    }

    // 숫자를 새로 입력하기 전에 연산자를 다시 누르면 연산자만 교체합니다.
    if (pendingOperator !== null && waitingForOperand) {
        pendingOperator = operator;
        return;
    }

    const inputValue = Number(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (pendingOperator !== null) {
        const result = calculate(firstOperand, inputValue, pendingOperator);
        const formattedResult = result === null ? null : formatResult(result);

        if (formattedResult === null) {
            showCalculationError();
            return;
        }

        displayValue = formattedResult;
        firstOperand = Number(formattedResult);
        updateDisplay();
    }

    pendingOperator = operator;
    waitingForOperand = true;
    calculationFinished = false;
}

function performCalculate() {
    if (
        !isPowerOn ||
        firstOperand === null ||
        pendingOperator === null ||
        waitingForOperand
    ) {
        return;
    }

    const secondOperand = Number(displayValue);
    const result = calculate(firstOperand, secondOperand, pendingOperator);
    const formattedResult = result === null ? null : formatResult(result);

    if (formattedResult === null) {
        showCalculationError();
        return;
    }

    displayValue = formattedResult;
    firstOperand = null;
    pendingOperator = null;
    waitingForOperand = false;
    calculationFinished = true;
    updateDisplay();
}

document.addEventListener("keydown", (event) => {
    if (!isPowerOn) {
        return;
    }

    if (/^[0-9.]$/.test(event.key)) {
        appendNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        appendOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        performCalculate();
    } else if (event.key === "Escape" || event.key === "Delete") {
        clearDisplay();
    } else {
        return;
    }

    event.preventDefault();
});

// 계산기는 전원이 꺼진 상태로 시작합니다.
updateDisplay();
