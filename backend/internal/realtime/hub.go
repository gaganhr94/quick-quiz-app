package realtime

import (
	"encoding/json"
	"log"
	"quick-quiz-app/backend/internal/quiz"
	"time"
)

type Hub struct {
	clients           map[*Client]bool
	broadcast         chan []byte
	register          chan *Client
	unregister        chan *Client
	quiz              quiz.Quiz
	participants      map[string]*Participant
	gameState         string // "waiting", "question", "leaderboard"
	currentQuestion   int
	questionTimer     *time.Timer
	questionStartTime time.Time
}

func NewHub(quiz quiz.Quiz) *Hub {
	return &Hub{
		broadcast:       make(chan []byte),
		register:        make(chan *Client),
		unregister:      make(chan *Client),
		clients:         make(map[*Client]bool),
		quiz:            quiz,
		participants:    make(map[string]*Participant),
		gameState:       "waiting",
		currentQuestion: -1,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				// a participant leaving should be broadcasted to other participants
				h.broadcastParticipants()
			}
		case messageBytes := <-h.broadcast:
			var message Message
			err := json.Unmarshal(messageBytes, &message)
			if err != nil {
				log.Printf("error: %v", err)
				continue
			}

			switch message.Type {
			case "join":
				// payload is the name of the participant
				name, ok := message.Payload.(string)
				if !ok {
					continue
				}
				// check if name is already taken
				if _, ok := h.participants[name]; ok {
					// send error message to client
					continue
				}
				h.participants[name] = &Participant{Name: name, Score: 0}
				h.broadcastParticipants()

			case "start":
				h.currentQuestion = 0
				h.gameState = "question"
				h.broadcastQuestion()
				h.startQuestionTimer()

			case "answer":
				// payload is the option index
				// for simplicity, we assume the payload is a float64
				payload, ok := message.Payload.(map[string]interface{})
				if !ok {
					continue
				}
				optionIndex, ok := payload["optionIndex"].(float64)
				if !ok {
					continue
				}
				name, ok := payload["name"].(string)
				if !ok {
					continue
				}

				// In a real app, you would have a more secure way of identifying the user
				participant, ok := h.participants[name]
				if !ok {
					continue
				}

				h.calculateScore(participant, int(optionIndex))

			case "next_question":
				h.currentQuestion++
				if h.currentQuestion >= len(h.quiz.Questions) {
					h.gameState = "finished"
					h.broadcastLeaderboard() // Final leaderboard
					// Send quiz_end message
					h.broadcastQuizEnd()
				} else {
					h.gameState = "question"
					h.broadcastQuestion()
					h.startQuestionTimer()
				}
			}
		}
	}
}

func (h *Hub) startQuestionTimer() {
	if h.questionTimer != nil {
		h.questionTimer.Stop()
	}

	duration := 30 * time.Second // 30 seconds per question
	h.questionTimer = time.NewTimer(duration)
	h.questionStartTime = time.Now()

	// Broadcast timer updates every second
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				elapsed := time.Since(h.questionStartTime).Seconds()
				remaining := int(30 - elapsed)
				if remaining < 0 {
					remaining = 0
				}

				// Broadcast timer update
				message := Message{Type: "timer", Payload: remaining}
				messageBytes, _ := json.Marshal(message)
				for client := range h.clients {
					select {
					case client.send <- messageBytes:
					default:
						// Skip if send buffer is full
					}
				}

				if remaining <= 0 {
					return
				}
			case <-h.questionTimer.C:
				return
			}
		}
	}()

	go func() {
		<-h.questionTimer.C
		h.gameState = "leaderboard"
		h.broadcastLeaderboard()
	}()
}

func (h *Hub) calculateScore(participant *Participant, optionIndex int) {
	if h.gameState != "question" {
		return
	}
	question := h.quiz.Questions[h.currentQuestion]
	if optionIndex >= 0 && optionIndex < len(question.Options) {
		if question.Options[optionIndex].IsCorrect {
			// Time-based scoring: Max 1000 points, reduces by 100 points every second
			elapsed := time.Since(h.questionStartTime).Seconds()
			score := 1000 - (int(elapsed) * 100)
			if score < 100 {
				score = 100
			}
			participant.Score += score
		}
	}
}

func (h *Hub) broadcastQuestion() {
	question := h.quiz.Questions[h.currentQuestion]
	// Don't send the correct answer to the participants
	questionForParticipants := quiz.Question{
		ID:      question.ID,
		Text:    question.Text,
		Options: make([]quiz.Option, len(question.Options)),
	}
	for i, o := range question.Options {
		questionForParticipants.Options[i] = quiz.Option{ID: o.ID, Text: o.Text}
	}

	message := Message{Type: "question", Payload: questionForParticipants}
	messageBytes, _ := json.Marshal(message)
	for client := range h.clients {
		client.send <- messageBytes
	}
}

func (h *Hub) broadcastLeaderboard() {
	// Create a slice of participants to be able to sort it
	pSlice := make([]*Participant, 0, len(h.participants))
	for _, p := range h.participants {
		pSlice = append(pSlice, p)
	}
	// Sort participants by score
	// ... (sorting logic)

	message := Message{Type: "leaderboard", Payload: pSlice}
	messageBytes, _ := json.Marshal(message)
	for client := range h.clients {
		client.send <- messageBytes
	}
}

func (h *Hub) broadcastParticipants() {
	pSlice := make([]*Participant, 0, len(h.participants))
	for _, p := range h.participants {
		pSlice = append(pSlice, p)
	}

	message := Message{Type: "participants", Payload: pSlice}
	messageBytes, _ := json.Marshal(message)
	for client := range h.clients {
		client.send <- messageBytes
	}
}

func (h *Hub) broadcastQuizEnd() {
	// Create final leaderboard
	pSlice := make([]*Participant, 0, len(h.participants))
	for _, p := range h.participants {
		pSlice = append(pSlice, p)
	}

	message := Message{Type: "quiz_end", Payload: pSlice}
	messageBytes, _ := json.Marshal(message)
	for client := range h.clients {
		client.send <- messageBytes
	}
}
