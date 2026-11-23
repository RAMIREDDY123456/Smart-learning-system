DEAF AND MUTE STUDENT SMART LEARNING WEBSITE
=============================================

BASIC VERSION - SOURCE CODE AND SETUP

FILES
-----
index.html   Website structure
style.css    Website design and responsive layout
script.js    Lessons, sign word bank, browser speech tools, quiz and progress

HOW TO RUN ON WINDOWS
---------------------
1. Download and extract this ZIP file.
2. Open Visual Studio Code.
3. Select File > Open Folder.
4. Choose the extracted folder: Deaf_Mute_Smart_Learning_Website.
5. Open index.html.
6. Right-click inside index.html and choose "Open with Live Server"
   (if the Live Server extension is installed).

ALTERNATIVE
-----------
You can double-click index.html to open it in a browser. Most features
will work. For best microphone support, run through Live Server and use
Google Chrome. Allow microphone access when the browser asks.

LIVE SERVER EXTENSION
---------------------
In VS Code:
1. Click Extensions on the left.
2. Search for "Live Server" by Ritwick Dey.
3. Click Install.
4. Open index.html and click "Go Live" in the bottom status bar.

FEATURES INCLUDED
-----------------
- Responsive home page and navigation
- Visual learning lessons
- Mark lessons as completed
- Sign word bank with descriptions
- Browser speech-to-text (where supported)
- Browser text-to-speech
- Three-question quiz
- Basic personalised recommendations based on quiz score
- Progress tracking saved in browser localStorage

IMPORTANT LIMITATIONS
--------------------
This is a basic working front-end mini project. It does not include:
- Live camera-based sign-language recognition or a trained gesture model
- A server, student login, or cloud database
- A trained machine-learning model

The sign word bank is a learning aid, not automatic sign recognition.
Speech recognition depends on browser support, internet connection in
some browsers, and microphone permission. Text-to-speech uses the
browser's built-in speech synthesis.

The sign descriptions are introductory prompts. Sign languages differ
by country and community; use a qualified sign-language resource or
teacher for accurate demonstrations.
