package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./quiz.db")
	if err != nil {
		log.Fatal(err)
	}

	createTables()
}

func createTables() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`

	createQuizzesTable := `
	CREATE TABLE IF NOT EXISTS quizzes (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		created_by TEXT NOT NULL,
		FOREIGN KEY (created_by) REFERENCES users(id)
	);`

	createQuestionsTable := `
	CREATE TABLE IF NOT EXISTS questions (
		id TEXT PRIMARY KEY,
		quiz_id TEXT NOT NULL,
		text TEXT NOT NULL,
		FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
	);`

	createOptionsTable := `
	CREATE TABLE IF NOT EXISTS options (
		id TEXT PRIMARY KEY,
		question_id TEXT NOT NULL,
		text TEXT NOT NULL,
		is_correct BOOLEAN NOT NULL,
		FOREIGN KEY (question_id) REFERENCES questions(id)
	);`

	_, err := DB.Exec(createUsersTable)
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec(createQuizzesTable)
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec(createQuestionsTable)
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec(createOptionsTable)
	if err != nil {
		log.Fatal(err)
	}
}
