// *JavaScript for Modal, Kanban, and Custom Expense Functionality.
// *Unique identifier for each expense card.
let expenseId = 0;
let totalIncome = 0;
let totalExpenses = 0;

// *Nav Dropdown Toggle
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

// *Load data from local storage on page load
document.addEventListener("DOMContentLoaded", loadExpenses);

function openIncomeModal() {
  document.getElementById("incomeModal").classList.remove("hidden");
}

function saveIncome() {
  const income = parseFloat(document.getElementById("incomeInput").value);
  if (!isNaN(income) && income > 0) {
    totalIncome = income;
    localStorage.setItem("income", income);
    document.getElementById("incomeModal").classList.add("hidden");
    // *Open the expense modal.
    openExpenseModal();
  } else {
    alert("Please enter a valid income amount.");
  }
}

function openExpenseModal() {
  document.getElementById("expenseModal").classList.remove("hidden");
}

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;

  if (name && !isNaN(amount) && amount > 0 && category) {
    createExpenseCard(name, amount, category);
    // *Only add to total expenses if the category is not 'gonzo.'
    if (category !== "gonzo") {
      totalExpenses += amount;
    }
    // *Recalculate and update the money meter.
    updateMoneyMeter();
    // *Save expenses to local storage
    saveExpenses();
  } else {
    alert("Please fill in all fields with valid entries.");
  }
}

function createExpenseCard(name, amount, category) {
  console.log(
    `Creating card for ${name}, Amount: ${amount}, Category: ${category}`
  );
  const card = document.createElement("div");
  card.id = "expense-" + expenseId++;
  card.innerHTML = `
  <div class="flex justify-between items-center p-2 bg-white rounded" data-category="${category}" data-amount="${amount}">
    <div class="flex-grow"> <!-- This div will wrap the name and amount and make them grow to use available space -->
      <strong>${name}</strong>: $${amount.toFixed(2)}
    </div>
    <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onclick="deleteExpenseCard(event, '${
      card.id
    }')">Delete</button>
  </div>
`;
  card.draggable = true;
  card.ondragstart = drag;
  card.classList.add(
    "bg-white",
    "p-2",
    "mb-2",
    "rounded",
    "shadow",
    "cursor-move"
  );
  card.setAttribute("data-category", category);
  card.setAttribute("data-amount", amount);
  document.getElementById(category).appendChild(card);
}

function closeExpenseModal() {
  document.getElementById("expenseModal").classList.add("hidden");
}

function closeCustomExpenseModal() {
  document.getElementById("customExpenseModal").classList.add("hidden");
}

function allowDrop(event) {
  // *This allows a drop by preventing the default handling of the element.
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text/plain");
  var card = document.getElementById(data);
  // *Ensure it's dropping into a category section.
  var dropZone = event.target.closest(".category-section");

  if (!dropZone) {
    console.error("Not a valid drop zone");
    // *Stop the function if not dropped into a category section.
    return;
  }

  var newCategory = dropZone.id;
  var oldCategory = card.getAttribute("data-category");
  var amount = parseFloat(card.getAttribute("data-amount"));

  // *Update the card's category.
  card.setAttribute("data-category", newCategory);
  // *Move the card to the new section.
  dropZone.appendChild(card);

  updateFinancials(oldCategory, newCategory, amount);
  // *Save expenses to local storage
  saveExpenses();
}

function updateFinancials(oldCategory, newCategory, amount) {
  if (isNaN(amount)) {
    console.error("Invalid amount:", amount);
    // *Prevent processing if the amount is not a valid number.
    return;
  }

  if (oldCategory !== "gonzo" && newCategory === "gonzo") {
    totalExpenses -= amount;
  } else if (oldCategory === "gonzo" && newCategory !== "gonzo") {
    totalExpenses += amount;
  }

  // *Always update the money meter after financial changes.
  updateMoneyMeter();
}

