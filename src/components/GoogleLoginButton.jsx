import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading("Signing you in...");

      try {
        const access_token = tokenResponse.access_token;
        const response = await axios.post('https://joblane-backend-0eqs.onrender.com/api/google/', { access_token });

        const { access, refresh, role } = response.data;
        googleLogin(access, refresh, role);

        toast.update(loadingToast, { render: "Login successful!", type: "success", isLoading: false, autoClose: 3000 });
        navigate('/');
      } catch (err) {
        console.error('Login failed:', err.response?.data || err.message);
        toast.update(loadingToast, {
          render: `Login failed: ${err.response?.data?.error || err.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      }
    },

    flow: 'implicit',
  });

  return (
    <button
      onClick={() => login()}
      className="flex-1 bg-gray-800 text-white py-3 rounded-xl flex items-center justify-center space-x-3 shadow-md hover:bg-gray-700 transition-colors duration-200"
    >
      <FcGoogle className="text-xl" />
      <span>Google</span>
    </button>
  );
};

export default GoogleLoginButton;
