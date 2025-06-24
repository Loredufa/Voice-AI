// Centralized access to environment variables for ElevenLabs

export const ELEVENLABS_API_KEY =
  process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? "";

export const AGENT_ID = process.env.EXPO_PUBLIC_AGENT_ID ?? "";

if (!ELEVENLABS_API_KEY) {
  console.warn("EXPO_PUBLIC_ELEVENLABS_API_KEY is not set");
}

if (!AGENT_ID) {
  console.warn("EXPO_PUBLIC_AGENT_ID is not set");
}
