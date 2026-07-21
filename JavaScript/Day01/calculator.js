// 기본 사칙연산 함수
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

// 브라우저 콘솔에서 실행하면 prompt()가 입력창을 띄웁니다.
function inputFormula() {
    return prompt("계산식을 입력하세요. (예: 1 + 2 * 3)");
}

// 입력한 문자열을 숫자와 연산자로 분리합니다.
function tokenize(formula) {
    const expression = formula.replace(/\s/g, "");
    const tokens = [];
    let index = 0;
    let expectsNumber = true;

    if (expression === "") {
        return null;
    }

    while (index < expression.length) {
        const rest = expression.slice(index);

        if (expectsNumber) {
            // 식의 첫 숫자나 연산자 뒤의 숫자에는 음수/양수를 허용합니다.
            const numberMatch = rest.match(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)/);

            if (!numberMatch) {
                return null;
            }

            const value = Number(numberMatch[0]);
            if (!Number.isFinite(value)) {
                return null;
            }

            tokens.push(value);
            index += numberMatch[0].length;
            expectsNumber = false;
        } else {
            const operator = rest[0];

            if (!["+", "-", "*", "/"].includes(operator)) {
                return null;
            }

            tokens.push(operator);
            index += 1;
            expectsNumber = true;
        }
    }

    return expectsNumber ? null : tokens;
}

function calculate(formula) {
    if (typeof formula !== "string") {
        return "계산식은 문자열로 입력해주세요.";
    }

    const tokens = tokenize(formula);
    if (!tokens) {
        return "잘못된 계산식이 입력되었습니다.";
    }

    // 1단계: 곱셈과 나눗셈을 먼저 계산합니다.
    const intermediateTokens = [tokens[0]];

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const right = tokens[i + 1];

        if (operator === "*" || operator === "/") {
            const left = intermediateTokens.pop();

            if (operator === "/" && right === 0) {
                return "0으로 나눌 수 없습니다.";
            }

            const result = operator === "*"
                ? multiply(left, right)
                : divide(left, right);

            intermediateTokens.push(result);
        } else {
            intermediateTokens.push(operator, right);
        }
    }

    // 2단계: 덧셈과 뺄셈을 왼쪽부터 계산합니다.
    let result = intermediateTokens[0];

    for (let i = 1; i < intermediateTokens.length; i += 2) {
        const operator = intermediateTokens[i];
        const right = intermediateTokens[i + 1];

        result = operator === "+"
            ? add(result, right)
            : subtract(result, right);
    }

    return result;
}

function start(formula) {
    const input = formula === undefined ? inputFormula() : formula;

    if (input === null || String(input).trim() === "") {
        console.log("계산식을 입력해주세요.");
        return;
    }

    const result = calculate(input);

    if (typeof result === "string") {
        console.log(`에러 발생: ${result}`);
        return;
    }

    console.log(`결과: ${result}`);
    return result;
}

// 이 파일의 전체 코드를 브라우저 개발자 도구 Console에 붙여 넣으면
// 아래 함수가 실행되면서 계산식을 입력하는 창이 열립니다.
start();
