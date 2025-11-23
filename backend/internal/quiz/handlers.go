package quiz

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"quick-quiz-app/backend/internal/db"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func GetQuizzesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, title, created_by FROM quizzes")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	quizzes := []Quiz{}
	for rows.Next() {
		var q Quiz
		if err := rows.Scan(&q.ID, &q.Title, &q.CreatedBy); err != nil {
			continue
		}
		// We could fetch questions here, but for list view maybe just title is enough?
		// The current struct has Questions []Question. Let's leave it empty for list view or fetch them if needed.
		// For now, returning quizzes without questions for the list to keep it light.
		quizzes = append(quizzes, q)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quizzes)
}

func GetQuiz(quizID string) (*Quiz, error) {
	var q Quiz
	err := db.DB.QueryRow("SELECT id, title, created_by FROM quizzes WHERE id = ?", quizID).Scan(&q.ID, &q.Title, &q.CreatedBy)
	if err != nil {
		return nil, err
	}

	// Fetch questions
	rows, err := db.DB.Query("SELECT id, text FROM questions WHERE quiz_id = ?", quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var question Question
		if err := rows.Scan(&question.ID, &question.Text); err != nil {
			continue
		}

		// Fetch options for each question
		optRows, err := db.DB.Query("SELECT id, text, is_correct FROM options WHERE question_id = ?", question.ID)
		if err != nil {
			continue
		}
		defer optRows.Close()

		for optRows.Next() {
			var opt Option
			if err := optRows.Scan(&opt.ID, &opt.Text, &opt.IsCorrect); err != nil {
				continue
			}
			question.Options = append(question.Options, opt)
		}
		q.Questions = append(q.Questions, question)
	}
	return &q, nil
}

func GetQuizHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	quizID := vars["id"]

	q, err := GetQuiz(quizID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Quiz not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(q)
}

func CreateQuizHandler(w http.ResponseWriter, r *http.Request) {
	var newQuiz Quiz
	err := json.NewDecoder(r.Body).Decode(&newQuiz)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validation
	if len(newQuiz.Questions) == 0 {
		http.Error(w, "Quiz must have at least one question", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID")
	if userID == nil {
		// Should be handled by middleware, but just in case
		// For now, if no user ID, we can allow anonymous or error out.
		// Let's error out as per requirements "Users should be able to register/login... Once logged in, users should be able to create quizzes"
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	newQuiz.CreatedBy = userID.(string)
	newQuiz.ID = uuid.New().String()

	tx, err := db.DB.Begin()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec("INSERT INTO quizzes (id, title, created_by) VALUES (?, ?, ?)", newQuiz.ID, newQuiz.Title, newQuiz.CreatedBy)
	if err != nil {
		tx.Rollback()
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	for _, q := range newQuiz.Questions {
		q.ID = uuid.New().String()
		_, err = tx.Exec("INSERT INTO questions (id, quiz_id, text) VALUES (?, ?, ?)", q.ID, newQuiz.ID, q.Text)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		for _, o := range q.Options {
			o.ID = uuid.New().String()
			_, err = tx.Exec("INSERT INTO options (id, question_id, text, is_correct) VALUES (?, ?, ?, ?)", o.ID, q.ID, o.Text, o.IsCorrect)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}
		}
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newQuiz)
}
