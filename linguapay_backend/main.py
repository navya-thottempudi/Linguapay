from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from currency import convert_currency
from language import (
    translate_text,
    text_to_speech
)
from analysis import get_currency_analysis
from weeklyanalysis import weekly_bp

app = Flask(__name__)
CORS(app)

# Register blueprint for weekly forecast/analysis
app.register_blueprint(weekly_bp)


@app.route("/run-script", methods=["POST"])
def run_script():
    data = request.json
    choice = data.get("choice")

    if choice == "translator":
        text = data.get("text")
        target_lang = data.get("target_language")
        source_lang = data.get("source_language", None)

        if not text or not target_lang:
            return jsonify({"error": "Missing text or target language"}), 400

        result = translate_text(text, dest_language=target_lang, source_language=source_lang)
        return jsonify(result)

    elif choice == "currency":
        amount = data.get("amount")
        from_currency = data.get("from_currency")
        to_currency = data.get("to_currency")

        if not amount or not from_currency or not to_currency:
            return jsonify({"error": "Missing currency details"}), 400

        result = convert_currency(amount, from_currency, to_currency)
        return jsonify(result)

    else:
        return jsonify({"error": "Invalid choice"}), 400


@app.route("/speak", methods=["POST"])
def speak():
    data = request.get_json()
    text = data.get("text")
    language = data.get("language")

    if not text or not language:
        return jsonify({"error": "Missing text or language"}), 400

    try:
        text_to_speech(text, language)
        return send_file("output.mp3", mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/analyze", methods=["POST"])
def analyze_currencies():
    try:
        data = request.get_json()
        currencies = data.get("currencies", [])
        if not currencies:
            return jsonify({"error": "No currencies provided"}), 400

        results = get_currency_analysis(currencies)
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("✅ Starting Flask server...")
    app.run(debug=True)







