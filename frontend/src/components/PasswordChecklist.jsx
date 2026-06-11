/**
 * PasswordChecklist
 * Renders a live checklist using styled checkbox indicators.
 * No bullet points. Consistent alignment. Read-only visual state.
 * Accepts: rules = [{ label: string, met: boolean }]
 */
export default function PasswordChecklist({ rules, heading }) {
  if (!rules || rules.length === 0) return null;

  return (
    <div className="password-checklist" role="list" aria-label={heading || "Requirements"}>
      {heading && <p className="checklist-heading">{heading}</p>}
      {rules.map((rule) => (
        <div
          key={rule.label}
          className={`checklist-row ${rule.met ? "checklist-met" : "checklist-unmet"}`}
          role="listitem"
          aria-label={`${rule.label}: ${rule.met ? "satisfied" : "not satisfied"}`}
        >
          <span className="checklist-box" aria-hidden="true">
            {rule.met ? "☑" : "☐"}
          </span>
          <span className="checklist-text">{rule.label}</span>
        </div>
      ))}
    </div>
  );
}
