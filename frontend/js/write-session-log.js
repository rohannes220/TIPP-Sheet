//front end script to read a distress slider and an emotion selection button group, and make a POST /api/log call upon starting a session

//------------ CONSTANTS --------------------------
const storage = window.localStorage;

const DISTRESS_LABELS = ["0", "1", "2", "3", "4", "5"];

const EMOTION_MAP = {
  Joyful: [
    "Excited",
    "Sensuous",
    "Energetic",
    "Cheerful",
    "Creative",
    "Hopeful",
  ],
  Powerful: [
    "Aware",
    "Proud",
    "Respected",
    "Appreciated",
    "Important",
    "Faithful",
  ],
  Peaceful: [
    "Content",
    "Thoughtful",
    "Intimate",
    "Loving",
    "Trusting",
    "Nurturing",
  ],
  Sad: ["Tired", "Bored", "Lonely", "Depressed", "Ashamed", "Guilty"],
  Mad: ["Hurt", "Hostile", "Angry", "Selfish", "Hateful", "Critical"],
  Scared: [
    "Confused",
    "Rejected",
    "Helpless",
    "Submissive",
    "Insecure",
    "Anxious",
  ],
};

//------------ API VARIABLES ----------------------
let userId = 0; //TODO: FUTURE WORK: integrate users collection. For now hardcode to user 0;
let logId = storage.getItem("logId");
let distressLevel = null;
let emotion = null;
let tempTime = Number(storage.getItem("tempTime")) || 0;
let exerciseTime = Number(storage.getItem("exerciseTime")) || 0;
let breathingTime = Number(storage.getItem("breathingTime")) || 0;
let relaxationTime = Number(storage.getItem("relaxationTime")) || 0;

//------------ DOM REFERENCES ---------------------
//UI elements to select and display a user's current distress level
const distressSlider = document.getElementById("stepSlider");
const distressLevelLabel = document.getElementById("sliderValue");

//UI element to provide user to select an emotion that best describes their feeling
const mainEmotionContainer = document.getElementById("main-options");
const subEmotionContainer = document.getElementById("sub-options");

//Collect user info
const openSurveyButton = document.getElementById("open-survey-btn"); //open the modal to track user info
const saveInfoButton = document.getElementById("save-survey-btn"); //save the user info tracked

//display previously logged data
const preTIPPDistress = document.getElementById("preTIPPDistress");
const preTIPPEmotion = document.getElementById("preTIPPEmotion");

//Delete log button
const deleteLogButton = document.getElementById("delete-log-btn");

//------------ FUNCTIONS ------------------------------
function renderEmotionOptions() {
  Object.keys(EMOTION_MAP).forEach((key, index) => {
    const id = `main-${index}`;

    mainEmotionContainer.insertAdjacentHTML(
      "beforeend",
      `
            <input type="radio" class="btn-check" name="main" id="${id}" value="${key}">
            <label class="btn btn-primary" for="${id}">${key}</label>
            `,
    );
  });
}

function renderSubEmotionOptions(mainEmotion) {
  subEmotionContainer.innerHTML = `
        <h6>Does a more specific sub-emotion for <strong>${mainEmotion}</strong> fit better?</h6>
        <div class="btn-group" role="group">
            ${EMOTION_MAP[mainEmotion]
              .map((sub, i) => {
                const id = `sub-${i}`;
                return `
                        <input type="radio" class="btn-check" name="sub" id="${id}" value="${sub}">
                        <label class="btn btn-info" for="${id}">${sub}</label>
                    `;
              })
              .join("")}
        </div>
    `;
}

async function postPreSessionLog() {
  const requestBody = { userId, distressLevel, emotion };
  console.log("FE: POST /api/log with body:", requestBody);

  try {
    const response = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Failed to post log data", response.status);
      return;
    }

    const data = await response.json().catch(() => {});
    console.log("Success! Response:", data);
    storage.setItem("logId", data.id);
    console.log("logId: ", storage.getItem("logId"));
  } catch (err) {
    console.error("Network error posting log:", err);
  }
}

