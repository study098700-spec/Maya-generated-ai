export interface Message {
	id: string;
	text: string;
	sender: 'user' | 'assistant';
	timestamp: Date;
}

export interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
	resultIndex: number;
}

export interface SpeechRecognitionResult {
	isFinal: boolean;
	[index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
	length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

export interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	maxAlternatives: number;
	serviceURI: string;
	grammars: any; // SpeechGrammarList is not universally supported

	start(): void;
	stop(): void;
	abort(): void;

	onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
	onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
	onend: ((this: SpeechRecognition, ev: Event) => any) | null;
	onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
	onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
	onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
	onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
	onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
	onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
	onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
	onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

export interface SpeechRecognitionErrorEvent extends Event {
	error:
		| 'no-speech'
		| 'aborted'
		| 'audio-capture'
		| 'network'
		| 'not-allowed'
		| 'service-not-allowed'
		| 'bad-grammar'
		| 'language-not-supported';
	message: string;
}

declare var SpeechRecognition: {
	prototype: SpeechRecognition;
	new (): SpeechRecognition;
};
