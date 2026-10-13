import { browser } from '$app/environment';
import type {
	SpeechRecognition,
	SpeechRecognitionEvent,
	SpeechRecognitionErrorEvent
} from './types';

class SpeechService {
	private recognition: SpeechRecognition | null = null;
	private isSupported = false;
	private isInitialized = false;
	private initPromise: Promise<boolean> | null = null;
	private isSpeakingState = false;
	private speechQueue: string[] = [];
	private currentSpeechPromise: Promise<void> | null = null;

	init() {
		if (!browser) return false;

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			console.warn('Speech recognition not supported');
			return false;
		}

		this.recognition = new SpeechRecognition();
		this.recognition.continuous = false;
		this.recognition.interimResults = true;
		this.recognition.lang = 'en-US';
		this.recognition.maxAlternatives = 1;

		this.isSupported = true;
		this.isInitialized = true;
		return true;
	}

	// Async method to check support with proper timing
	async checkSupportAsync(): Promise<boolean> {
		if (this.initPromise) {
			return this.initPromise;
		}

		this.initPromise = new Promise((resolve) => {
			if (this.isInitialized) {
				resolve(this.isSupported);
				return;
			}

			// Give the browser some time to initialize speech recognition
			setTimeout(() => {
				const result = this.init();
				resolve(result);
			}, 100);
		});

		return this.initPromise;
	}

	startListening(
		onResult: (transcript: string, isFinal: boolean) => void,
		onError: (error: string) => void,
		onStart: () => void,
		onEnd: () => void
	): boolean {
		if (!this.isSupported || !this.recognition) {
			onError('Speech recognition not supported');
			return false;
		}

		this.recognition.onstart = () => {
			onStart();
		};

		this.recognition.onresult = (event: SpeechRecognitionEvent) => {
			let transcript = '';
			let isFinal = false;

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				transcript += result[0].transcript;
				if (result.isFinal) {
					isFinal = true;
				}
			}

			onResult(transcript, isFinal);
		};

		this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			let errorMessage = 'Speech recognition error';

			switch (event.error) {
				case 'no-speech':
					errorMessage = 'No speech detected. Please try speaking again.';
					break;
				case 'audio-capture':
					errorMessage = 'Microphone not available. Please check your microphone settings.';
					break;
				case 'not-allowed':
					errorMessage = 'Microphone access denied. Please allow microphone access.';
					break;
				case 'network':
					errorMessage = 'Network error. Please check your internet connection.';
					break;
				default:
					errorMessage = `Speech recognition error: ${event.error}`;
			}

			onError(errorMessage);
		};

		this.recognition.onend = () => {
			onEnd();
		};

		try {
			this.recognition.start();
			return true;
		} catch (error) {
			onError('Failed to start speech recognition');
			return false;
		}
	}

	stopListening(): void {
		if (this.recognition) {
			this.recognition.stop();
		}
	}

	async speak(text: string): Promise<void> {
		if (!browser || !('speechSynthesis' in window)) {
			console.warn('Text-to-speech not supported');
			return;
		}

		// If already speaking, queue this text
		if (this.isSpeakingState) {
			console.log('Speech in progress, queueing text...');
			this.speechQueue.push(text);
			return;
		}

		this.isSpeakingState = true;
		console.log('Starting TTS for text:', text.substring(0, 50) + '...');

		try {
			// Cancel any ongoing speech and reset speechSynthesis (browser quirk fix)
			speechSynthesis.cancel();

			// Some browsers need this to properly reset
			if (speechSynthesis.paused) {
				speechSynthesis.resume();
			}

			// Add a small delay to ensure speechSynthesis is ready
			await new Promise((resolve) => setTimeout(resolve, 50));

			// Split long text into smaller chunks to avoid browser limitations
			const chunks = this.splitTextIntoChunks(text, 200); // Max 200 characters per chunk

			console.log(`Split text into ${chunks.length} chunks`);

			for (let i = 0; i < chunks.length; i++) {
				if (!this.isSpeakingState) {
					console.log('Speech cancelled, stopping...');
					break;
				}

				console.log(
					`Speaking chunk ${i + 1}/${chunks.length}:`,
					chunks[i].substring(0, 30) + '...'
				);
				await this.speakChunk(chunks[i], i > 0 ? 300 : 0); // Longer delay between chunks for better reliability
			}

			console.log('TTS completed');
		} catch (error) {
			console.error('Speech error:', error);
		} finally {
			this.isSpeakingState = false;

			// Process next item in queue if any
			if (this.speechQueue.length > 0) {
				const nextText = this.speechQueue.shift()!;
				setTimeout(() => this.speak(nextText), 100);
			}
		}
	}

	private splitTextIntoChunks(text: string, maxLength: number): string[] {
		if (text.length <= maxLength) {
			return [text];
		}

		const chunks: string[] = [];
		const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

		let currentChunk = '';

		for (const sentence of sentences) {
			const trimmedSentence = sentence.trim();
			if (!trimmedSentence) continue;

			// Add punctuation back
			const sentenceWithPunct =
				trimmedSentence +
				(text.charAt(text.indexOf(trimmedSentence) + trimmedSentence.length) || '.');

			if (currentChunk.length + sentenceWithPunct.length > maxLength) {
				if (currentChunk) {
					chunks.push(currentChunk.trim());
					currentChunk = '';
				}

				// If single sentence is too long, split by commas or words
				if (sentenceWithPunct.length > maxLength) {
					chunks.push(...this.splitLongSentence(sentenceWithPunct, maxLength));
				} else {
					currentChunk = sentenceWithPunct;
				}
			} else {
				currentChunk += (currentChunk ? ' ' : '') + sentenceWithPunct;
			}
		}

		if (currentChunk.trim()) {
			chunks.push(currentChunk.trim());
		}

		return chunks.filter((chunk) => chunk.length > 0);
	}

	private splitLongSentence(sentence: string, maxLength: number): string[] {
		const chunks: string[] = [];
		const parts = sentence.split(',');
		let currentChunk = '';

		for (const part of parts) {
			const trimmedPart = part.trim();
			if (currentChunk.length + trimmedPart.length > maxLength) {
				if (currentChunk) {
					chunks.push(currentChunk.trim());
					currentChunk = '';
				}

				// If even a single part is too long, split by words
				if (trimmedPart.length > maxLength) {
					chunks.push(...this.splitByWords(trimmedPart, maxLength));
				} else {
					currentChunk = trimmedPart;
				}
			} else {
				currentChunk += (currentChunk ? ', ' : '') + trimmedPart;
			}
		}

		if (currentChunk.trim()) {
			chunks.push(currentChunk.trim());
		}

		return chunks;
	}

	private splitByWords(text: string, maxLength: number): string[] {
		const words = text.split(' ');
		const chunks: string[] = [];
		let currentChunk = '';

		for (const word of words) {
			if (currentChunk.length + word.length + 1 > maxLength) {
				if (currentChunk) {
					chunks.push(currentChunk.trim());
					currentChunk = '';
				}
				currentChunk = word;
			} else {
				currentChunk += (currentChunk ? ' ' : '') + word;
			}
		}

		if (currentChunk.trim()) {
			chunks.push(currentChunk.trim());
		}

		return chunks;
	}

	private async speakChunk(text: string, delay: number = 0): Promise<void> {
		if (delay > 0) {
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		// Check if speech was cancelled during delay
		if (!this.isSpeakingState) {
			return;
		}

		const maxRetries = 2;
		let attempt = 0;

		while (attempt < maxRetries && this.isSpeakingState) {
			try {
				await this.attemptSpeak(text);
				return; // Success, exit
			} catch (error) {
				attempt++;
				console.warn(`Speech attempt ${attempt} failed:`, error);

				if (attempt < maxRetries) {
					console.log(`Retrying speech in 500ms... (attempt ${attempt + 1}/${maxRetries})`);
					await new Promise((resolve) => setTimeout(resolve, 500));

					// Reset speech synthesis before retry
					speechSynthesis.cancel();
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			}
		}

		if (attempt >= maxRetries) {
			console.error('Max speech retries reached, giving up on chunk:', text.substring(0, 30));
		}
	}

	private async attemptSpeak(text: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const utterance = new SpeechSynthesisUtterance(text);
			let resolved = false;

			// Set voice and speech parameters
			this.setVoice(utterance);
			utterance.rate = 0.9; // Slightly slower for better clarity
			utterance.pitch = 1.3;
			utterance.volume = 1.0;

			// Timeout to prevent hanging
			const timeoutDuration = Math.max(text.length * 100 + 3000, 5000); // Minimum 5 seconds
			const timeout = setTimeout(() => {
				if (!resolved) {
					resolved = true;
					speechSynthesis.cancel();
					console.warn('Speech timeout, continuing...');
					reject(new Error('Speech timeout'));
				}
			}, timeoutDuration);

			utterance.onstart = () => {
				console.log('Speech started for chunk:', text.substring(0, 20) + '...');
			};

			utterance.onend = () => {
				if (!resolved) {
					resolved = true;
					clearTimeout(timeout);
					console.log('Speech ended for chunk:', text.substring(0, 20) + '...');
					resolve();
				}
			};

			utterance.onerror = (event) => {
				if (!resolved) {
					resolved = true;
					clearTimeout(timeout);
					console.warn('Speech error for chunk:', text.substring(0, 20), 'Error:', event.error);
					reject(new Error(`Speech error: ${event.error}`));
				}
			};

			// Check if speech was cancelled before starting
			if (!this.isSpeakingState) {
				resolved = true;
				clearTimeout(timeout);
				resolve();
				return;
			}

			// Get available voices and speak
			const voices = speechSynthesis.getVoices();

			if (voices.length === 0) {
				speechSynthesis.onvoiceschanged = () => {
					if (!resolved && this.isSpeakingState) {
						this.setVoice(utterance);
						try {
							speechSynthesis.speak(utterance);
						} catch (error) {
							console.warn('Error speaking:', error);
							if (!resolved) {
								resolved = true;
								clearTimeout(timeout);
								reject(error);
							}
						}
					}
				};
			} else {
				try {
					speechSynthesis.speak(utterance);
				} catch (error) {
					console.warn('Error speaking:', error);
					if (!resolved) {
						resolved = true;
						clearTimeout(timeout);
						reject(error);
					}
				}
			}
		});
	}

	private setVoice(utterance: SpeechSynthesisUtterance): void {
		const voices = speechSynthesis.getVoices();

		// Priority order for voices
		const voiceNames = [
			'Google US English Female',
			'Microsoft Jenny Desktop',
			'Microsoft Aria Desktop',
			'Samantha',
			'Google UK English Female',
			'Microsoft Zira Desktop',
			'Karen',
			'Google English (US)',
			'Anna',
			'Microsoft Hazel Desktop',
			'Helena',
			'Susan',
			'Catherine'
		];

		// First try to find voices by exact name match
		for (const voiceName of voiceNames) {
			const voice = voices.find((v) => v.name === voiceName);
			if (voice) {
				utterance.voice = voice;
				return;
			}
		}

		// Fallback: find any voice by name patterns
		const fallbackVoice = voices.find(
			(voice) =>
				voice.lang.startsWith('en') &&
				(voice.name.toLowerCase().includes('jenny') ||
					voice.name.toLowerCase().includes('aria') ||
					voice.name.toLowerCase().includes('female') ||
					voice.name.toLowerCase().includes('google') ||
					voice.name.toLowerCase().includes('samantha') ||
					voice.name.toLowerCase().includes('zira') ||
					voice.name.toLowerCase().includes('anna') ||
					voice.name.toLowerCase().includes('karen'))
		);

		if (fallbackVoice) {
			utterance.voice = fallbackVoice;
		}
	}

	getAvailableVoices(): SpeechSynthesisVoice[] {
		if (!browser || !('speechSynthesis' in window)) {
			return [];
		}
		return speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith('en'));
	}

	getVoices(): SpeechSynthesisVoice[] {
		if (!browser || !('speechSynthesis' in window)) {
			return [];
		}

		const voices = speechSynthesis.getVoices();
		const voiceNames = [
			'Google US English Female',
			'Microsoft Jenny Desktop',
			'Microsoft Aria Desktop',
			'Samantha',
			'Google UK English Female',
			'Microsoft Zira Desktop',
			'Karen',
			'Google English (US)',
			'Anna'
		];

		return voices.filter(
			(voice) =>
				voice.lang.startsWith('en') &&
				(voiceNames.includes(voice.name) ||
					voice.name.toLowerCase().includes('jenny') ||
					voice.name.toLowerCase().includes('aria') ||
					voice.name.toLowerCase().includes('female') ||
					voice.name.toLowerCase().includes('google'))
		);
	}

	stopSpeaking(): void {
		if (browser && 'speechSynthesis' in window) {
			this.isSpeakingState = false;
			this.speechQueue = []; // Clear any queued speech
			speechSynthesis.cancel();
			// Force stop by pausing and resuming (browser quirk fix)
			speechSynthesis.pause();
			speechSynthesis.resume();
			speechSynthesis.cancel();
		}
	}

	isSpeaking(): boolean {
		if (!browser || !('speechSynthesis' in window)) {
			return false;
		}
		return this.isSpeakingState || speechSynthesis.speaking || speechSynthesis.pending;
	}

	getSpeechStatus(): { speaking: boolean; pending: boolean; paused: boolean; queue: number } {
		if (!browser || !('speechSynthesis' in window)) {
			return { speaking: false, pending: false, paused: false, queue: 0 };
		}

		return {
			speaking: speechSynthesis.speaking,
			pending: speechSynthesis.pending,
			paused: speechSynthesis.paused,
			queue: this.speechQueue.length
		};
	}

	// Browser-specific optimization for Chrome/Edge
	private ensureSpeechSynthesisReady(): Promise<void> {
		return new Promise((resolve) => {
			// Chrome sometimes needs voices to be loaded first
			if (speechSynthesis.getVoices().length === 0) {
				speechSynthesis.onvoiceschanged = () => {
					resolve();
				};
				// Fallback timeout
				setTimeout(resolve, 1000);
			} else {
				resolve();
			}
		});
	}

	// Reset speech synthesis state (useful for browser quirks)
	resetSpeechSynthesis(): void {
		if (!browser || !('speechSynthesis' in window)) return;

		try {
			speechSynthesis.cancel();
			if (speechSynthesis.paused) {
				speechSynthesis.resume();
			}
			speechSynthesis.cancel();

			// Clear our internal state
			this.isSpeakingState = false;
			this.speechQueue = [];

			console.log('Speech synthesis reset');
		} catch (error) {
			console.warn('Error resetting speech synthesis:', error);
		}
	}

	stop(): void {
		this.stopListening();
		this.stopSpeaking();
		this.resetSpeechSynthesis();
	}

	get supported(): boolean {
		if (!this.isInitialized) {
			this.init();
		}
		return this.isSupported;
	}
}

// Create and initialize the service
const speechService = new SpeechService();
speechService.init();

export { speechService };
