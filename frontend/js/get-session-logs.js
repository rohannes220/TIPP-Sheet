//TIPP session logging functionality

console.log("Frontend running!");

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
    for (const {emotionBefore, emotionAfter} of logs) {
      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div>${emotionBefore} ${emotionAfter} </div> 
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
  return me;
}

const logs = GetLogs();
logs.refreshLogs();