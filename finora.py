from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key="AIzaSyC58IDYtHkjm4IQTJcZksrq-ZrbnfzjvDY")

# Text Chatbot Route
@app.route("/text", methods=["POST"])
def text_chat():
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"response": "Please provide a message."}), 400

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_input)

    # Ensure the response is properly extracted
    if response and response.candidates:
        bot_reply = response.candidates[0].content.parts[0].text if hasattr(response.candidates[0].content, "parts") else str(response.candidates[0].content)
    else:
        bot_reply = "I'm sorry, I couldn't process that."
   
    print(bot_reply)
    return jsonify({"response": bot_reply})



# Run server
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)