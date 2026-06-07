# 🚀 Learning Assistant — GCU Hackathon

An AI-powered learning companion built for GCU Hackathon. It helps students learn smarter through image analysis, voice interaction, doubt solving, quizzes, flowchart generation, and resource discovery — all in one place.

---

## ✨ Features

### 📷 Image Mode
- Capture or upload images of problems/questions.
- AI analyzes the image and provides instant solutions.

### 🎙️ Speech Mode
- Speak your doubts naturally.
- AI listens and responds with spoken explanations.

### ❓ Doubt Mode
- Type any academic doubt or question.
- Get clear, AI-generated explanations instantly.

### 📝 Quiz Mode
- Generate custom quizzes on any topic.
- Test your knowledge interactively.

### 🔀 Flowchart Generator
- Convert complex concepts or processes into visual flowcharts.
- Powered by Mermaid.js and ReactFlow.

### 📚 Resource Finder
- Find curated learning resources for any topic.
- Saves time searching for quality study material.

### 🕓 History
- View your past interactions and solutions in one place.

### 🌙 Theme Toggle
- Light and Dark mode support.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18, Vite 5 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Flowcharts** | ReactFlow, Mermaid.js |
| **Voice** | Web Speech API, Web Speech Cognitive Services |
| **Camera** | React Webcam |
| **HTTP** | Axios |
| **Icons** | React Icons, Lucide React |

---

## 🚀 Installation

**1. Clone the repository**
```bash
git clone https://github.com/sweetylearner-max/Hackathon-GCU.git
cd Hackathon-GCU
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

**4. Run development server**
```bash
npm run dev
```

**5. Build for production**
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── comps/
│   ├── CameraConf.tsx        # Image capture & analysis
│   ├── SpeechConf.tsx        # Voice input & output
│   ├── DoubtInput.tsx        # Text-based doubt solving
│   ├── QuizSection.tsx       # Quiz generator
│   ├── FlowchartGenerator.tsx # Flowchart creator
│   ├── ResourceFinder.tsx    # Resource discovery
│   ├── HistoryView.tsx       # Conversation history
│   └── ThemeTog.tsx          # Light/Dark theme toggle
├── utils/
│   ├── gemini.ts             # Gemini AI integration
│   ├── speech.ts             # Speech utilities
│   └── theme.ts              # Theme utilities
├── App.tsx                   # Main application
└── main.tsx                  # Entry point
```

---

## ⚠️ Disclaimer

This project was built as part of a Hackathon. It is intended for educational and demonstration purposes only.

## 📄 License

MIT License

## 👩‍💻 Author

**Akanksha Bursu**
Built with curiosity and passion for making learning more accessible.
