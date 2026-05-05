import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processGoogleLogin = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        toast.error('No authorization code received from Google');
        navigate('/login');
        return;
      }

      try {
        const redirect_uri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/auth/google`, {
          code,
          redirect_uri
        });

        const { access_token, role, username, setup_completed } = response.data;
        
        login(access_token, role, username, setup_completed);
        toast.success('Successfully logged in with Google');
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Google login error:', err);
        toast.error(err.response?.data?.detail || 'Failed to login with Google');
        navigate('/login');
      }
    };

    processGoogleLogin();
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] text-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto" />
        <h2 className="text-xl font-bold">Authenticating with Google...</h2>
        <p className="text-slate-400 text-sm">Please wait while we set up your session.</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
