export async function getConversations(userId: string) {
  // number between 1000 and 3000
  const delay = Math.floor(Math.random() * 2000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const response = await fetch(`http://localhost:3000/conversations/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return response.json();
}
