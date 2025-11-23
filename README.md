# Quick Quiz App

This is a real-time quiz application with a Go backend and a React (TypeScript) frontend.

## Features

-   User registration and login
-   Quiz creation with a variable number of options
-   Quiz hosting with QR code for participants to join
-   Real-time quiz flow controlled by the quiz admin
-   Participants can join, answer questions, and see a real-time leaderboard
-   Responsive and modern UI

## How to Run the Application

You can start both the frontend and backend with a single unified command using the `start.sh` script.

### 1. Make the `start.sh` script executable (one-time setup)

Open your terminal or command prompt in the project root directory and run:

```bash
chmod +x start.sh
```
If this command is not available, you may need to manually change the file permissions or run the script using `bash start.sh`.

### 2. Run the application

Open your terminal or command prompt in the project root directory and run:

```bash
./start.sh
```

This script will:
-   Install Go dependencies for the backend.
-   Start the Go backend server (on `http://localhost:8080`) in the background.
-   Install Node.js dependencies for the frontend (if not already installed).
-   Start the React frontend development server (on `http://localhost:5173`) in the background.

You can then open `http://localhost:5173` in your browser to use the application. Press `Ctrl+C` in the terminal running the script to stop both servers.

### Manual Startup (Alternative)

If you prefer to start the backend and frontend separately, follow these steps:

#### 1. Run the Backend

1.  Open your terminal or command prompt.
2.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
3.  Install Go dependencies:
    ```bash
    go mod tidy
    ```
4.  Start the backend server:
    ```bash
    go run ./cmd/server/main.go
    ```
    The backend server will start on `http://localhost:8080`.

#### 2. Run the Frontend

1.  Open a **new** terminal or command prompt window.
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Install Node.js dependencies (make sure you have Node.js and npm installed):
    ```bash
    npm install
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173`. If not, open your web browser and navigate to this URL.

## Usage

1.  **Register/Login:** Access the frontend application and register a new user or log in with existing credentials.
2.  **Create Quiz:** Once logged in, navigate to the "Create a Quiz" page to design your quiz with questions and options.
3.  **Host Quiz:** Go to the "Host a Quiz" page, select a quiz you've created, and start hosting. A QR code and join link will be displayed.
4.  **Join Quiz:** Participants can scan the QR code or use the join link to enter their name and participate in the live quiz.
5.  **Admin Control:** As the host, you can control the quiz flow, present questions, and display the leaderboard.

Enjoy your Quick Quiz!
