# ROam - Local Adventure Planner

A full-stack web application that helps users discover and organize local adventures based on their interests and location.

## Team Members
- Braniște Dragoș

## Project Overview

Local Adventure Planner allows users to explore local adventure ideas like hiking trails, escape rooms, cultural attractions, or food tours. Users can register as either **Adventurers** or **Organizers**, with separate views and functionality.

This application was developed as part of the FIS course project, with the following goals:
- Modern web development using **React** for frontend and **Node.js + SQLite** for backend.
- Secure user login and registration with different roles.
- Database persistence using SQLite.
- Clean architecture with modular components and routes.
- Interactive and responsive UI.

---

## Technologies Used

| Layer           | Technology                                  |
|-----------------|---------------------------------------------|
| Frontend        | React                                       |
| Backend         | Node.js, Express.js                         |
| Database        | SQLite (via sqlite3)                        |
| Auth            | bcrypt, express-session                     |
| Build Tools     | npm (with separate front and back packages) |
| Version Control | Git + GitHub                                |

---

## Features

### Major (Sea-level) Use Cases

- User Registration & Login (Explorer or Guide)
- Create & Manage Adventures (Guide)
- Browse & Search Adventures (Explorer)
- Join an Adventure (Explorer)

### Minor (Fish-level) Use Cases
- Role-Based Access Control
- Display Joined Adventures
- Image Upload & Preview

---

## Project Setup

### 0. Prerequisites
To run this project you need to have node and redis installed. Both of these can be installed using the package manager or following official documentation:

- [Node.js](https://nodejs.org/en/download)
- [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-linux/)


### 1. Clone the repo
`git clone https://github.com/branisted/ROam`

### 2. Install dependencies
`npm run install:all`

### 3. Set up environment variables
- Copy `.env.example` from `backend/` to `.env` in `backend/src/config`
- Edit as needed

### 4. Run the app (both backend and frontend)
`npm start-prod`

- Backend runs on [http://localhost:3001](http://localhost:3001)
- Frontend runs on [http://localhost:5173](http://localhost:5173)

### 5. (Optional) Create Docker containers
`docker compose up --build`