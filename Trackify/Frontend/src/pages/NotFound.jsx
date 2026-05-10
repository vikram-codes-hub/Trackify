import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-7xl font-bold text-accent mb-2">404</h1>
      <p className="text-text-primary text-lg font-medium mb-1">Page not found</p>
      <p className="text-text-muted text-sm mb-6">
        The page you're looking for doesn't exist.
      </p>
      <button onClick={() => navigate("/dashboard")} className="btn-primary">
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFound;