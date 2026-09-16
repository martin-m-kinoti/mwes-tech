import { useState } from 'react';
import './signIn.css';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleGoogleSignin = () => {
        // OAuth
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors('');


        try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            setErrors(data.message || 'Login failed. Please try again.');
            return;
        }
        navigate('/dashboard')
        
        } catch(err) {
        setErrors('Something went wrong. Please check your connection and try again');
        }
  };

  return (
    <>
      <section className="form-section">
        <div className="form-component">
          <div className="logo">
            <img className="logo-img" src="./mwes_logo.png" alt="company-logo" />
          </div>
          <div className="form-head">
            <h1>Sign In</h1>
          </div>

          <button className="btn-google" type="button" onClick={handleGoogleSignin}>
            <svg className="google-svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="divider"><span>or sign in with email</span></div>

          <form className="auth-form" id="signupForm" onSubmit={handleLogin}>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="yours@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Enter your password</label>
              <div className="pw-wrap">
                <input
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            {errors && <div className="form-error">{errors}</div>}

            <button type="submit" className="btn-submit" id="submitBtn">
              Sign Up
            </button>
          </form>

          <p className="login-link">
            Already have an account? 
            <Link to="/signup">
                Sign up
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default SignIn;