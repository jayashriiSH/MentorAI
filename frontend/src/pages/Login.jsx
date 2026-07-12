import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap } from "lucide-react";
import supabase from "../lib/supabase";

function Login() {

  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-12 w-[480px]">

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-5 rounded-2xl">
            <GraduationCap
              size={40}
              className="text-white"
            />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center">
          MentorAI
        </h1>

        <p className="text-center text-gray-500 mt-4">
          Your Personal AI Learning Companion
        </p>

        <div className="mt-10 space-y-4">
          <div>📚 Learn from your own notes</div>
          <div>🧠 AI remembers your learning style</div>
          <div>📈 Track your learning progress</div>
          <div>🤖 Ask unlimited questions</div>
        </div>

        <button
          onClick={signIn}
          className="w-full mt-10 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition"
        >
          Continue with Google
        </button>

      </div>
    </div>
  );
}

export default Login;