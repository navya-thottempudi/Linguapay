import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function CurrencyAnalysis() {
  const location = useLocation();

  const selectedCurrencies = location.state?.currencies || [];

  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCurrencies.length === 0) return;

      try {
        console.log("Fetching analysis for currencies:", selectedCurrencies);  

        const res = await fetch('https://linguapay.onrender.com/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currencies: selectedCurrencies }),
        });

        const data = await res.json();
        setComparisonData(data.results || []);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      }
    };

    fetchData();
  }, [selectedCurrencies]);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Currency Comparison
      </h2>

      <Link to="/currency">
        <button
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            borderRadius: '6px',
            backgroundColor: '#ff8888',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ⬅ Back to Converter
        </button>
      </Link>

      {comparisonData.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {comparisonData.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={`https://flagcdn.com/w80/${item.flag}.png`}
                alt={item.country}
                style={{ width: '50px', height: 'auto', marginBottom: '10px' }}
              />
              <h3 style={{ marginBottom: '8px' }}>{item.country}</h3>
              <p style={{ margin: '5px 0' }}>
                <strong>{item.currency}</strong>
              </p>
              <p style={{ color: '#333' }}>Rate vs EUR: <strong>{item.rate}</strong></p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'gray' }}>
          No data available for selected currencies.
        </p>
      )}

      <Link to="/weekly" state={{ currencies: comparisonData.map(item => item.currency) }}>
  <button
    style={{
    marginTop: '30px',
    padding: '12px',
    backgroundColor: '#66bb6a',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
     }}
   >
    📊 Weekly Analysis
    </button>
    </Link>

    </div>
  );
}

export default CurrencyAnalysis;


