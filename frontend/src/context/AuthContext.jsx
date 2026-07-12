import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { createProfileIfNeeded } from "../services/profile";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadSession() {

            const { data } = await supabase.auth.getSession();

            const currentUser = data.session?.user ?? null;

            setUser(currentUser);

            if (currentUser) {
                await createProfileIfNeeded(currentUser);
            }

            setLoading(false);

        }

        loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {

            const currentUser = session?.user ?? null;

            setUser(currentUser);

            if (currentUser) {
                await createProfileIfNeeded(currentUser);
            }

            setLoading(false);

        });

        return () => subscription.unsubscribe();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}