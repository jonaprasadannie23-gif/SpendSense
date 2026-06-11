import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateChangePasswordFields,
  getPasswordRules,
  getPasswordStrength,
} from "./authValidation";
import PasswordChecklist from "./PasswordChecklist";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const API_BASE = "https://spendsense-1fam.onrender.com";

const emptyErrors = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  general: "",
};

export default function ChangePasswordModal({ userId, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(emptyErrors);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const { valid, errors: validationErrors } = validateChangePasswordFields(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (!valid) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    setIsLoading(true);
    setErrors(emptyErrors);
    setSuccessMessage("");

    try {
      const response = await axios.post(`${API_BASE}/change-password`, {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data.success) {
        setSuccessMessage("Password updated successfully.");
        // Close after a short delay so user sees the success message
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: response.data.message || "Failed to update password.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Failed to update password. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Live derived values
  const passwordRules = getPasswordRules(newPassword);
  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="change-pwd-title">
      <div className="modal change-password-modal">
        <h3 id="change-pwd-title">Change Password</h3>

        {errors.general && (
          <div className="auth-error modal-error" role="alert">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="auth-success" role="status">
            ✓ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Current Password */}
          <div className="modal-field">
            <label htmlFor="cp-current" className="modal-label">
              Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="cp-current"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={Boolean(errors.currentPassword)}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  clearFieldError("currentPassword");
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrent((p) => !p)}
                disabled={isLoading}
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="field-error" role="alert">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="modal-field">
            <label htmlFor="cp-new" className="modal-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="cp-new"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={Boolean(errors.newPassword)}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearFieldError("newPassword");
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNew((p) => !p)}
                disabled={isLoading}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <PasswordStrengthMeter strength={passwordStrength} />
            <PasswordChecklist rules={passwordRules} />
            {errors.newPassword && (
              <p className="field-error" role="alert">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="modal-field">
            <label htmlFor="cp-confirm" className="modal-label">
              Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="cp-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={Boolean(errors.confirmPassword)}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmTouched(true);
                  clearFieldError("confirmPassword");
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((p) => !p)}
                disabled={isLoading}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmTouched && (
              <p className={`confirm-match ${passwordsMatch ? "match-ok" : "match-fail"}`} aria-live="polite">
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
            {errors.confirmPassword && (
              <p className="field-error" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn--primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