async function patchPostSessionLog() {
  if (logId === null) {
    console.error("FE: tried patching session log without logID!");
    return;
  }

  const requestBody = {
    distressLevel,
    emotion,
    tempTime,
    exerciseTime,
    breathingTime,
    relaxationTime,
  };
  console.log(
    "FE: PATCH /api/log/:logId requestBody: ",
    requestBody,
    "logId ",
    logId,
  );

  try {
    const response = await fetch(`/api/log/${logId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("FE: Failed to PATCH log data: ", response.status);
      return;
    }

    const data = await response.json().catch(() => {});
    console.log("Success! Response: ", data);
    storage.clear(); //clear out kv pairs on this domain.
  } catch (err) {
    console.error("Network error patching log: ", err);
  }
}

async function deleteSessionLog() {
  console.log("FE: DELETE /api/log/:logId", logId);
  try {
    const response = await fetch(`/api/log/${logId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("FE: failed to delete log daata: ", response.status);
      return;
    }

    console.log("Success! ", response);
  } catch (err) {
    console.error("Network error deleting log: ", err);
  }
}

async function getSessionLog() {
  console.log("FE: GET /api/log/:logId", logId);
  try {
    const response = await fetch(`/api/log/${logId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("FE: failed to get log daata: ", response.status);
      return {};
    }
    const data = await response.json();
    console.log("Success! ", data.log);
    return data.log || {};
  } catch (err) {
    console.error("Network error deleting log: ", err);
    return {};
  }
}

async function renderPreTIPPmodalInfo() {
  console.log("Trying to pull up pre-tipp session data!");
  let preDistress;
  let preEmotion;

  //try to retrieve with a get call
  try {
    const data = await getSessionLog();
    console.log("data:", data);
    const {distressBefore, emotionBefore} = data;
    console.log("fields: ", distressBefore, emotionBefore);
    preDistress = data.distressBefore || "not recorded";
    preEmotion = data.emotionBefore || "not recorded";
  } catch (err) {
    console.error("Error getting previous log data", err);
    preDistress = "not found";
    preEmotion = "not found";
  } finally {
    //update the html
    preTIPPEmotion.innerText = preEmotion;
    preTIPPDistress.innerText = preDistress;
  }
}

//------------ EVENT LISTENERS ------------------------

distressSlider.addEventListener("input", () => {
  distressLevel = parseInt(distressSlider.value, 10);
  distressLevelLabel.textContent = DISTRESS_LABELS[distressLevel];
});

mainEmotionContainer.addEventListener("change", (e) => {
  renderSubEmotionOptions(e.target.value);
  emotion = e.target.value;
});

subEmotionContainer.addEventListener("change", (e) => {
  emotion = e.target.value;
});

if (preTIPPDistress && preTIPPDistress) {
  openSurveyButton.addEventListener("click", async () => {
    renderPreTIPPmodalInfo()
  });
}

saveInfoButton.addEventListener("click", () => {
  if (saveInfoButton.getAttribute("data-surveytype") == "pre") {
    postPreSessionLog();
  } else if (saveInfoButton.getAttribute("data-surveytype") == "post") {
    patchPostSessionLog();
  }
  //disable the button to open the modal again
  //TODO: future work: allow users to revise their submission
  //TODO: upon completion, append a booststrap alert to let the user know their info has been logged
  openSurveyButton.disabled = true;
  openSurveyButton.innerText = "Info submitted";
});

if (deleteLogButton) {
  deleteLogButton.addEventListener("click", () => {
    deleteSessionLog();
    deleteLogButton.innerText = "Info Session data removed";
    deleteLogButton.disabled = true;
  });
}

//------------ RUN MISC RENDERING FUNCTIONS --------------------------
renderEmotionOptions();