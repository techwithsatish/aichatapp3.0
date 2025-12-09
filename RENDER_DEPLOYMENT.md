# Deploying AI Chat App 3.0 to Render

This guide covers deploying both the backend (Flask) and frontend (React/Vite) to Render.

## Prerequisites

1. GitHub account with your repo pushed
2. Render account (free or paid) at https://render.com
3. Your environment variables ready

## Backend Deployment (Flask)

### Step 1: Create `build.sh` in the `be/` folder

Create a file at `be/build.sh`:

```bash
#!/bin/bash
pip install -r requirements.txt
```

### Step 2: Create Render Service for Backend

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aichatapp-backend` (or your choice)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:10000 be.app:app`
   - **Branch**: `main`
5. In **Environment Variables**, add:
   - `GOOGLE_API_KEY`: Your Google API key
   - `PYTHON_VERSION`: `3.10.0`
6. Click **"Create Web Service"**

### Step 3: Add Gunicorn to Backend

Update `be/requirements.txt` to include:

```
gunicorn==21.2.0
```

### Step 4: Update Backend for Production

Edit `be/app.py` and ensure it listens on the correct port:

```python
if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)
```

---

## Frontend Deployment (React/Vite)

### Step 1: Update Frontend Config

Edit `fe/src/config.js`:

```javascript
const isDevelopment = window.location.hostname === 'localhost';
export const BACKEND_URL = isDevelopment 
  ? "http://127.0.0.1:8000" 
  : "https://YOUR_BACKEND_URL.onrender.com"; // Replace with your backend URL
```

### Step 2: Create Static Server Configuration

Create `fe/render.yaml`:

```yaml
builds:
  - type: static
    src: dist
    routes:
      - path: "/*"
        dest: index.html
```

### Step 3: Create Render Service for Frontend

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aichatapp-frontend` (or your choice)
   - **Build Command**: `cd fe && npm install && npm run build`
   - **Publish Directory**: `fe/dist`
   - **Branch**: `main`
5. Click **"Create Static Site"**

---

## Repository Structure for Render

Your GitHub repo should have this structure:

```
aichatapp3.0/
├── be/
│   ├── app.py
│   ├── requirements.txt
│   ├── build.sh          ← Create this
│   └── ...
├── fe/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── render.yaml       ← Optional (for static hosting)
│   └── ...
├── README.md
└── .gitignore
```

---

## Update CORS in Backend

Make sure your `be/app.py` has proper CORS configuration:

```python
from flask_cors import CORS

CORS(app, resources={
    r"/*": {
        "origins": ["https://YOUR_FRONTEND_URL.onrender.com", "http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## Final Configuration

### Backend URL in Frontend

Once your backend is deployed, update `fe/src/config.js`:

```javascript
export const BACKEND_URL = "https://your-backend-name.onrender.com";
```

Then rebuild and redeploy the frontend.

### Environment Variables

**Backend (.env or Render)**:
- `GOOGLE_API_KEY`: Your Google Generative AI key

**Frontend**: No environment variables needed (frontend is static)

---

## Troubleshooting

### Backend Issues
- Check logs: Dashboard → Your Service → Logs
- Verify `PORT` environment variable is set
- Ensure CORS allows your frontend URL
- Check API keys are set correctly

### Frontend Issues
- Clear browser cache
- Verify `BACKEND_URL` in config.js points to correct backend
- Check browser console for API errors
- Rebuild if config changed: `npm run build`

### CORS Errors
Update backend CORS to include your Render frontend URL

---

## Useful Render Links

- Dashboard: https://render.com/dashboard
- Docs: https://docs.render.com
- Flask Guide: https://docs.render.com/deploy-flask

## Next Steps

1. Push all changes to GitHub
2. Create backend service on Render
3. Copy backend URL
4. Update frontend config with backend URL
5. Create frontend service on Render
6. Test the deployed app
