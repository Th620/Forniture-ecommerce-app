import Loading from "@/app/loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/account/sign-in");
    }
  }, [user, router, isLoading]);

  if (isLoading && !user) {
    return <Loading />;
  }

  if (!isLoading && user) {
    return children;
  }

  return <div className="w-full h-screen bg-white" />;
};

export default ProtectedRoute;
