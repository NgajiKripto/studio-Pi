## 2025-02-28 - Secure Cookies in React Components
**Vulnerability:** Document cookie assignment without secure flags.
**Learning:** Found in `src/components/ui/sidebar.tsx` that cookie state for UI was not using `SameSite=Lax; Secure`. Even for UI state cookies, these flags are best practices for defense-in-depth against CSRF.
**Prevention:** Always append `SameSite=Lax; Secure` when mutating `document.cookie`.
