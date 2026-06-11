import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fadeOutHomeSound , resumeHomeSound } from './App';

const languages = {
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  zh: "Chinese",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  he: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  pa: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu"
};

function LanguageConverter() {
  const [text, setText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('');
  const [translated, setTranslated] = useState('');

  const handleTranslate = async () => {
    if (!text || !toLanguage) {
      alert("Please enter text and select a language.");
      return;
    }

    const res = await fetch('http://localhost:5000/run-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice: 'translator', text, target_language: toLanguage }),
    });

    const data = await res.json();
    setTranslated(data.translated || 'Translation failed');

  };

 const handleSpeak = async () => {
   if (!translated || !toLanguage) return;

   fadeOutHomeSound(); // 🔇

   const res = await fetch('http://localhost:5000/speak', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ text: translated, language: toLanguage }),
    });

   const blob = await res.blob();
   const audioURL = URL.createObjectURL(blob);
   const audio = new Audio(audioURL);
   audio.play();

   resumeHomeSound(); // 🔊
};


  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{
        maxWidth: '500px', background: '#fff', margin: 'auto',
        padding: '30px 40px', borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '20px' }}>
          Linguapay - Language Converter
        </h2>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{ ...buttonStyle, marginBottom: '20px' }}>
            ⬅ Back to Home
          </button>
        </Link>

        <label style={labelStyle}>Text:</label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          style={inputStyle}
          placeholder="Enter text"
        />

        <label style={labelStyle}>From Language:</label>
        <select value={fromLanguage} onChange={e => setFromLanguage(e.target.value)} style={inputStyle}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name} ({code.toUpperCase()})</option>
          ))}
        </select>

        <label style={labelStyle}>To Language:</label>
        <select value={toLanguage} onChange={e => setToLanguage(e.target.value)} style={inputStyle}>
          <option value="">Select</option>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name} ({code.toUpperCase()})</option>
          ))}
        </select>

        <button onClick={handleTranslate} style={{ ...buttonStyle, marginTop: '20px' }}>
          Translate
        </button>

        {translated && (
          <div style={{ marginTop: '30px' }}>
            <strong>Translated Text:</strong>
            <p style={{ marginTop: '10px', fontSize: '16px' }}>{translated}</p>
            <button onClick={handleSpeak} style={buttonStyle}>🔈 Speak Output</button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '20px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '15px'
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  backgroundColor: '#8888ff',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default LanguageConverter;
