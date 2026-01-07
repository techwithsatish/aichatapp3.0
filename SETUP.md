# Quick Setup Guide

## Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd be
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file:**
   Create a file named `.env` in the `be` directory with:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=10000
   ENVIRONMENT=development
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

4. **Start the backend:**
   ```bash
   python app.py
   ```
   
   You should see: `🚀 Server running at http://0.0.0.0:10000`

## Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd fe
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:5173` (or another port)

## Step 3: Use the App

1. Open your browser to the frontend URL
2. Navigate through the features using the top menu
3. Make sure the backend is running for all features to work

## Troubleshooting

- **Backend won't start**: Check that you have a `.env` file with `GOOGLE_API_KEY`
- **Frontend can't connect**: Make sure backend is running on port 10000
- **TextBlob errors**: Run `python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"` in the backend directory
