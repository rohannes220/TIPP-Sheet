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
* As Alex, I want to brows a list of TIPP techniques
*  As Alex, I want to view detailed instructions for each technique
## 2. Progess Tracking
* As Riley, I can record distress levels and before a TIPP exercise
* As Riley, I can record distress levels and emotions after a TIPP exercise
* As Riley, I can delete a distress log I previosly created
* As Riley, I can delete all of my distress logs as part of deleting my account
* As Riley, I can edit previous distress logs if they seem innacurate
## 3. Progress Tracking
* As Jordan, I want to see visual summaries of my distress levels and emotions across a calendar view, so I can understand my emotional patterns.
* As Jordan, I want to view distress level and emotion chages across TIPP techniques
* As Jordan, I want to view performed TIPP exercises across a calendar view
## 4. User Login
* As Jordan, I want to sign up for an account on the website to associate my exercises with .
* As Jordan, I want to login to my account to access my personalized history.
* As Jordan, I want to delete my account to remove all my data from the server.


# API Routes
## Log
Operations related to logging TIPP technique effectiveness. The log resource model is:
Log
```
{
  "userID": "uuid",
  "distressBefore": "number | null",
  "emotionBefore" : "number | null",
  "distressAfter": "number | null",
  "emotionAfter": "number | null",
  "techniques" : ["temperature", "breathing"]
  "timestamp" : "timestamp"
}
```
| Operation | Endpoint       | Description                                                                         |
| --------- | -------------- | ------------------------------------------------------------------------------------| 
| POST      | `/log`         | log distress levels and emotion before using TIPP                                   |
| PATCH     | `/log/{logId}` | log technique(s) used, distress and emotion after using TIPP                        |
| DELETE    | `/log/{logId}` | delete a specified log.                                                             |
| PUT       | `/log/{logID}` | update a specified log.                                                             |
| GET       | `/log/findLogs`| Returns user's logs within a given date range. Filters by `startDate` and `endDate` |

## User
Operations related to user account management. The user resource model is:
```json
{
  "userID": "uuid",
  "passwordHash": "string" 
}
```
| Operation | Endpoint        | Description                                   |
| --------  | --------------- | --------------------------------------------- | 
| POST      | `/user`         | creates user                                  |
| DELETE    | `/user/{userId}`| deletes user and all associated logs          | 
| POST      | `/user/login`   | authenticate user and issue a session token   |
| POST      | `/user/logout`  | invalidate current session token              | 
