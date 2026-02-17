//TIPP session log viewing and deleting functionality

// CONSTANTS

// Variables

let logId = "699253a7a17a677e8b914077";

// FUNCTIONS

function showError({ msg = "", res, type = "danger" } = {}) {
  const main = document.querySelector("main");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.role = type;
  alert.innerText = `${msg}: ${res.status} ${res.statusText}`;
  main.prepend(alert);
}

function renderLogs(logs) {
  const logDiv = document.getElementById("logs");
  logDiv.innerHTML = ""; //clear out any old cards
  for (const {
    emotionBefore,
    emotionAfter,
    distressBefore,
    distressAfter,
    tempTime,
    exerciseTime,
    breathingTime,
    relaxationTime,
    timestamp,
  } of logs) {
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.innerHTML = `
        <div>${emotionBefore} ${emotionAfter} ${distressBefore}, ${distressAfter}, ${tempTime}, ${exerciseTime}, ${breathingTime}, ${relaxationTime}, ${timestamp} </div> 
      `;
    logDiv.appendChild(card);
  }
}

async function refreshLogs() {
  const res = await fetch("/api/log");
  if (!res.ok) {
    console.error("Failed to fetch log data");
    showError({
      msg: "Failed to load log data. Please try again later.",
      res,
    });
    return;
  }

  const data = await res.json();
  console.log("Fetched logs", data);
  renderLogs(data.logs);
}

async function deleteLog(logId) {
  console.log("FE: DELETE /api/log/:logId");
  try {
    const response = await fetch(`/api/log/${logId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("FE: Failed to DELETE log data: ", response.status);
      return;
    }
    const data = await response.json().catch(() => {});
    console.log("Success! Response: ", data);
  } catch (err) {
    console.error("Network error patching log: ", err);
  }
}

refreshLogs();

deleteLog(logId);