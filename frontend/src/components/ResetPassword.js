// 📁 frontend/src/components/ResetPassword.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reset-password/${token}`,
        { password }
      );
      setSuccess(true);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="card-title mb-3 text-center">🔒 Reset Your Password</h3>
              <p className="text-muted text-center mb-4">
                Enter your new password below. Make sure it’s strong and easy to remember.
              </p>
              <form onSubmit={handleReset}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </form>
              {message && (
                <div
                  className={`alert mt-4 ${success ? "alert-success" : "alert-danger"}`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              {success && (
                <div className="text-center mt-3">
                  <small>Redirecting to login page...</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
