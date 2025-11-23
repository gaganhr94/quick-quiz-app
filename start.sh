#!/bin/bash

# Start the backend
echo "Starting backend..."
cd backend
go mod tidy
go run ./cmd/server/main.go &
BACKEND_PID=$!
cd ..

# Start the frontend
echo "Starting frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Backend running on http://localhost:8080 (PID: $BACKEND_PID)"
echo "Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"
echo "Press Ctrl+C to stop both servers."

# Wait for both processes to finish (or for Ctrl+C)
wait $BACKEND_PID
wait $FRONTEND_PID

echo "Servers stopped."
