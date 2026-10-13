# Maya - Talking AI Assistant

A modern web-based talking AI assistant built with SvelteKit and TypeScript. Maya uses the Web Speech API for voice input/output and Google Gemini Pro for intelligent responses.

## ✨ Features

- 🎤 **Voice Input**: Real-time speech recognition using Web Speech API
- 🔊 **Voice Output**: Text-to-speech responses for natural conversation
- 🧠 **AI Powered**: Google Gemini Pro integration for intelligent responses
- 💬 **Chat Interface**: Beautiful, responsive conversation UI
- 🌐 **Browser-Based**: No additional software required
- 📱 **Mobile Friendly**: Responsive design works on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd maya
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Google Gemini API key:

   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Architecture

### Frontend (SvelteKit)

- **Speech Recognition**: Converts user speech to text
- **Chat Interface**: Displays conversation history
- **Speech Controls**: Manages microphone input and status
- **Text-to-Speech**: Speaks AI responses aloud

### Backend (SvelteKit API)

- **Chat Endpoint**: `/api/chat` - Processes messages through Gemini
- **Google Gemini Integration**: Generates intelligent responses

### Key Components

- `src/routes/+page.svelte` - Main chat interface
- `src/routes/api/chat/+server.ts` - Gemini API endpoint
- `src/lib/SpeechControls.svelte` - Voice input controls
- `src/lib/ChatInterface.svelte` - Message display
- `src/lib/speechService.ts` - Speech API wrapper

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript and Svelte checks

### Browser Compatibility

The Web Speech API requires a modern browser:

- ✅ Chrome 25+
- ✅ Edge 79+
- ✅ Safari 14.1+
- ❌ Firefox (limited support)

## 🔧 Configuration

### Environment Variables

| Variable                | Description                | Required |
| ----------------------- | -------------------------- | -------- |
| `GOOGLE_GEMINI_API_KEY` | Your Google Gemini API key | Yes      |

### Speech Settings

The speech service can be configured in `src/lib/speechService.ts`:

- Language: Default is `en-US`
- Speech rate, pitch, and volume for TTS
- Recognition settings (continuous, interim results)

## 📝 Usage

1. **Start Conversation**: Click the microphone button
2. **Speak**: Talk naturally when the button turns red
3. **Listen**: Maya will respond with both text and voice
4. **Continue**: The conversation flows naturally

### Tips for Best Experience

- Speak clearly and at normal volume
- Ensure good internet connection for AI responses
- Allow microphone permissions when prompted
- Use in a quiet environment for better recognition

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

The built application will be in the `build/` directory, ready for deployment to any Node.js hosting service.

### Deployment Options

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Railway**: Full-stack deployment
- **Digital Ocean**: VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Google Gemini](https://ai.google.dev/) for powerful AI capabilities
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech functionality
