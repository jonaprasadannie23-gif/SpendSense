import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateLoginFields,
  validateRegisterFields,
  getUsernameRules,
  getPasswordRules,
  getPasswordStrength,
} from "./authValidation";
import PasswordChecklist from "./PasswordChecklist";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const API_BASE = "https://spendsense-1fam.onrender.com";

const emptyErrors = {
  username: "",
  password: "",
  confirmPassword: "",
  income: "",
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

  // Only show confirm-match feedback after user starts typing in that field
  const [confirmTouched, setConfirmTouched] = useState(false);

  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  const getErrorMessage = (error, fallback) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) return error.response.data.message;
      if (!error.response)
        return "Unable to connect. Please check your internet connection and try again.";
      return fallback;
    }
    return fallback;
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const loginUser = async () => {
    const { valid, errors: validationErrors } = validateLoginFields(username, password);
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
        general: getErrorMessage(error, "Login failed. Please try again later."),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const registerUser = async () => {
    const { valid, errors: validationErrors } = validateRegisterFields(
      username,
      password,
      confirmPassword,
      income
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
        income: Number(income),
      });

      alert("Registration successful! You can now sign in.");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setIncome("");
      setConfirmTouched(false);
      setIsRegistering(false);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: getErrorMessage(error, "Registration failed. Please try again later."),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    isRegistering ? registerUser() : loginUser();
  };

  const resetForm = () => {
    setErrors(emptyErrors);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setConfirmPassword("");
    setConfirmTouched(false);
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    resetForm();
  };

  // ── Live derived state (registration only) ─────────────────────────────────
  const usernameRules = isRegistering ? getUsernameRules(username) : [];
  const passwordRules = isRegistering ? getPasswordRules(password) : [];
  const passwordStrength = isRegistering ? getPasswordStrength(password) : null;
  const passwordsMatch = password === confirmPassword;

  return (
    <div className="container auth-page">
      <div className="auth-container">

        {/* ── Branding header ── */}
        <div className="auth-header">
          <div className="auth-logo-mark">💰</div>
          <h1 className="auth-brand">SpendSense</h1>
          <p className="auth-tagline">Track smarter. Spend better.</p>
          <h2 className="auth-title">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

        {/* ── General error ── */}
        {errors.general && (
          <div className="auth-error" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Username ── */}
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
                  isRegistering ? "username-checklist" : null,
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
              <div id="username-checklist">
                <PasswordChecklist rules={usernameRules} />
              </div>
            )}
            {errors.username && (
              <p id="username-error" className="field-error" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          {/* ── Password ── */}
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
                    isRegistering ? "password-checklist" : null,
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
              <div id="password-checklist">
                <PasswordStrengthMeter strength={passwordStrength} />
                <PasswordChecklist rules={passwordRules} />
              </div>
            )}
            {errors.password && (
              <p id="password-error" className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* ── Registration-only fields ── */}
          {isRegistering && (
            <>
              {/* Confirm Password */}
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
                      [
                        confirmTouched ? "confirm-match-feedback" : null,
                        errors.confirmPassword ? "confirm-password-error" : null,
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmTouched(true);
                      clearFieldError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Live match feedback — appears only after user starts typing */}
                {confirmTouched && (
                  <p
                    id="confirm-match-feedback"
                    className={`confirm-match ${passwordsMatch ? "match-ok" : "match-fail"}`}
                    aria-live="polite"
                  >
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="field-error" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Monthly Income — required */}
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
                  min="1"
                  aria-invalid={Boolean(errors.income)}
                  aria-describedby={errors.income ? "income-error" : undefined}
                  onChange={(e) => {
                    setIncome(e.target.value);
                    clearFieldError("income");
                  }}
                />
                {errors.income && (
                  <p id="income-error" className="field-error" role="alert">
                    {errors.income}
                  </p>
                )}
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading
              ? isRegistering
                ? "Creating account…"
                : "Signing in…"
              : isRegistering
                ? "Create Account"
                : "Sign In"}
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
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </p>
      </div>
    </div>
  );
}
