<p align="center">
  <img src="./src/assets/logo.png" alt="Logo" width="300">
</p>

<p align="center"> <i>Built with the tools and technologies:</i></p>
<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" height="20"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" height="20"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" height="20"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" height="20"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" height="20"/>
  <img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white" height="20"/>
</p>

<h1 align="center">Welcome to SmartChat !</h1>

<p align="center">
Smart-Chat is an innovative conversational AI platform that orchestrates responses from multiple AI services, delivering high-quality, personalized interactions in real-time. Built with a robust Node.js architecture, it seamlessly integrates various AI SDKs, manages multi-platform evaluations, and supports dynamic chat sessions. </p>
<p align="center"><i>Developed as part of a Software Engineering B.Sc. Final Project.</i></p>

## ✨ Features

🔁 Real-time messaging using WebSockets

🧠 Multiple AI platforms merged into one seamless chat

✅ Feedback collection and insights

📜 Markdown-rendered bot responses

🔒 Secure API communication with token refresh

## 🚀 Live Preview

To use the app, click 👉 [SmartChat](https://smartchatfront.onrender.com/)

## ⚙️ Getting Started

### 🔧 Installation

Build **Smart-Chat** from the source and install dependencies:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/asafzaf/SmartChatFront.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd SmartChatFront
   ```

3. **Create a .env file in the root of the frontend project with the following content:**

   ```bash
    VITE_API_URL=http://localhost:3000
   ```

4. **Install the dependencies:**

   ```bash
   npm install
   ```

5. **Run the project:**

   ```bash
   npm start
   ```

   > By default, the app runs at: http://localhost:5173

## 🔁 Backend Integration

Ensure that the SmartChat Backend is running locally (or remotely) and is accessible via the VITE_API_URL you set in .env.

To run the complete Smart-Chat project (backend **and** frontend), you can clone and start the project backendavailable here:
👉 [SmartChat Backend](https://github.com/asafzaf/SmartChat)

The frontend uses:

- Axios for secure API communication

- Socket.io for real-time updates

- JWT (stored in cookies) for authentication

## 🚀 Frontend Flow

The frontend handles the following flow:

1. User opens chat interface.
2. User submits a Software Engineering-related question.
3. The question is sent to the backend API.
4. Backend performs merging, scoring, insights extraction, and returns the final answer.
5. Frontend displays the merged answer.
6. User provides feedback (rating and comments).
7. Feedback is sent back to backend for continuous improvement.
8. User preferences can be updated for future answers.

---

## 🧬 Project Structure

#### Public (`public/`)

- `artificial-intelligence_900961.png` — Static asset.
- `vite.svg` — Vite logo.

#### Source (`src/`)

#### API (`src/api/`)

- `api.conf.js` — API configuration.
- `auth.js` — Auth API endpoints.
- `chat.js` — Chat API endpoints.
- `feedback.js` — Feedback API endpoints.
- `message.js` — Message API endpoints.
- `user.js` — User API endpoints.

#### Assets (`src/assets/`)

- `logo.jpg`, `logo.png`, `react.svg` — UI static images.

#### Components (`src/components/`)

- **Auth Components**:  
  `FormButton.jsx`, `SignInForm.jsx`, `SignUpForm.jsx`
- **Chat Components**:  
  `ChatList.jsx`, `ChatWindow.jsx`, `MessageComponent.jsx`, `MessageInput.jsx`, `MessageList.jsx`
- **General Components**:  
  `LoadingSpinner.jsx`, `UserPreferencesModal.jsx`

#### Containers (`src/containers/`)

- `AppContainer.jsx`, `AuthContainer.jsx`

#### Context (`src/context/`)

- `AuthContext.jsx` — User authentication context.

#### Data (`src/Data/`)

- `dummyData.js`, `dummyMessage.js` — Mock data for development.

#### Handlers (`src/handlers/`)

- `chatHandlers.js`, `connectionHandlers.js`, `messageHandlers.js` — WebSocket handlers.

#### Hooks (`src/hooks/`)

- `useSocket.js` — Custom WebSocket hook.

#### Entry Files

- `main.jsx` — React entry point.
- `App.jsx` — Main app component.
- `index.css`, `App.css` — Stylesheets.

#### Config & Build

- `vite.config.js` — Vite configuration.
- `static.json` — Deployment configuration.
- `eslint.config.js` — Linting configuration.

<h2 align="center">🏆 Team Members</h2>
<div align="center">
Asaf Zafrir
| Eliya Samary Atias
| Nave Maymon
</div>
