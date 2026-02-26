## TIPP-Sheet
TIPP Sheet is a mental‑health resource platform designed to help users practice distress‑tolerance skills using the evidence‑based TIPP workflow (Temperature, Intense Exercise, Paced Breathing, Progressive Muscle Relaxation). The platform guides users through structured exercises and allows them to record distress levels before and after each session. Over time, users can review their logs and session summaries to better understand what techniques work best for them. This project does not store sensitive personal data, does not analyze free form mental health notes, and is intended as a convenient learning tool to practice distress tolerance for low-acuity users. It is not a replacement for supervised therapy, instead just one tool. TIPP-Shet is a MEN (MongoDB, Express, Nodejs) stack web platform created as an academic project for CS5610 Web Development at Northeastern University. This was created by **Yash Mahesh Burshe** and **Ben Piperno**.

# Usage
* Visit the deployed version [here](https://tipp-sheet.onrender.com "Hosted on render")
* Alternatively, clone this repo
* Create a mongoDB deployment (either locally or via cloud). Use the example data provided in `./backend/data/userExampleData.json` and `./backend/data/sessionLogExampleData.json` as collections named "users" and "sessionLogs" respectively.
* create a file named `.env` and place it in the root of the project. in it add the MongoDB connection string using the key "MONGODB_URI"
* Generate a JWT secret key and place it in the `.env` file using the key "JWT_SECRET"
* build a local version using the following commands:
  `npm install && npm start`

# Links
- [Deployment URL](https://tipp-sheet.onrender.com "View the website as an end user")
- [Design Documents](/designdoc/README.md "View planning materials")
- [Presentation Slides](https://docs.google.com/presentation/d/1HAD6tIYrmdqC5iDKvJT0JPu7LSjdJjrOgLk_ntm5As4/edit?usp=sharing "View slides on this website's design and implmentation")
- [Video Demonstration](https://www.markdownguide.org "Watch us present on this website")

#add some directions on how to use the app, great info on the breathing but a little how to guide on how to navigate everywhere
