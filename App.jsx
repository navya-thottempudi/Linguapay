// App.jsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CurrencyConverter from './CurrencyConverter';
import LanguageConverter from './LanguageConverter';
import CurrencyAnalysis from './CurrencyAnalysis';
import WeeklyAnalysis from './WeeklyAnalysis';
import './App.css';

// 🌍 Shared audio ref for external control
export const audioRef = { current: null };

// 🔉 Fade-out utility
export const fadeOutHomeSound = () => {
  const audio = audioRef.current;
  if (!audio) return;
  const interval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.pause();
      clearInterval(interval);
    }
  }, 100);
};

// 🔊 Fade-in utility
export const fadeInHomeSound = () => {
  const audio = audioRef.current;
  if (!audio) return;
  audio.volume = 0;
  audio.play().catch(() => {});
  const interval = setInterval(() => {
    if (audio.volume < 0.5) {
      audio.volume += 0.05;
    } else {
      clearInterval(interval);
    }
  }, 100);
};

// ⏱ Resume after delay
export const resumeHomeSound = (delayMs = 10000) => {
  setTimeout(() => {
    fadeInHomeSound();
  }, delayMs);
};

// 🎈 Floating icon characters
const floatingIcons = [
  "₹", "€", "$", "₩", "₽", "₺", "¥", "₪", "₦", "₫", "₱", "₭", "₴", "₲", "₡",
  "₵", "₳", "ƒ", "文", "अ", "円", "ك", "א", "क", "Я", "Б", "ר", "ກ", "ב", "ச",
  "한", "ж", "ཨ", "ሀ", "ม", "ส"
];

// 🏠 Home Page Layout
function Home() {
  return (
    <div style={backgroundStyle}>
      {/* 🎈 Floating Symbols */}
      <div style={floatingContainerStyle}>
        {floatingIcons.map((icon, index) => {
          const topOrBottom = Math.random() > 0.5 ? 'top' : 'bottom';
          const leftOrRight = Math.random() > 0.5 ? 'left' : 'right';
          const positionStyle = {
            [topOrBottom]: `${Math.floor(Math.random() * 90)}%`,
            [leftOrRight]: `${Math.floor(Math.random() * 90)}%`
          };
          return (
            <span
              key={index}
              className="floating-icon"
              style={{
                ...positionStyle,
                fontSize: `${20 + Math.random() * 10}px`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              {icon}
            </span>
          );
        })}
      </div>

      {/* ☁ Overlay */}
      <div style={overlayStyle}></div>

      {/* 🧾 Card */}
      <div style={cardStyle}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          LINGUAPAY
        </h1>
        <p style={{ fontSize: '18px', color: '#555', marginBottom: '30px', fontWeight: '500' }}>
          Speak. Translate. Convert.
        </p>

        <Link to="/currency"><button style={buttonStyle}>Currency Converter</button></Link>
        <Link to="/language"><button style={buttonStyle}>Language Converter</button></Link>
      </div>
    </div>
  );
}

// 🎧 Background Sound Handler Wrapper
function AppWrapper() {
  const location = useLocation();
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (location.pathname === "/" && !soundPlayed.current) {
      const playSound = () => {
        const audio = new Audio('/home-bg.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;
        audio.play().catch(err => console.warn('Audio autoplay blocked:', err));
        soundPlayed.current = true;
        window.removeEventListener('click', playSound);
      };
      window.addEventListener('click', playSound);
      return () => window.removeEventListener('click', playSound);
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/currency" element={<CurrencyConverter />} />
      <Route path="/language" element={<LanguageConverter />} />
      <Route path="/analysis" element={<CurrencyAnalysis />} />
      <Route path="/weekly" element={<WeeklyAnalysis />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

// 🎨 Styles
const backgroundStyle = {
  backgroundColor: '#fff4e6',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  zIndex: 1,
};

const floatingContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: 2,
};

const cardStyle = {
  position: 'relative',
  zIndex: 3,
  textAlign: 'center',
  background: '#fff',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  backgroundColor: '#ff8888',
  border: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};