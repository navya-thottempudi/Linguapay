import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Select from "react-select";
import { fadeOutHomeSound, resumeHomeSound } from './App';

const languageOptions =[
  { value: "af", label: "Afrikaans" },
  { value: "sq", label: "Albanian" },
  { value: "am", label: "Amharic" },
  { value: "ar", label: "Arabic" },
  { value: "hy", label: "Armenian" },
  { value: "az", label: "Azerbaijani" },
  { value: "eu", label: "Basque" },
  { value: "be", label: "Belarusian" },
  { value: "bn", label: "Bengali" },
  { value: "bs", label: "Bosnian" },
  { value: "bg", label: "Bulgarian" },
  { value: "ca", label: "Catalan" },
  { value: "ceb", label: "Cebuano" },
  { value: "zh", label: "Chinese" },
  { value: "co", label: "Corsican" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "en", label: "English" },
  { value: "eo", label: "Esperanto" },
  { value: "et", label: "Estonian" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "fy", label: "Frisian" },
  { value: "gl", label: "Galician" },
  { value: "ka", label: "Georgian" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "gu", label: "Gujarati" },
  { value: "ht", label: "Haitian Creole" },
  { value: "ha", label: "Hausa" },
  { value: "haw", label: "Hawaiian" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hmn", label: "Hmong" },
  { value: "hu", label: "Hungarian" },
  { value: "is", label: "Icelandic" },
  { value: "ig", label: "Igbo" },
  { value: "id", label: "Indonesian" },
  { value: "ga", label: "Irish" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "jw", label: "Javanese" },
  { value: "kn", label: "Kannada" },
  { value: "kk", label: "Kazakh" },
  { value: "km", label: "Khmer" },
  { value: "ko", label: "Korean" },
  { value: "ku", label: "Kurdish" },
  { value: "ky", label: "Kyrgyz" },
  { value: "lo", label: "Lao" },
  { value: "la", label: "Latin" },
  { value: "lv", label: "Latvian" },
  { value: "lt", label: "Lithuanian" },
  { value: "lb", label: "Luxembourgish" },
  { value: "mk", label: "Macedonian" },
  { value: "mg", label: "Malagasy" },
  { value: "ms", label: "Malay" },
  { value: "ml", label: "Malayalam" },
  { value: "mt", label: "Maltese" },
  { value: "mi", label: "Maori" },
  { value: "mr", label: "Marathi" },
  { value: "mn", label: "Mongolian" },
  { value: "my", label: "Myanmar (Burmese)" },
  { value: "ne", label: "Nepali" },
  { value: "no", label: "Norwegian" },
  { value: "ny", label: "Nyanja (Chichewa)" },
  { value: "ps", label: "Pashto" },
  { value: "fa", label: "Persian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "pa", label: "Punjabi" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sm", label: "Samoan" },
  { value: "gd", label: "Scots Gaelic" },
  { value: "sr", label: "Serbian" },
  { value: "st", label: "Sesotho" },
  { value: "sn", label: "Shona" },
  { value: "sd", label: "Sindhi" },
  { value: "si", label: "Sinhala" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "so", label: "Somali" },
  { value: "es", label: "Spanish" },
  { value: "su", label: "Sundanese" },
  { value: "sw", label: "Swahili" },
  { value: "sv", label: "Swedish" },
  { value: "tl", label: "Tagalog (Filipino)" },
  { value: "tg", label: "Tajik" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "th", label: "Thai" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "uz", label: "Uzbek" },
  { value: "vi", label: "Vietnamese" },
  { value: "cy", label: "Welsh" },
  { value: "xh", label: "Xhosa" },
  { value: "yi", label: "Yiddish" },
  { value: "yo", label: "Yoruba" },
  { value: "zu", label: "Zulu" }
];


const modeOptions = [
  { value: "voice", label: "🎙 Voice Narration" },
  { value: "tooltip", label: "💬 Tooltip Summary" },
];

const WeeklyAnalysis = () => {
  const location = useLocation();
  const currencies = location.state?.currencies || [];

  const [chartData, setChartData] = useState([]);
  const [summaryText, setSummaryText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [mode, setMode] = useState("tooltip");

  useEffect(() => {
    const fetchWeeklyRates = async () => {
      try {
        const res = await fetch("http://localhost:5000/weekly-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currencies }),
        });

        const result = await res.json();
        const rates = result.data || {};

        const formatted = Object.entries(rates).map(([date, rateObj]) => ({
          date,
          ...rateObj,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching weekly analysis:", err);
      }
    };

    fetchWeeklyRates();
  }, [currencies]);

  const translateText = async (text) => {
    try {
      const res = await fetch("http://localhost:5000/run-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          choice: "translator",
          text,
          target_language: selectedLanguage,
        }),
      });

      const data = await res.json();
      return data.translated || text;
    } catch (error) {
      console.error("Translation failed:", error);
      return text;
    }
  };

    const handleNarrate = async () => {
  const summary = `This chart shows the weekly performance of selected currencies. 
  It visualizes how exchange rates against EUR changed each day this week.`;

  const translated = await translateText(summary);

  if (mode === "voice") {
    fadeOutHomeSound(); // 🔇 Fade out background music

    const response = await fetch("http://localhost:5000/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: translated,
        language: selectedLanguage,
      }),
    });

    const blob = await response.blob();
    const audioURL = window.URL.createObjectURL(blob);
    const audio = new Audio(audioURL);

    audio.play();

    // 🔊 Resume background music 10 seconds later (or after audio ends)
    audio.onended = () => {
      resumeHomeSound(); // ⏳ Fade back in
    };
  } else {
    setSummaryText(translated);
  }
};

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Weekly Currency Forecast 📈
      </h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Select
          options={modeOptions}
          defaultValue={modeOptions[1]}
          onChange={(e) => setMode(e.value)}
          placeholder="Choose Summary Mode"
          styles={{ container: (base) => ({ ...base, width: 200 }) }}
        />
        <Select
          options={languageOptions}
          defaultValue={languageOptions[0]}
          onChange={(e) => setSelectedLanguage(e.value)}
          placeholder="Choose Language"
          styles={{ container: (base) => ({ ...base, width: 200 }) }}
        />
        <button
          onClick={handleNarrate}
          style={{
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔊 Narrate Weekly Summary
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value, name) => [`${value.toFixed(4)}`, `${name} Rate`]}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Legend />
          {Object.keys(chartData[0] || {})
            .filter((key) => key !== "date")
            .map((currency) => (
              <Line
                key={currency}
                type="monotone"
                dataKey={currency}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>

      {mode === "tooltip" && summaryText && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px 20px",
            backgroundColor: "#fdf7f3",
            borderLeft: "5px solid #ffa726",
            borderRadius: "6px",
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#444",
          }}
        >
          <strong>📝 Weekly Summary:</strong><br />
          {summaryText}
        </div>
      )}
    </div>
  );
};

export default WeeklyAnalysis;
