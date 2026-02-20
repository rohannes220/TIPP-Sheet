# User Personas
### __Alex__ the stressed college student
* Needs quick, accessible tools to manage overwhelming emotions.
* Wants simple, guided exercises they can do between classes on their phone.
### __Jordan__ the working professional
* Experiences high stress during the workday.
* Wants a structured way to regulate emotions and track progress over time.
### __Riley__ the wellness-focused individual
* Actively practices mindfulness and self‑regulation.
* Wants a centralized place to log distress levels and explore TIPP techniques.

# User Stories
## 1. __TIPP Exercises__
* As Alex the stressed college student, I want to browse a list of TIPP techniques so I can use them when I'm distressed.
*  As Alex the stressed college student, I want to view detailed instructions for each technique so I know I'm performing them properly.
## 2. Progess Tracking
* As Riley the wellness-focused individual, I want to record my distress levels and underlying emotion before starting a TIPP exercise
* As Riley the wellness-focused individual, I want to record my distress levels and emotions after performing TIPP exercise(s) so I can demonstrate that how well the technique worked.
* As Riley the wellness-focused individual, I want to delete a log I created previously so I can fix mistakes.
* As Riley the wellness-focused individual, I want to delete all my distress log I created previously so I can fix mistakes.
* As Riley the wellness-focused individual, I can edit previous distress logs if they seem innacurate.
## 3. Progress Tracking
* As Jordan the working professional, I want to see visual summaries of my distress levels and emotions across a calendar view, so I can understand my emotional patterns.
* As Jordan the working professional, I want to view distress level and emotion chages across TIPP techniques
* As Jordan the working professional, I want to view performed TIPP exercises across a calendar view
## 4. User Login
* As Jordan the working professional, I want to sign up for an account so I can associate my exercises with me.
* As Jordan the working professional, I want to login to my account so I can to access my personalized history.
* As Jordan the working professional, I want to delete my account so I can remove all my data from the server.


# API Routes
## Log
Operations related to logging TIPP technique effectiveness. The log resource model is:
```json
{
  "userID": "uuid",
  "distressBefore": "number | null",
  "emotionBefore" : "number | null",
  "distressAfter": "number | null",
  "emotionAfter": "number | null",
  "temperatureTime": "number",
  "intenseExerciseTime" : "number",
  "breathingTime" : "number",
  "relaxationTime" : "number",
  "timestamp" : "timestamp"
}
```
| Operation | Endpoint       | Description                                                   |
| --------- | -------------- | --------------------------------------------------------------| 
| POST      | `/api/log`         | log distress levels and emotion before using TIPP             |
| PATCH     | `/api/log/{logId}` | log technique(s) used, distress, and emotion after using TIPP |
| DELETE    | `/api/log/{logId}` | delete a specified log                                        |
| PUT       | `/api/log/{logID}` | update a specified log                                        |
| GET       | `/api/log/findLogs`| returns user's logs filtered by `startDate` and `endDate`     |


## User
Operations related to user account management. The user resource model is:
```json
{
  "userId": "number",
  "firstName": "string",
  "username": "string",
  "password": "string"
}
```
| Operation | Endpoint       | Description                                                   |
| --------- | -------------- | --------------------------------------------------------------| 
| POST       | `/api/auth/login`| Authorize a user's credentials and return a JWT     |
| POST       | `/api/auth/signup`| Create a user account and return a JWT     |
| GET       | `/api/auth/me`| Return user information like username, first name and id     |
| DELETE       | `/api/auth/me`| Delete a user account along with all user associated data in sessionLogs collection     |
| PATCH       | `/api/auth/me`| Update a user's first name     |
