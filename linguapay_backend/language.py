import speech_recognition as sr
from googletrans import Translator, LANGUAGES
from gtts import gTTS
import os
import threading
import time


def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎙️ Speak now...")
        recognizer.adjust_for_ambient_noise(source, duration=1)

        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=7)
            print("✅ Captured audio. Recognizing...")
        except sr.WaitTimeoutError:
            print("❌ No speech detected within timeout.")
            return None

    try:
        text = recognizer.recognize_google(audio)
        print(f"🗣️ Recognized text: {text}")
        return text
    except sr.UnknownValueError:
        print("❌ Could not understand the speech.")
        return None
    except sr.RequestError as e:
        print(f"❌ API error: {e}")
        return None



def detect_language(text):
    translator = Translator()
    detected_lang = translator.detect(text).lang
    print(f"🌐 Detected language: {LANGUAGES.get(detected_lang, detected_lang)}")
    return detected_lang


def translate_text(text, dest_language, source_language=None):
    translator = Translator()

    if not source_language:
        detected_lang = translator.detect(text).lang
        print(f"🕵️ Detected source language: {LANGUAGES.get(detected_lang, detected_lang)}")
        source_language = detected_lang

    translated_text = translator.translate(text, src=source_language, dest=dest_language).text
    return {
        "translated": translated_text,
        "detected_source": source_language,
        "target_language": dest_language
    }

def text_to_speech(text, lang):
    tts = gTTS(text=text, lang=lang)
    tts.save("output.mp3")
    # ⚠️ Don't auto-play with system command (prevents popup)


def list_languages():
    print("Supported languages:")
    for key, value in LANGUAGES.items():
        print(f"{key}: {value}")


# Optional: Clean up file after sending (optional, but helpful for long runs)
def remove_file_later(filename, delay=10):
    def delete_file():
        time.sleep(delay)
        if os.path.exists(filename):
            os.remove(filename)
            print(f"🧹 Removed {filename}")
    threading.Thread(target=delete_file).start()