function updateMoneyMeter() {
  const financialBalance = totalIncome - totalExpenses;
  const moneyMeter = document.getElementById("moneyMeter");
  const debtMeter = document.getElementById("debtMeter");
  const statusText = document.getElementById("statusText");
  const surplusPercentage = document.getElementById("surplusPercentage");
  const debtPercentage = document.getElementById("debtPercentage");

  const meterHeight = Math.abs(financialBalance / totalIncome) * 50;

  if (financialBalance >= 0) {
    moneyMeter.style.height = `${Math.min(meterHeight, 50)}%`;
    moneyMeter.style.top = `${50 - Math.min(meterHeight, 50)}%`;
    debtMeter.style.height = "0%";
    surplusPercentage.textContent = `Surplus (${Math.round(meterHeight * 2)}%)`;
    debtPercentage.textContent = "-100%";
  } else {
    moneyMeter.style.height = "0%";
    debtMeter.style.height = `${Math.min(meterHeight, 50)}%`;
    debtMeter.style.top = "50%";
    surplusPercentage.textContent = "Surplus";
    debtPercentage.textContent = `-${Math.round(meterHeight * 2)}%`;
  }

  statusText.textContent =
    financialBalance >= 0
      ? `Surplus: $${financialBalance.toFixed(2)} / Debt: $0.00`
      : `Surplus: $0.00 / Debt: $${Math.abs(financialBalance).toFixed(2)}`;
}

// *Function to handle the opening of the custom expense modal.
function openCustomExpenseModal() {
  document.getElementById("customExpenseModal").classList.remove("hidden");
}

// *Function to add a custom expense.
function addCustomExpense() {
  const customName = document.getElementById("customExpenseName").value;
  const customAmount = parseFloat(
    document.getElementById("customExpenseAmount").value
  );
  const customCategory = document.getElementById("customExpenseCategory").value;

  if (
    customName &&
    !isNaN(customAmount) &&
    customAmount > 0 &&
    customCategory
  ) {
    createExpenseCard(customName, customAmount, customCategory);
    // *Only add to total expenses if the category is not 'gonzo.'
    if (customCategory !== "gonzo") {
      totalExpenses += customAmount;
    }

    // *Recalculate and update the money meter.
    // *Optionally close the modal.
    updateMoneyMeter();
    closeCustomExpenseModal();
    // *Save expenses to local storage
    saveExpenses();
  } else {
    alert(
      "Please fill in all fields with valid entries for the custom expense."
    );
  }
}

function deleteExpenseCard(event, cardId) {
  console.log("Attempting to delete card with ID:", cardId);
  const card = document.getElementById(cardId);
  if (!card) {
    alert("Error: Card not found!");
    return;
  }

  const amount = parseFloat(card.getAttribute("data-amount"));
  const category = card.getAttribute("data-category");

  if (category !== "gonzo") {
    totalExpenses -= amount;
  }

  card.remove();
  updateMoneyMeter();
  // *Save expenses to local storage
  saveExpenses();
  event.stopPropagation();
}

// *S&P 500 ETF, NASDAQ ETF & Apple.
document.addEventListener("DOMContentLoaded", function () {
  loadMarketData("SPY", "sp500Graph");
  loadMarketData("QQQ", "nasdaqGraph");
  loadMarketData("AAPL", "aaplGraph");
});

async function loadMarketData(ticker, canvasId) {
  const apiKey = "lJQ5GF4aMI8Y6gTcU7Vrv3jM6TSI3kHa";
  const storageKey = `${ticker}-data`;
  const cachedData = localStorage.getItem(storageKey);

  if (cachedData) {
    const data = JSON.parse(cachedData);
    plotData(data, canvasId);
    console.log(`Using cached data for ${ticker}`);
  } else {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-01/2023-12-31?apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.results) {
        localStorage.setItem(storageKey, JSON.stringify(data));
        plotData(data, canvasId);
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  }
}

function plotData(data, canvasId) {
  const prices = data.results.map((res) => res.c);
  const labels = data.results.map((res) =>
    new Date(res.t).toLocaleDateString()
  );
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${canvasId.replace("Graph", "")} Prices`,
          data: prices,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  });
}

// *Save expenses to local storage
function saveExpenses() {
  const expenses = [];
  const expenseCards = document.querySelectorAll("[id^='expense-']");
  expenseCards.forEach((card) => {
    const name = card.querySelector("strong").textContent;
    const amount = parseFloat(card.getAttribute("data-amount"));
    const category = card.getAttribute("data-category");
    expenses.push({ name, amount, category });
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// *Load data from local storage
function loadExpenses() {
  const income = localStorage.getItem("income");
  if (income) {
    totalIncome = parseFloat(income);
  }

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.forEach((expense) => {
    createExpenseCard(expense.name, expense.amount, expense.category);
    if (expense.category !== "gonzo") {
      totalExpenses += expense.amount;
    }
  });

  updateMoneyMeter();
}

// *Toggle event listener for nav dropdown.
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});