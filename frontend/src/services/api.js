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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      user_id: user?.id,
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
        `${API_URL}/learning/${action}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                question,
                answer,
            }),
        }
    );

    return response.json();
}

export async function getMemory(userId) {
    const response = await fetch(`${API_URL}/memory?user_id=${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch memory");
    }
    return response.json();
}

export async function getLearningPath(userId) {
    const response = await fetch(`${API_URL}/learning-path?user_id=${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch learning path");
    }
    return response.json();
}

export async function generateLearningPath(userId) {
    const response = await fetch(`${API_URL}/learning-path/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to generate learning path");
    }
    return response.json();
}

export async function updateLearningPath(userId, completed, currentTopic, nextTopic, roadmap) {
    const response = await fetch(`${API_URL}/learning-path/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            completed,
            current_topic: currentTopic,
            next_topic: nextTopic,
            roadmap,
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to update learning path");
    }
    return response.json();
}