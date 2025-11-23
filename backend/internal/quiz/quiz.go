package quiz

type Option struct {
	ID    string `json:"id"`
	Text  string `json:"text"`
	IsCorrect bool `json:"isCorrect"`
}

type Question struct {
	ID      string   `json:"id"`
	Text    string   `json:"text"`
	Options []Option `json:"options"`
}

type Quiz struct {
	ID        string     `json:"id"`
	Title     string     `json:"title"`
	Questions []Question `json:"questions"`
	CreatedBy string     `json:"createdBy"` // User ID
}
