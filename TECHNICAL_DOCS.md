# Maya AI Assistant - Technical Documentation

## 📁 Project Structure

```
maya/
├── .github/                    # GitHub templates and workflows
│   ├── ISSUE_TEMPLATE/        # Issue templates for bugs and features
│   ├── workflows/             # GitHub Actions CI/CD
│   └── pull_request_template.md
├── src/                       # Source code
│   ├── lib/                   # Reusable components and services
│   │   ├── ChatInterface.svelte    # Chat UI component
│   │   ├── SpeechControls.svelte   # Microphone controls
│   │   ├── speechService.ts        # Speech API wrapper
│   │   └── types.ts               # TypeScript definitions
│   ├── routes/                # SvelteKit routes
│   │   ├── +page.svelte       # Main chat page
│   │   └── api/chat/          # Gemini API endpoint
│   ├── app.css                # Global styles
│   ├── app.d.ts              # App type definitions
│   └── app.html              # HTML template
├── static/                    # Static assets
│   ├── images/               # Avatar images
│   ├── favicon.png           # Site favicon
│   └── icon.png             # App icon
├── CONTRIBUTING.md           # Contribution guidelines
├── DEPLOYMENT.md            # Deployment instructions
├── LICENSE                  # MIT License
├── README.md               # Project documentation
├── SECURITY.md             # Security policy
└── package.json            # Dependencies and scripts
```

## 🔧 Architecture Overview

### Frontend Components

#### `SpeechControls.svelte`

Manages voice input functionality:

- Microphone button with visual feedback
- Speech recognition state management
- Real-time transcription display
- Error handling for speech API failures

#### `ChatInterface.svelte`

Displays conversation history:

- Message bubbles for user and AI
- Avatar images for visual identification
- Responsive design for mobile/desktop
- Auto-scroll to latest messages

#### `speechService.ts`

Core speech functionality:

- Web Speech API wrapper
- Speech recognition with chunking
- Text-to-speech with voice selection
- Browser compatibility handling

### Backend API

#### `/api/chat/+server.ts`

Google Gemini integration:

- Processes user messages
- Streams AI responses
- Error handling and rate limiting
- Environment variable management

## 🔊 Speech Implementation Details

### Speech Recognition Flow

1. User clicks microphone button
2. Request microphone permission
3. Start speech recognition with chunking
4. Process interim and final results
5. Send complete transcription to AI
6. Handle errors and retries

### Text-to-Speech Flow

1. Receive AI response text
2. Check for speech synthesis support
3. Create speech utterance with settings
4. Queue and play speech with chunking
5. Handle interruptions and errors

### Browser Compatibility Matrix

| Feature                | Chrome  | Edge    | Safari  | Firefox    |
| ---------------------- | ------- | ------- | ------- | ---------- |
| Speech Recognition     | ✅ Full | ✅ Full | ✅ Full | ❌ Limited |
| Text-to-Speech         | ✅ Full | ✅ Full | ✅ Full | ✅ Full    |
| Voice Selection        | ✅ Yes  | ✅ Yes  | ✅ Yes  | ✅ Yes     |
| Continuous Recognition | ✅ Yes  | ✅ Yes  | ✅ Yes  | ❌ No      |

## 🎨 UI/UX Design Principles

### Color Scheme

- Primary: Blue gradient (#007bff to #0056b3)
- Success: Green (#28a745)
- Danger: Red (#dc3545)
- Dark theme with high contrast

### Responsive Design

- Mobile-first approach
- Flexible grid layout
- Touch-friendly button sizes
- Optimized for various screen sizes

### Accessibility Features

- High contrast colors
- Keyboard navigation support
- Screen reader friendly
- Clear focus indicators

## 🔒 Security Considerations

### API Key Management

- Environment variables only
- Never exposed to client
- Server-side API calls only
- Rotation recommendations

### Speech Data Privacy

- No audio storage by default
- Temporary transcription only
- User consent for microphone
- Clear data usage policies

### HTTPS Requirements

- Required for speech APIs
- Secure cookie handling
- CSP headers recommended
- Certificate validation

## 🚀 Performance Optimizations

### Bundle Size

- Code splitting with SvelteKit
- Tree shaking enabled
- Dynamic imports for speech
- Minimal external dependencies

### Speech Performance

- Chunked recognition for long speech
- Debounced API calls
- Efficient voice synthesis
- Memory management for audio

### Network Optimization

- Streaming responses from Gemini
- Connection pooling
- Retry mechanisms
- Timeout handling

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] Microphone permission flow
- [ ] Speech recognition accuracy
- [ ] Text-to-speech quality
- [ ] Error handling scenarios
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Automated Testing

- TypeScript compilation checks
- Code formatting validation
- Security vulnerability scanning
- Build process verification

### Browser Testing Matrix

Test core functionality across:

- Chrome (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (speech limitations noted)

## 📊 Monitoring and Analytics

### Key Metrics to Track

- Speech recognition accuracy rates
- API response times
- Error frequencies by browser
- User engagement patterns
- Voice synthesis usage

### Error Tracking

- Speech API failures
- Network connectivity issues
- Gemini API rate limits
- Browser compatibility problems

## 🔄 Development Workflow

### Local Development

```bash
# Setup
npm install
cp .env.example .env
# Add GOOGLE_GEMINI_API_KEY

# Development
npm run dev      # Start dev server
npm run check    # Type checking
npm run format   # Code formatting
```

### Production Build

```bash
npm run build    # Build for production
npm run preview  # Test production build
```

### Code Quality

- TypeScript strict mode
- Prettier formatting
- ESLint recommended rules
- Svelte-specific linting

## 🐛 Common Issues and Solutions

### Speech Recognition Issues

**Problem**: Recognition not starting

- Check microphone permissions
- Verify HTTPS connection
- Test browser compatibility

**Problem**: Poor recognition accuracy

- Ensure quiet environment
- Check microphone quality
- Verify language settings

### API Integration Issues

**Problem**: Gemini API errors

- Verify API key configuration
- Check rate limits and quotas
- Monitor network connectivity

**Problem**: Slow response times

- Implement request timeout
- Add retry mechanisms
- Consider response caching

### Browser Compatibility Issues

**Problem**: Firefox speech recognition

- Graceful degradation to text input
- Clear user communication
- Alternative input methods

## 🎯 Future Enhancements

### Planned Features

- Multiple language support
- Conversation memory/history
- Voice command shortcuts
- Custom wake words
- Offline speech processing

### Technical Improvements

- WebRTC for better audio
- Service worker for offline use
- Progressive Web App features
- Enhanced error recovery

### UI/UX Enhancements

- Voice visualization
- Conversation themes
- Accessibility improvements
- Advanced speech settings

---

For specific implementation details, see the source code and inline documentation.
