# AI Chat App 3.0

A full-stack AI-powered application with chat, sentiment analysis, PDF comparison, and PDF summarization features.

[Watch the video](https://youtu.be/Qq-9U8CyQbA)

## Features

- 💬 **AI Chat** - Chat with Gemini AI
- 📊 **Sentiment Analysis** - Analyze text sentiment with polarity and subjectivity metrics
- 📄 **Compare PDFs** - Compare multiple PDF documents side by side
- 📝 **Summarize PDF** - Get concise summaries of PDF documents

## Setup Instructions

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ and npm (for frontend)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd be
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `be` directory:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   PORT=10000
   ENVIRONMENT=development
   ```

5. (Optional) Download NLTK data for TextBlob (sentiment analysis):
   ```bash
   python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
   ```

6. Run the backend server:
   ```bash
   python app.py
   ```

   The backend will run on `http://127.0.0.1:10000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)
3. Use the navigation menu to access different features:
   - **Home** - Overview of all features
   - **Chat** - AI chat interface
   - **FeedBack** - Sentiment analysis tool
   - **Compare PDFs** - Compare multiple PDF documents
   - **Summarize PDF** - Summarize PDF documents

## Project Structure

```
aichatapp3.0/
├── be/                 # Backend (Flask)
│   ├── app.py         # Main Flask application
│   ├── requirements.txt
│   └── .env          # Environment variables (create this)
├── fe/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   └── config.js  # Backend URL configuration
│   └── package.json
└── README.md
```

## Troubleshooting

### Backend Issues

- **"GOOGLE_API_KEY not found"**: Make sure you've created a `.env` file in the `be` directory with your API key
- **TextBlob errors**: Run the NLTK download command mentioned in the setup
- **Port already in use**: Change the `PORT` value in your `.env` file

### Frontend Issues

- **Cannot connect to backend**: Make sure the backend is running on port 10000, or update `fe/src/config.js` with the correct backend URL
- **CORS errors**: The backend has CORS enabled, but make sure it's running and accessible

## Production Deployment

For production deployment, see `RENDER_DEPLOYMENT.md` for Render.com deployment instructions.
