import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.admin)) {
      router.push("/");
    }
  }, [user, router, isLoading]);

  if (isLoading && !user) {
    return (
      <div className="w-full h-screen bg-white text-black flex justify-center items-center">
        Loading..
      </div>
    );
  }

  if (!isLoading && user && user.admin) {
    return children;
  }

  return <div className="w-full h-screen bg-white" />;
};

export default AdminProtectedRoute;
