import supabase from "../lib/supabase";
export async function createProfileIfNeeded(user) {
    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (data) return;

    await supabase.from("profiles").insert({
        id: user.id,
        full_name: user.user_metadata.full_name,
        email: user.email,
        avatar_url: user.user_metadata.avatar_url,
    });
}