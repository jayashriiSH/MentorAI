import React from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabase";
import { LogOut, User, Mail, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const name = user?.user_metadata?.full_name || "Student";
  const email = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || "";
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">👤 Profile Settings</h1>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xs flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-blue-50 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl shadow-sm">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* User Info Fields */}
          <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
          <p className="text-sm text-gray-400 font-medium mb-8">Active Learner</p>

          <div className="w-full space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <User size={15} className="text-gray-400" />
                Full Name
              </span>
              <span className="text-sm font-semibold text-gray-700">{name}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Mail size={15} className="text-gray-400" />
                Email Address
              </span>
              <span className="text-sm font-semibold text-gray-700">{email}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar size={15} className="text-gray-400" />
                Member Since
              </span>
              <span className="text-sm font-semibold text-gray-700">{joinedDate}</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full mt-10 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
}