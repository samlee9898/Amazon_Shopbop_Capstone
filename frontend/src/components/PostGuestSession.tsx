async function PostGuestSession(username: string) {
  const raw = sessionStorage.getItem("guest");
  const API_URL = import.meta.env.VITE_VOTE_URL;

  console.log("username:", username);
  console.log("raw session:", raw);

  if (!raw) {
    console.error("Empty Session Storage");
    return;
  }

  let sessions;
  try {
    sessions = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse session JSON:", err);
    return;
  }

  sessions.forEach((item: { userId: string }) => {
    item.userId = username;
  });

  try {
    for (const session of sessions) {
      const res = await fetch(`${API_URL}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      console.log(res);
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        console.error(
          `critical error... failed to post this specific session: ${session}`,
        );
        sessionStorage.removeItem("guest");
        console.warn(`clearing all sessionStorage data for consistency`);
      }
    }
    // if all successful
    sessionStorage.removeItem("guest");
    console.log("Successful guest session data POST");
  } catch (err) {
    console.error("Error submitting session:", err);
  }
}

export default PostGuestSession;
