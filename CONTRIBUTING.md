# Contributing to Maya AI Assistant

Thank you for your interest in contributing to Maya! Here are some guidelines to help you get started.

## 🚀 Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/maya.git
   cd maya
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to the `.env` file
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🧑‍💻 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: We use Prettier for code formatting (`npm run format`)
- **Linting**: Run `npm run check` before committing
- **File Organization**: Follow the existing SvelteKit structure

### Testing

- Test speech functionality across different browsers
- Verify voice input/output works correctly
- Test error handling for network failures and speech API issues
- Ensure responsive design works on mobile devices

### Key Areas for Contribution

1. **Browser Compatibility**: Improve Firefox support for speech APIs
2. **Voice Features**: Enhanced voice commands, multiple languages
3. **UI/UX**: Accessibility improvements, better mobile experience
4. **AI Integration**: Additional AI providers, conversation memory
5. **Performance**: Speech processing optimization, faster responses

## 📝 Pull Request Process

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:

   - Write clean, readable code
   - Add appropriate comments
   - Include error handling
   - Test thoroughly

3. **Run quality checks**:

   ```bash
   npm run check
   npm run format
   ```

4. **Commit your changes**:

   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Screenshots/demos if UI changes
   - Testing instructions
   - Reference any related issues

## 🐛 Reporting Issues

When reporting bugs, please include:

- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Microphone/speech setup details

## 💡 Feature Requests

We welcome feature suggestions! Please:

- Check if the feature already exists
- Describe the use case clearly
- Explain how it would benefit users
- Consider implementation complexity

## 🔧 Development Tips

### Speech API Testing

- Use Chrome DevTools to simulate different network conditions
- Test with various microphone setups
- Try different speaking styles and accents
- Test interruption scenarios

### Environment Setup

- Ensure HTTPS for production (required for speech APIs)
- Test with different API rate limits
- Verify environment variable handling

## 📚 Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Web Speech API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🙋‍♀️ Getting Help

- Check existing [Issues](https://github.com/yourusername/maya/issues)
- Start a [Discussion](https://github.com/yourusername/maya/discussions)
- Review the [README](README.md) for setup instructions

## 🎉 Recognition

Contributors will be:

- Listed in the project README
- Credited in release notes
- Mentioned in project announcements

Thank you for helping make Maya better! 🚀
