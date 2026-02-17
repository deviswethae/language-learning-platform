import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return setError("Passwords do not match.");
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, formData);
      setSuccess("Registration successful! Redirecting to login...");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Create an Account</h2>
          <p className="text-muted">Start your language learning journey</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FaCheck className="flex-shrink-0 me-2" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <FaCheck className="flex-shrink-0 me-2" />
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaUser className="text-muted" />
              </span>
              <input
                type="text"
                name="name"
                className="form-control border-start-0 ps-3"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Email address</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaEnvelope className="text-muted" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 ps-3"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaLock className="text-muted" />
              </span>
              <input
                type="password"
                name="password"
                className="form-control border-start-0 ps-3"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaLock className="text-muted" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                className="form-control border-start-0 ps-3"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-medium rounded-3 mb-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Register
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
          onClick={handleGoogleRegister}
          type="button"
        >
          <FcGoogle size={20} />
          Register with Google
        </button>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-primary text-decoration-none fw-medium">
              Login here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;