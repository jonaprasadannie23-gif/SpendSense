import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateLoginFields,
  validateRegisterFields,
} from "./authValidation";

const API_BASE = "https://spendsense-1fam.onrender.com";

const emptyErrors = {
  username: "",
  password: "",
  confirmPassword: "",
  general: "",
};

export default function AuthForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [income, setIncome] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  const getErrorMessage = (error, fallback) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (!error.response) {
        return "Unable to connect. Please check your internet connection and try again.";
      }
      return fallback;
    }
    return fallback;
  };

  const loginUser = async () => {
    const { valid, errors: validationErrors } = validateLoginFields(
      username,
      password
    );

    if (!valid) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    setIsLoading(true);
    setErrors(emptyErrors);

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        username: username.trim(),
        password,
      });

      if (response.data.success) {
        onLoginSuccess(response.data.user_id, response.data.income);
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            response.data.message || "Invalid username or password. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: getErrorMessage(
          error,
          "Login failed. Please try again later."
        ),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async () => {
    const { valid, errors: validationErrors } = validateRegisterFields(
      username,
      password,
      confirmPassword
    );

    if (!valid) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    setIsLoading(true);
    setErrors(emptyErrors);

    try {
      await axios.post(`${API_BASE}/register`, {
        username: username.trim(),
        password,
        income,
      });

      alert("Registration Successful");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setIncome("");
      setIsRegistering(false);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: getErrorMessage(
          error,
          "Registration failed. Please try again later."
        ),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    if (isRegistering) {
      registerUser();
    } else {
      loginUser();
    }
  };

  const resetForm = () => {
    setErrors(emptyErrors);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setConfirmPassword("");
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    resetForm();
  };

  return (
    <div className="container auth-page">
      <div className="auth-container">
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        {errors.general && (
          <div className="auth-error" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="auth-username" className="auth-label">
              Username
            </label>
            <input
              id="auth-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              autoComplete="username"
              disabled={isLoading}
              maxLength={20}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                [
                  isRegistering ? "username-hint" : null,
                  errors.username ? "username-error" : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              onChange={(e) => {
                setUsername(e.target.value);
                clearFieldError("username");
              }}
            />
            {isRegistering && (
              <p id="username-hint" className="auth-hint">
                4–20 characters; letters, numbers, and underscores only
              </p>
            )}
            {errors.username && (
              <p id="username-error" className="field-error" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password" className="auth-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                autoComplete={isRegistering ? "new-password" : "current-password"}
                disabled={isLoading}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  [
                    isRegistering ? "password-hint" : null,
                    errors.password ? "password-error" : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {isRegistering && (
              <p id="password-hint" className="auth-hint">
                At least 8 characters with uppercase, lowercase, a number, and a
                special character
              </p>
            )}
            {errors.password && (
              <p id="password-error" className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {isRegistering && (
            <>
              <div className="auth-field">
                <label htmlFor="auth-confirm-password" className="auth-label">
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword ? "confirm-password-error" : undefined
                    }
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={isLoading}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="field-error"
                    role="alert"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="auth-income" className="auth-label">
                  Monthly Income
                </label>
                <input
                  id="auth-income"
                  type="number"
                  placeholder="Enter your monthly income"
                  value={income}
                  disabled={isLoading}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading
              ? isRegistering
                ? "Registering..."
                : "Logging in..."
              : isRegistering
                ? "Register"
                : "Login"}
          </button>
        </form>

        <p
          className="auth-toggle-link"
          onClick={toggleMode}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleMode();
            }
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}
