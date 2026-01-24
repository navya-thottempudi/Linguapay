from flask import Blueprint, request, jsonify
import requests
from datetime import datetime, timedelta

weekly_bp = Blueprint("weekly", __name__)

@weekly_bp.route("/weekly-analysis", methods=["POST"])
def weekly_analysis():
    try:
        data = request.get_json()
        currencies = data.get("currencies", [])

        if not currencies:
            return jsonify({"error": "No currencies provided"}), 400

        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=7)

        url = f"https://api.frankfurter.app/{start_date}..{end_date}?from=EUR&to={','.join(currencies)}"
        response = requests.get(url)
        response.raise_for_status()

        rates = response.json().get("rates", {})

        # Structure the response like { "2025-06-16": { "USD": 1.08, "INR": 89.5 }, ... }
        return jsonify({ "data": rates })

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500





