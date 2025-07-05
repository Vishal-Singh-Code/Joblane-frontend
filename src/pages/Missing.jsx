import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

function Missing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md bg-card p-10 rounded-2xl shadow-lg border border-border">
        <div className="flex justify-center mb-6">
          <Frown size={48} className="text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! The page you're looking for doesn’t exist.</p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow hover:brightness-110 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default Missing;
