const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
let currentInput = "", operand = null, lastOperator = null;

function appendValue(val) {
    currentInput += val;
    display.value = currentInput;
}

function appendOperator(op) {
    if (currentInput === "") return;
    operand = parseFloat(currentInput);
    lastOperator = op;
    currentInput = "";
    display.value = "";
}

function clearDisplay() {
    currentInput = "";
    operand = null;
    lastOperator = null;
    display.value = "";
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}
function calculate() {
    if (!currentInput || operand === null || !lastOperator) return;
    const second = parseFloat(currentInput);
    let result;

    switch (lastOperator) {
        case "+": result = operand + second; break;
        case "-": result = operand - second; break;
        case "×": result = operand * second; break;
        case "÷": result = second !== 0 ? operand / second : "Error"; break;
        case "%": result = (operand * second) / 100; break;
        case "mod": result = second !== 0 ? operand % second : "Error"; break;
    }

    if (result === "Error") {
        display.value = result;
        return;
    }

    const entry = `${operand} ${lastOperator} ${second} = ${result}`;
    addToHistory(entry);
    display.value = result;
    currentInput = result.toString();
    operand = null;
    lastOperator = null;
}

function addToHistory(entry) {
    const li = document.createElement("li");
    li.innerHTML = `
    <label><input type="checkbox" /></label>
    <span>${entry}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
    historyList.prepend(li);
}

document.getElementById("deleteSelectedBtn").addEventListener("click", () => {
    const checkboxes = historyList.querySelectorAll("li input[type='checkbox']");
    checkboxes.forEach(cb => {
        if (cb.checked) cb.closest("li").remove();
    });
});

const themeButton = document.getElementById("themeButton");

function updateThemeIcon() {
    if (document.body.classList.contains("dark")) {
        themeButton.textContent = "🌙 ";
    } else {
        themeButton.textContent = "🌞  ";
    }
}

// Initial icon setup
updateThemeIcon();

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    updateThemeIcon();
});

document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (!isNaN(key) || key === ".") appendValue(key);
    if (["+", "-", "*", "/"].includes(key)) {
        const op = key === "*" ? "×" : key === "/" ? "÷" : key;
        appendOperator(op);
    }
    if (key === "%") appendOperator("%");
    if (key.toLowerCase() === "m") appendOperator("mod");

    if (key === "Enter") calculate();
    if (key === "Backspace") deleteLast();
    if (key === "Escape") clearDisplay();
});

