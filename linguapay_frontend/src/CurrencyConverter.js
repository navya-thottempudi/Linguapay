import React, { useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const currencies = [
  'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP',
  'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN', 'MYR',
  'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR'
];

const currencyCountries = {
  AUD: "Australia", BRL: "Brazil", CAD: "Canada",
  CHF: "Switzerland", CNY: "China", CZK: "Czech Republic", DKK: "Denmark",
  EUR: "Eurozone", GBP: "United Kingdom", HKD: "Hong Kong", HUF: "Hungary",
  IDR: "Indonesia", ILS: "Israel", INR: "India", ISK: "Iceland",
  JPY: "Japan", KRW: "South Korea", MXN: "Mexico", MYR: "Malaysia",
  NOK: "Norway", NZD: "New Zealand", PHP: "Philippines", PLN: "Poland",
  RON: "Romania", SEK: "Sweden", SGD: "Singapore", THB: "Thailand",
  TRY: "Turkey", USD: "United States", ZAR: "South Africa"
};

const countryCodes = {
  AUD: "au", BRL: "br", CAD: "ca", CHF: "ch", CNY: "cn",
  CZK: "cz", DKK: "dk", EUR: "eu", GBP: "gb", HKD: "hk", HUF: "hu",
  IDR: "id", ILS: "il", INR: "in", ISK: "is", JPY: "jp", KRW: "kr",
  MXN: "mx", MYR: "my", NOK: "no", NZD: "nz", PHP: "ph", PLN: "pl",
  RON: "ro", SEK: "se", SGD: "sg", THB: "th", TRY: "tr", USD: "us", ZAR: "za"
};

function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [converted, setConverted] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const navigate = useNavigate();

  const handleConvert = async () => {
    const res = await fetch('https://linguapay.onrender.com/run-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        choice: 'currency',
        amount: parseFloat(amount),
        from_currency: fromCurrency,
        to_currency: toCurrency,
      }),
    });

    const data = await res.json();
    setConverted(data.result || data.error || 'Conversion failed');
  };

  const handleAnalyze = () => {
    if (selectedCountries.length === 0) return;
    navigate('/analysis', { state: { currencies: selectedCountries } });
  };

  const options = currencies.map(code => ({
    value: code,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={`https://flagcdn.com/w20/${countryCodes[code]}.png`}
          alt={code}
          style={{ marginRight: '8px' }}
        />
        {currencyCountries[code]} ({code})
      </div>
    )
  }));

  return (
    <div style={{
      maxWidth: '500px',
      margin: 'auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Currency Converter</h2>
       <Link to="/" style={{ textDecoration: 'none' }}>
  <button
    style={{
      marginBottom: '20px',
      padding: '10px 20px',
      borderRadius: '6px',
      backgroundColor: '#8888ff',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
       }}
       >
     ⬅ Back to Home
     </button>
           </Link>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      <select
        value={fromCurrency}
        onChange={e => setFromCurrency(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px' }}
      >
        <option value="">Select From Currency</option>
        {currencies.map(code => (
          <option key={code} value={code}>
            {currencyCountries[code]} ({code})
          </option>
        ))}
      </select>

      <select
        value={toCurrency}
        onChange={e => setToCurrency(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}
      >
        <option value="">Select To Currency</option>
        {currencies.map(code => (
          <option key={code} value={code}>
            {currencyCountries[code]} ({code})
          </option>
        ))}
      </select>

      <button
        onClick={handleConvert}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#ff8888',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Convert
      </button>

      {converted && (
        <p style={{
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          Converted Amount: {fromCurrency} = {converted} {toCurrency}
        </p>
      )}

      <h3 style={{ marginBottom: '10px' }}>Analyze Currencies</h3>

      <Select
        isMulti
        options={options}
        onChange={(selected) => setSelectedCountries(selected.map(opt => opt.value))}
        placeholder="Select currencies for analysis"
        styles={{ container: base => ({ ...base, marginBottom: '20px' }) }}
      />

      <button
        onClick={handleAnalyze}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#8888ff',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Analyze Selected
      </button>
    </div>
  );
}

export default CurrencyConverter;







