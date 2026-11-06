export async function sendEmailNotification(authUser, payload) {
  if (!authUser) throw new Error("A signed-in user is required to send an email notification.");

  const token = await authUser.getIdToken();
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Email notification failed with status ${response.status}.`);
  }
  return response.json();
}
