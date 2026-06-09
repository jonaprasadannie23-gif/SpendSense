const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

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

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
}

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

export function validateRegisterFields(username, password, confirmPassword) {
  const errors = { username: "", password: "", confirmPassword: "", general: "" };
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

  return { valid, errors };
}
