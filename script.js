"use strict";

// DOM elements
const birthDateInput = document.getElementById("birthDate");
const btnCalc = document.getElementById("btnCalc");
const btnReset = document.getElementById("btnReset");
const outYears = document.getElementById("outYears");
const outMonths = document.getElementById("outMonths");
const outDays = document.getElementById("outDays");

const segments = document.querySelectorAll(".seg");

const hdrTime = document.getElementById("hdrTime");
const hdrLocation = document.getElementById("hdrLocation");

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Asia/Seoul"

function updateClock() {
  const now = new Date();
  const timeStr = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: tz,
  }).format(now);

  hdrTime.textContent = `${timeStr} (${tz})`;
}

updateClock();
setInterval(updateClock, 1000);

async function loadLocation() {
  try {
    // show something immediately
    hdrLocation.textContent = "Loading…";

    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();

    const city = data.city || "";
    const country = data.country_name || data.country || "";

    hdrLocation.textContent =
      city && country ? `${city}, ${country}` : country || "Unknown";
  } catch (err) {
    console.log("Location error:", err);

    // fallback: at least show timezone region like "Asia/Seoul"
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    hdrLocation.textContent = tz ? tz.replace("_", " ") : "Unknown";
  }
}

loadLocation();

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

  // Update segment widths based on age
  segments.forEach((seg) => {
    const min = Number(seg.dataset.min);
    const max = Number(seg.dataset.max);

    if (years >= min && years <= max) {
      seg.classList.add("active");
    } else {
      seg.classList.remove("active");
    }
  });

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
