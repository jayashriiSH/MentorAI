import supabase from "../lib/supabase";

const API_URL = "http://127.0.0.1:8000";

export async function uploadDocuments(files) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const formData = new FormData();

  formData.append("user_id", user.id);

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.json();
}

export async function askQuestion(question) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    throw new Error("Chat failed");
  }

  return response.json();
}

export async function getDocuments() {
  const response = await fetch(`${API_URL}/documents`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}

export async function learningAction(
    action,
    question,
    answer
) {

    const response = await fetch(
        `${API_URL}/learning`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({

                action,

                question,

                answer,

            }),
        }
    );

    return response.json();
}