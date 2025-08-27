// lib/conversation.js
export function conversationId(a, b) {
  return [a, b].sort().join(":");
}

export function globalConversationId() {
  return "global";
}
