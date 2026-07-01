# Micro-Blogging Web Application....

A very simple, beginner-friendly RESTful API based Micro-Blogging web application suitable for lab demonstrations. 

## Tech Stack

* **Frontend:** Basic HTML, Vanilla CSS (Modern aesthetic), Vanilla JavaScript, Fetch API
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Self-contained, auto-creates database & table)

## Setup & Running Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Step 1: Install Dependencies
Open your terminal in this project directory and run:

```bash
npm install
```
*(This will install `express`, `cors`, and `sqlite3` as defined in package.json)*

### Step 2: Start the Server
Run the following command to start the backend server and auto-generate the database:

```bash
node server.js
```
*(You can also use `npm start`)*

### Step 3: Open the Frontend
Since Express is configured to serve static files from the `public/` directory, you can simply open your browser and navigate to:

**http://localhost:3000**

You will see the Micro-Blogging interface where you can create and read posts!

---

## API Endpoints Overview

The backend exposes the following RESTful endpoints:

* `GET /posts` - Retrieves all blog posts ordered by most recent.
* `POST /posts` - Creates a new post. Expects JSON payload: `{"username": "...", "content": "..."}`
* `DELETE /posts/:id` - Deletes a specific post by its numeric ID.
