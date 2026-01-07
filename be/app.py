from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import io
import httpx
import time
from textblob import TextBlob

from flask import Flask, request, Response, jsonify, stream_with_context

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Print all available models
import sys
if sys.stdout.encoding and 'utf' in sys.stdout.encoding.lower():
    print("🔍 Available Models:")
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f"  ✅ {m.name}")
else:
    print("Available Models:")
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f"  [OK] {m.name}")

model = genai.GenerativeModel(model_name="gemini-2.5-flash")

@app.route("/compare-pdfs", methods=["POST"])
def compare_pdfs():
    files = []

    # 1️⃣ If JSON with URLs
    if request.is_json:
        data = request.get_json()
        pdf_urls = data.get("pdf_urls", [])

        if len(pdf_urls) < 2:
            return jsonify({"error": "Provide at least 2 PDF URLs"}), 400

        # Download and upload synchronously
        for url in pdf_urls:
            resp = httpx.get(url, timeout=60.0)
            pdf_data = io.BytesIO(resp.content)
            uploaded = genai.upload_file(pdf_data, mime_type="application/pdf")
            files.append(uploaded)

    # 2️⃣ If local files uploaded
    elif "files" in request.files:
        uploaded_files = request.files.getlist("files")
        if len(uploaded_files) < 2:
            return jsonify({"error": "Upload at least 2 PDF files"}), 400

        for f in uploaded_files:
            pdf_data = io.BytesIO(f.read())
            uploaded = genai.upload_file(pdf_data, mime_type="application/pdf")
            files.append(uploaded)

    else:
        return jsonify({"error": "Provide PDF URLs in JSON or upload files"}), 400

    # 3️⃣ Prompt Gemini to compare PDFs
    prompt = (
        "Compare the key findings and benchmarks of these papers. "
        "Provide results in a table."
    )

    compare_model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    response = compare_model.generate_content(
        contents=files + [prompt]
    )

    return jsonify({"result": response.text})




@app.route("/", methods=["GET"])
def home():
    return "Flask Gemini API is running! Available endpoints: /chat, /stream, /compare-pdfs, /summarize-pdf"

@app.route("/stream", methods=["POST"])
def stream():
    data = request.json
    message = data.get("chat", "Hello")

    def generate():
        for word in message.split():
            yield f"data: {word} \n\n"
            time.sleep(0.5)  # simulate typing

    return Response(stream_with_context(generate()), mimetype="text/event-stream")


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('chat', '')
    chat_history = data.get('history', [])
    chat_session = model.start_chat(history=chat_history)
    response = chat_session.send_message(msg)
    return jsonify({"text": response.text})

@app.route("/summarize-pdf", methods=["POST"])
def summarize_pdf():
    """
    Summarize one or more PDFs.
    Accepts:
      1. JSON with "pdf_urls": ["url1", "url2"]
      2. Local PDF uploads via multipart/form-data with key "files"
    Returns:
      JSON with AI-generated summary.
    """
    files = []

    # 1️⃣ If JSON with URLs
    if request.is_json:
        data = request.get_json()
        pdf_urls = data.get("pdf_urls", [])
        if not pdf_urls:
            return jsonify({"error": "Provide at least 1 PDF URL"}), 400

        for url in pdf_urls:
            resp = httpx.get(url, timeout=60.0)
            pdf_data = io.BytesIO(resp.content)
            uploaded = genai.upload_file(pdf_data, mime_type="application/pdf")
            files.append(uploaded)

    # 2️⃣ If local files uploaded
    elif "files" in request.files:
        uploaded_files = request.files.getlist("files")
        if not uploaded_files:
            return jsonify({"error": "Upload at least 1 PDF file"}), 400

        for f in uploaded_files:
            pdf_data = io.BytesIO(f.read())
            uploaded = genai.upload_file(pdf_data, mime_type="application/pdf")
            files.append(uploaded)

    else:
        return jsonify({"error": "Provide PDF URLs in JSON or upload files"}), 400

    # 3️⃣ Prompt Gemini to summarize
    prompt = "Summarize the main findings and contributions of these papers in concise bullet points."

    summary_model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    response = summary_model.generate_content(
        contents=files + [prompt]
    )

    return jsonify({"summary": response.text})


@app.route("/sentiment", methods=["POST"])
def analyze_sentiment():
    """
    Analyze sentiment of a given text.
    Accepts JSON with "text" key.
    Returns:
      - polarity: -1 (negative) to 1 (positive)
      - subjectivity: 0 (objective) to 1 (subjective)
      - sentiment: "positive", "negative", or "neutral"
    """
    data = request.json
    text = data.get("text", "")
    
    if not text:
        return jsonify({"error": "Provide text for sentiment analysis"}), 400
    
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Classify sentiment based on polarity
    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return jsonify({
        "text": text,
        "sentiment": sentiment,
        "polarity": round(polarity, 3),
        "subjectivity": round(subjectivity, 3)
    })


if __name__ == '__main__':
    port = int(os.getenv("PORT", 10000))
    debug = os.getenv("ENVIRONMENT", "development") == "development"
    print(f"Server running at http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
