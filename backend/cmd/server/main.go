package main

import (
	"fmt"
	"net/http"
	"quick-quiz-app/backend/internal/auth"
	"quick-quiz-app/backend/internal/db"
	"quick-quiz-app/backend/internal/quiz"
	"quick-quiz-app/backend/internal/realtime"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	db.InitDB()
	r := mux.NewRouter()

	// API routes
	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/register", auth.RegisterHandler).Methods("POST")
	apiRouter.HandleFunc("/login", auth.LoginHandler).Methods("POST")

	// Protected routes
	protected := apiRouter.PathPrefix("").Subrouter()
	protected.Use(auth.AuthMiddleware)
	protected.HandleFunc("/quizzes", quiz.GetQuizzesHandler).Methods("GET")
	protected.HandleFunc("/quizzes", quiz.CreateQuizHandler).Methods("POST")
	protected.HandleFunc("/quizzes/{id}", quiz.GetQuizHandler).Methods("GET")

	// Websocket routes
	wsRouter := r.PathPrefix("/ws").Subrouter()
	wsRouter.HandleFunc("/quiz/{id}/join", realtime.ServeWs)

	// Apply CORS middleware
	handler := cors.Default().Handler(r)

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", handler)
}
