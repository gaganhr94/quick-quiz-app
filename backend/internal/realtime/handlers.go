package realtime

import (
	"database/sql"
	"log"
	"net/http"
	"quick-quiz-app/backend/internal/quiz"

	"github.com/gorilla/mux"
)

var hubs = make(map[string]*Hub)

func ServeWs(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	quizID := vars["id"]
	name := r.URL.Query().Get("name")

	// Fetch quiz from database
	currentQuiz, err := quiz.GetQuiz(quizID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.NotFound(w, r)
			return
		}
		log.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	hub, ok := hubs[quizID]
	if !ok {
		hub = NewHub(*currentQuiz)
		hubs[quizID] = hub
		go hub.Run()
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), name: name}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
