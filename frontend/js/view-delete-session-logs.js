//TIPP session log viewing functionality


// CONSTANTS


// Variables

let logId = '699253a7a17a677e8b914077';


// FUNCTIONS



function GetLogs() {
  //get all logs in a given time frame

  const me = {};

  me.showError = ( {msg = "", res, type = "danger"} = {}) => {
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = type;
    alert.innerText = `${msg}: ${res.status} ${res.statusText}`;
    main.prepend(alert);
  };

  me.renderLogs = (logs) => {
    const logDiv = document.getElementById("logs");
    logDiv.innerHTML = ""; //clear out any old cards
    for (const {emotionBefore, emotionAfter, distressBefore, distressAfter, tempTime, exerciseTime, breathingTime, relaxationTime, timestamp} of logs) {
      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div>${emotionBefore} ${emotionAfter} ${distressBefore}, ${distressAfter}, ${tempTime}, ${exerciseTime}, ${breathingTime}, ${relaxationTime}, ${timestamp} </div> 
      `;
      logDiv.appendChild(card);
    }
  };

  me.refreshLogs = async () => {
    const res = await fetch("/api/log");
    if (!res.ok) {
      console.error("Failed to fetch log data");
      me.showError( {msg: "Failed to load log data. Please try again later.", res});
      return;
    }

    const data = await res.json();
    console.log("Fetched logs", data);
    me.renderLogs(data.logs);
  };

  me.deleteLog = async (logId) => {
    console.log("FE: DELETE /api/log/:logId");
    try {
      const response = await fetch(`/api/log/${logId}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
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
  };

  return me;
}

const logs = GetLogs();
logs.refreshLogs();
logs.deleteLog(logId);