import requests

def convert_currency(amount, from_currency, to_currency):
    """
    Converts currency using the Frankfurter.dev API.
    """
    if from_currency == to_currency:
        return {"result": amount}

    url = f"https://api.frankfurter.app/latest?amount={amount}&from={from_currency}&to={to_currency}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        converted_amount = data["rates"].get(to_currency)
        return {"result": round(converted_amount, 4) if converted_amount else "Conversion failed"}
    except Exception as e:
        return {"error": f"Conversion failed: {str(e)}"}

