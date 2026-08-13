// lib/conversation.js
export function conversationId(a: string, b: string): string {
	return [a, b].sort().join(':');
}

export function globalConversationId() {
	return 'global';
}
