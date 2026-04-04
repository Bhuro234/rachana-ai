from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests as req
import base64
import os
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)
CORS(app)

# --- CONFIGURATION ---
FLUX2_KEY = os.environ.get("FLUX2_KEY", "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")
FLUX2_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"

MAPPING_SUFFIX = (
    ",a image for full view,the slightly side-upper view to get more view of house,it shoud be more on user prompt"
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_input = data.get("prompt", "").strip()
    style = data.get("style", "").strip()
    lighting = data.get("lighting", "").strip()

    if not user_input:
        return jsonify({"error": "Please enter a description."}), 400

    full_prompt = f"{user_input}{style}{lighting}{MAPPING_SUFFIX}"
    if len(full_prompt) > 800:
        full_prompt = full_prompt[:797] + "..."

    headers = {
        "Authorization": f"Bearer {FLUX2_KEY}",
        "Accept": "application/json",
    }

    payload = {
        "prompt": full_prompt,
        "width": 1024,
        "height": 1024,
        "seed": random.randint(1, 1000000),
    }

    try:
        response = req.post(FLUX2_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            img_data = response.json()["artifacts"][0]["base64"]
            return jsonify({"image": img_data})
        else:
            return jsonify({"error": f"API Error {response.status_code}: {response.text}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
