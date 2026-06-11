import requests

currency_metadata = {
        "AUD": {"country": "Australia", "flag": "au"},
    "BGN": {"country": "Bulgaria", "flag": "bg"},
    "BRL": {"country": "Brazil", "flag": "br"},
    "CAD": {"country": "Canada", "flag": "ca"},
    "CHF": {"country": "Switzerland", "flag": "ch"},
    "CNY": {"country": "China", "flag": "cn"},
    "CZK": {"country": "Czech Republic", "flag": "cz"},
    "DKK": {"country": "Denmark", "flag": "dk"},
    "EUR": {"country": "European Union", "flag": "eu"},
    "GBP": {"country": "United Kingdom", "flag": "gb"},
    "HKD": {"country": "Hong Kong", "flag": "hk"},
    "HUF": {"country": "Hungary", "flag": "hu"},
    "IDR": {"country": "Indonesia", "flag": "id"},
    "ILS": {"country": "Israel", "flag": "il"},
    "INR": {"country": "India", "flag": "in"},
    "ISK": {"country": "Iceland", "flag": "is"},
    "JPY": {"country": "Japan", "flag": "jp"},
    "KRW": {"country": "South Korea", "flag": "kr"},
    "MXN": {"country": "Mexico", "flag": "mx"},
    "MYR": {"country": "Malaysia", "flag": "my"},
    "NOK": {"country": "Norway", "flag": "no"},
    "NZD": {"country": "New Zealand", "flag": "nz"},
    "PHP": {"country": "Philippines", "flag": "ph"},
    "PLN": {"country": "Poland", "flag": "pl"},
    "RON": {"country": "Romania", "flag": "ro"},
    "SEK": {"country": "Sweden", "flag": "se"},
    "SGD": {"country": "Singapore", "flag": "sg"},
    "THB": {"country": "Thailand", "flag": "th"},
    "TRY": {"country": "Turkey", "flag": "tr"},
    "USD": {"country": "United States", "flag": "us"},
    "ZAR": {"country": "South Africa", "flag": "za"}
}

def get_currency_analysis(currencies):
    response = requests.get("https://api.frankfurter.app/latest?from=EUR")
    response.raise_for_status()

    rates = response.json().get("rates", {})
    results = []

    for curr in currencies:
        if curr in rates:
            info = currency_metadata.get(curr, {"country": curr, "flag": ""})
            results.append({
                "currency": curr,
                "rate": rates[curr],
                "country": info["country"],
                "flag": info["flag"]
            })
    return results
