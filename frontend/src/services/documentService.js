import supabase from "../lib/supabase";

export async function getDocuments() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

    if (error) throw error;

    return data;
}

export async function deleteDocument(id) {

    const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

    if (error) throw error;
}