const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

// ─── Username validation ───────────────────────────────────────────────────

export function validateUsername(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Please enter your username";
  }

  if (trimmed.length < 4) {
    return "Username must be at least 4 characters";
  }

  if (trimmed.length > 20) {
    return "Username must be no more than 20 characters";
  }

  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  return "";
}

// ─── Username checklist rules (for live UI feedback) ──────────────────────

export function getUsernameRules(value) {
  const trimmed = value.trim();
  return [
    {
      label: "4–20 characters",
      met: trimmed.length >= 4 && trimmed.length <= 20,
    },
    {
      label: "Letters, numbers, and underscore only",
      met: trimmed.length > 0 && USERNAME_PATTERN.test(trimmed),
    },
  ];
}

// ─── Password validation ───────────────────────────────────────────────────

export function validatePassword(value) {
  if (!value) {
    return "Please enter your password";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number";
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must contain at least one special character";
  }

  return "";
}

// ─── Password checklist rules (for live UI feedback) ──────────────────────

export function getPasswordRules(value) {
  return [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(value) },
    { label: "One lowercase letter", met: /[a-z]/.test(value) },
    { label: "One number", met: /[0-9]/.test(value) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(value) },
  ];
}

// ─── Password strength score (0–4) ────────────────────────────────────────

export function getPasswordStrength(value) {
  if (!value) return { score: 0, label: "", level: "none" };

  const rules = getPasswordRules(value);
  const metCount = rules.filter((r) => r.met).length;

  // Also bonus for length >= 12
  const lengthBonus = value.length >= 12 ? 1 : 0;
  const raw = metCount + lengthBonus;

  if (raw <= 2) return { score: 1, label: "Weak", level: "weak" };
  if (raw <= 4) return { score: 2, label: "Medium", level: "medium" };
  return { score: 3, label: "Strong", level: "strong" };
}

// ─── Confirm password ──────────────────────────────────────────────────────

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
}

// ─── Composite validators ──────────────────────────────────────────────────

export function validateLoginFields(username, password) {
  const errors = { username: "", password: "", confirmPassword: "", general: "" };
  let valid = true;

  if (!username.trim()) {
    errors.username = "Please enter your username";
    valid = false;
  }

  if (!password) {
    errors.password = "Please enter your password";
    valid = false;
  }

  return { valid, errors };
}

export function validateRegisterFields(username, password, confirmPassword, income) {
  const errors = {
    username: "",
    password: "",
    confirmPassword: "",
    income: "",
    general: "",
  };
  let valid = true;

  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
    valid = false;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
    valid = false;
  }

  const confirmError = validateConfirmPassword(password, confirmPassword);
  if (confirmError) {
    errors.confirmPassword = confirmError;
    valid = false;
  }

  const incomeNum = Number(income);
  if (income === "" || income === null || income === undefined) {
    errors.income = "Please enter your monthly income";
    valid = false;
  } else if (isNaN(incomeNum) || incomeNum <= 0) {
    errors.income = "Please enter a valid income greater than 0";
    valid = false;
  }

  return { valid, errors };
}

export function validateChangePasswordFields(currentPassword, newPassword, confirmPassword) {
  const errors = { currentPassword: "", newPassword: "", confirmPassword: "", general: "" };
  let valid = true;

  if (!currentPassword) {
    errors.currentPassword = "Please enter your current password";
    valid = false;
  }

  const newPasswordError = validatePassword(newPassword);
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
    valid = false;
  }

  const confirmError = validateConfirmPassword(newPassword, confirmPassword);
  if (confirmError) {
    errors.confirmPassword = confirmError;
    valid = false;
  }

  return { valid, errors };
}
