import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">

      <h1 className="text-2xl font-bold text-blue-600">
        MentorAI
      </h1>

      <div className="text-right">

        <p className="font-semibold">
          {user?.user_metadata?.full_name}
        </p>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>

      </div>

    </div>
  );
}

export default Navbar;