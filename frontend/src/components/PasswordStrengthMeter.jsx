/**
 * PasswordStrengthMeter
 * Renders a single filled progress bar with a label.
 * Visual: Password Strength  [████████░░]  Strong
 * Accepts: strength = { score: 0-3, label: string, level: 'none'|'weak'|'medium'|'strong' }
 */
export default function PasswordStrengthMeter({ strength }) {
  if (!strength || strength.level === "none") return null;

  // score 1 = weak (1/3), score 2 = medium (2/3), score 3 = strong (3/3)
  const fillPercent = (strength.score / 3) * 100;

  return (
    <div
      className={`strength-meter strength-meter--${strength.level}`}
      aria-label={`Password strength: ${strength.label}`}
    >
      <span className="strength-prefix">Password Strength</span>
      <div className="strength-track" aria-hidden="true">
        <div
          className={`strength-fill strength-fill--${strength.level}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <span className={`strength-label strength-label--${strength.level}`}>
        {strength.label}
      </span>
    </div>
  );
}
