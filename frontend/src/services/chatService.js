const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Check backend health and Gemini configuration status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      return { status: 'offline', error: `Server returned ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      status: 'offline',
      error: err.message || 'Cannot reach SPACEVERSE backend server.',
    };
  }
}

/**
 * Send messages array to the backend Gemini chat API
 * @param {Array<{role: string, content: string}>} messages
 */
export async function sendChatMessage(messages) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Failed to get cosmic response.');
      error.details = data.details || data.message || '';
      error.code = data.code || 'API_ERROR';
      error.status = response.status;
      throw error;
    }

    return {
      reply: data.reply,
      model: data.model,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netError = new Error('Could not connect to SPACEVERSE backend server.');
      netError.details = 'Ensure the Node.js backend is running on port 5000.';
      netError.code = 'NETWORK_ERROR';
      throw netError;
    }
    throw err;
  }
}
