# Quick Quiz App - README

A real-time multiplayer quiz application with time-based scoring, built with Go backend and React frontend.

## 🎯 Features

- **Real-time Multiplayer**: Host and join quizzes with live WebSocket updates
- **Time-based Scoring**: Faster answers get more points (max 1000 points, -100/second)
- **Customizable Quizzes**: Create quizzes with 2-6 options per question
- **Live Leaderboard**: See rankings update in real-time
- **Fancy End Screen**: Podium display for top 3 winners
- **User Authentication**: JWT-based login and registration
- **Profile Management**: User profile with logout functionality
- **Premium UI**: Dark theme with glassmorphism effects

## 🏗️ Tech Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gorilla Mux
- **Database**: SQLite
- **Real-time**: WebSockets
- **Auth**: JWT

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **Styling**: Custom theme with dark mode

## 🚀 Quick Start

### Prerequisites
- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn

### Local Development

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd quick-quiz-app
```

#### 2. Start the Backend
```bash
cd backend
go run cmd/server/main.go
```
Backend will run on `http://localhost:8080`

#### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5174`

#### 4. Open your browser
Navigate to `http://localhost:5174`

## 📦 Deployment

See [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) for detailed deployment instructions.

### Quick Deploy:
1. **Frontend**: Deploy to Vercel (already done!)
2. **Backend**: Deploy to Railway/Render/Fly.io
3. **Connect**: Set `VITE_API_URL` in Vercel to your backend URL

## 🎮 How to Use

### Creating a Quiz
1. Register/Login
2. Click "Create Quiz"
3. Add questions with 2-6 options each
4. Mark the correct answer
5. Save the quiz

### Hosting a Quiz
1. Go to "Host Quiz"
2. Select your quiz
3. Share the quiz code with participants
4. Click "Start Quiz" when ready
5. Click "Next Question" to progress

### Joining a Quiz
1. Click "Join Quiz"
2. Enter the quiz code
3. Enter your name
4. Wait for the host to start

### Playing
1. Answer questions as fast as possible
2. Faster answers = more points
3. View leaderboard after each question
4. See final rankings on the podium screen

## 📁 Project Structure

```
quick-quiz-app/
├── backend/
│   ├── cmd/server/          # Main application entry point
│   ├── internal/
│   │   ├── auth/           # Authentication handlers
│   │   ├── db/             # Database setup
│   │   ├── quiz/           # Quiz management
│   │   └── realtime/       # WebSocket hub
│   ├── railway.toml        # Railway deployment config
│   ├── render.yaml         # Render deployment config
│   └── fly.toml           # Fly.io deployment config
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── theme.ts        # MUI theme configuration
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── DEPLOYMENT_COMPLETE.md  # Deployment guide
└── README.md              # This file
```

## 🔧 Environment Variables

See [.env.example](./.env.example) for all required environment variables.

### Backend
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 8080)
- `DATABASE_PATH`: Path to SQLite database

### Frontend
- `VITE_API_URL`: Backend API URL

## 🧪 Testing

### Backend
```bash
cd backend
go test ./...
```

### Frontend
```bash
cd frontend
npm run build  # Test build
```

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Quizzes
- `GET /api/quizzes` - Get all quizzes (requires auth)
- `POST /api/quizzes` - Create quiz (requires auth)
- `GET /api/quizzes/:id` - Get quiz by ID

### WebSocket
- `WS /ws/quiz/:id/join` - Join quiz room

## 🎨 UI Features

- **Dark Theme**: Premium dark mode with violet/emerald gradient
- **Glassmorphism**: Frosted glass effects on cards
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Works on desktop, tablet, and mobile
- **Notifications**: Toast notifications for user feedback
- **Timer**: Live countdown timer during questions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)
2. Check browser console for errors
3. Check backend logs
4. Open an issue on GitHub

## 🎉 Acknowledgments

Built with modern web technologies and best practices for real-time applications.

---

**Happy Quizzing! 🎯**
