# URL Analyzer with GROQ AI Chat

A powerful web application that allows users to analyze any website URL and chat with GROQ AI about its content.

## Features

- **URL Analysis**: Extract metadata, headings, and content from any URL
- **AI Chat**: Ask questions about website content using GROQ Claude 3.7 Sonnet model
- **User Authentication**: Create an account to save and manage your analyzed URLs
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with React, Tailwind CSS, and GSAP animations

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- GSAP for animations
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Cheerio for web scraping
- Integration with GROQ AI API

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB setup)
- GROQ API key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd url-analyzer
   ```

2. Install all dependencies (backend and frontend):
   ```
   npm run install-all
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://ayushsinghgaur2100:ayush@cluster0.uifkvuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=url_analyzer_secret_key
   GROQ_API_KEY=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
   ```

### Running the Application

1. Start both backend and frontend concurrently:
   ```
   npm run dev
   ```

2. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### URLs
- `POST /api/urls/analyze` - Analyze a new URL
- `GET /api/urls/:urlId` - Get URL by ID
- `GET /api/urls` - Get user's URLs (protected)
- `GET /api/urls/search` - Search URLs

### Chat
- `POST /api/chat/ask` - Ask a question about a URL (protected)
- `GET /api/chat/history/:urlId` - Get chat history for a URL (protected)

## License

MIT License

## Acknowledgements

- [GROQ](https://console.groq.com/) - For providing the AI API
- [React](https://reactjs.org/) - Frontend library
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [GSAP](https://greensock.com/gsap/) - Animation library 