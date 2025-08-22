// Path to the local backend to try modified version
export const API_BASE_OLD = "http://localhost:5000/api8989";
export const API_BASE_NEW = "http://localhost:5000";

//TEST LOCAL BACKEND:
export async function pingBackend() {
  try {
    const response = await fetch(`${API_BASE_OLD}/ping`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error calling backend:", err);
    return null;
  }
}

// IMPORTANT !!
// path to online(running) backend ! The one that is currently deployed(MATHEUS VERSION)
// export const API_BASE_OLD =
//   "https://hacc-man-61ba30704cf0.herokuapp.com/api8989";
// export const API_BASE_NEW = "https://haccman2-022f4eadefc4.herokuapp.com";

export async function fetchOldPromptResponse(message, thread, model) {
  try {
    const encodedMessage = encodeURIComponent(message);
    const res = await fetch(
      `${API_BASE_OLD}/response1999/${encodedMessage}/${thread}/${model}`,
      { method: "GET" }
    );
    return res.text();
  } catch (err) {
    console.error("Error in fetchOldPromptResponse:", err);
    throw err;
  }
}
export async function sendPromptToMemory(message /*, thread, systemPrompt */) {
  // TEMP STUB: keep UI + Supabase flow working
  return `Echo: ${message}`;
}
// export async function sendPromptToMemory(message, thread, systemPrompt) {
//   try {
//     const res = await fetch(`${API_BASE_NEW}/chatmemory`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message, thread, system_prompt: systemPrompt }),
//     });
//     const data = await res.json();
//     return data.response;
//   } catch (err) {
//     console.error("Error in sendPromptToMemory:", err);
//     throw err;
//   }
// }

export async function storeInteraction(
  message,
  username,
  time,
  type,
  thread = ""
) {
  try {
    const encodedMessage = encodeURIComponent(message);
    const res = await fetch(
      `${API_BASE_OLD}/interaction/${username}/${encodedMessage}/${time}/${type}`,
      { method: "POST" }
    );
    return res.text();
  } catch (err) {
    console.error("Error in storeInteraction:", err);
    throw err;
  }
}
