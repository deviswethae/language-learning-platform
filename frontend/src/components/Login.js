import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock, FaExclamationTriangle } from "react-icons/fa";
import Loader from "./Loader";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userEncoded = urlParams.get("user");

    if (token && userEncoded) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userEncoded));

        // Store token & user data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", decodedUser.name || "");
        localStorage.setItem("userData", JSON.stringify(decodedUser));

        // Redirect to select-language page
        navigate("/");
      } catch (err) {
        console.error("Google login parsing error:", err);
        setError("Something went wrong with Google login.");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, formData);
      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userData", JSON.stringify(user));

        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Direct to Google OAuth
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  if (loading) return <Loader />;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Continue your language learning journey</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <FaExclamationTriangle className="flex-shrink-0 me-2" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaEnvelope className="text-muted" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 ps-3"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaLock className="text-muted" />
              </span>
              <input
                type="password"
                name="password"
                className="form-control border-start-0 ps-3"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-medium rounded-3 mb-3"
            disabled={loading}
          >
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
            Login
          </button>
        </form>

        <div className="position-relative my-4">
          <hr className="text-muted" />
          <div className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted">
            or
          </div>
        </div>

        <button
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 mb-3 py-2 rounded-3 fw-medium"
          onClick={handleGoogleLogin}
          type="button"
        >
          <FcGoogle size={20} />
          Login with Google
        </button>

        <div className="d-flex justify-content-between mt-3">
          <small className="text-muted">
            New user?{" "}
            <Link to="/register" className="text-primary text-decoration-none fw-medium">
              Register
            </Link>
          </small>
          <small className="text-muted">
            <Link to="/forgot-password" className="text-primary text-decoration-none fw-medium">
              Forgot password?
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
