"use strict";

// DOM elements
const birthDateInput = document.getElementById("birthDate");
const btnCalc = document.getElementById("btnCalc");
const btnReset = document.getElementById("btnReset");
const outYears = document.getElementById("outYears");
const outMonths = document.getElementById("outMonths");
const outDays = document.getElementById("outDays");

// Calculate button functionality
btnCalc.addEventListener("click", () => {
  const [y, m, d] = birthDateInput.value.split("-").map(Number);
  const birthDate = new Date(y, m - 1, d);
  const today = new Date();
  if (Number.isNaN(birthDate.getTime())) {
    alert("Please enter a valid date.");
    return;
  }

  if (birthDate > today) {
    outYears.textContent = "00";
    outMonths.textContent = "00";
    outDays.textContent = "00";
    alert("Birthdate cannot be in the future.");
    return;
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  outYears.textContent = years.toString().padStart(2, "0");
  outMonths.textContent = months.toString().padStart(2, "0");
  outDays.textContent = days.toString().padStart(2, "0");
});

// Disable calculate button until a date is entered
btnCalc.disabled = true;
birthDateInput.addEventListener("input", () => {
  btnCalc.disabled = !birthDateInput.value;
});

// Reset button functionality
btnReset.addEventListener("click", () => {
  birthDateInput.value = "";
  outYears.textContent = "00";
  outMonths.textContent = "00";
  outDays.textContent = "00";
  btnCalc.disabled = true;
});
