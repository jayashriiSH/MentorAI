import supabase from "../lib/supabase";

export async function createSession(title = "New Chat") {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
            user_id: user.id,
            title,
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function getSessions() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
}

export async function saveMessage(
    sessionId,
    role,
    message,
    sources = null
) {

    const { error } = await supabase
        .from("chat_messages")
        .insert({
            session_id: sessionId,
            role,
            message,
            sources,
        });

    if (error) throw error;
}

export async function getMessages(sessionId) {

    const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at");

    if (error) throw error;

    return data;
}

export async function updateSessionTitle(sessionId, title) {
    const { error } = await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", sessionId);

    if (error) throw error;
}

export async function deleteSession(sessionId) {
    const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId);

    if (error) throw error;
}