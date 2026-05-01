## 2025-05-24 - Missing Input Validation in AI Flow Schemas
**Vulnerability:** The Zod schemas for the Genkit AI flows (`ai-pose-guide.ts`, `ai-social-share-suggestions.ts`, `ai-style-assistant-flow.ts`) lacked strict validation for `photoDataUri` and text input fields. `photoDataUri` could accept arbitrary strings, leading to Server-Side Request Forgery (SSRF) and Denial of Service (DoS) risks from unbounded large strings. Text inputs lacked length limits, enabling Prompt Injection and DoS.
**Learning:** In AI applications using Genkit and Zod schemas, user inputs are directly passed into the AI flows. Any unbounded string input or poorly validated URI is a significant security vector for SSRF, DoS, and Prompt Injections.
**Prevention:** Always add `.regex()` for URIs/formats to enforce specific patterns (like base64 image data URIs) and `.max()` length limits for both string and file-based data fields to prevent malicious manipulation.

## 2026-04-21 - Missing Security Headers in Next.js Config
**Vulnerability:** The application was missing basic security headers (e.g., X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security) in its Next.js configuration. This left the application vulnerable to basic attacks like MIME-type sniffing, clickjacking, and man-in-the-middle attacks.
**Learning:** By default, Next.js does not enforce these security headers. They must be explicitly configured using the `headers()` async function in `next.config.ts`.
**Prevention:** Always include a baseline set of security headers via the `headers()` configuration in `next.config.ts` to enforce secure defaults for all routes globally.
## 2026-04-23 - Syntax Errors in Permissions-Policy Headers
**Vulnerability:** The `Permissions-Policy` header had a syntax error (`camera=self` instead of `camera=(self)`). This causes the browser to ignore the directive or the entire policy, reducing the effectiveness of the intended security configuration.
**Learning:** `Permissions-Policy` allows lists must always be wrapped in parentheses (e.g., `camera=(self)` or `geolocation=()`).
**Prevention:** Always verify the correct W3C syntax for `Permissions-Policy` and similar headers when implementing them, rather than relying on intuitive but incorrect syntax like `key=value`.
## 2025-05-24 - Missing CSS Injection Sanitization in Chart Container
**Vulnerability:** The shadcn/ui chart component (`src/components/ui/chart.tsx`) was vulnerable to CSS and HTML injection through the `id` property. The component used the provided `id` directly inside a `<style>` block rendered with `dangerouslySetInnerHTML`. If an attacker gained control over the `id` prop, they could inject arbitrary HTML (e.g. `</style><script>alert(1)</script>`) or malicious CSS.
**Learning:** `dangerouslySetInnerHTML` is commonly used in UI libraries for styling dynamic components, but passing unsanitized props like `id` into these blocks is a common vector for XSS and CSS injection attacks.
**Prevention:** Always explicitly sanitize user-provided values like `id` before injecting them into HTML/CSS string contexts. For IDs, enforce strict whitelisting of safe characters using regex (e.g., `replace(/[^a-zA-Z0-9-]/g, "")`).

## 2025-05-24 - Insecure Cookie Configuration
**Vulnerability:** The application manually set a cookie for sidebar state (`document.cookie`) without the `SameSite` and `Secure` attributes.
**Learning:** Manually setting cookies via `document.cookie` in client-side code bypasses framework-level cookie security defaults. This leaves the cookie vulnerable to cross-site request forgery (CSRF) if `SameSite` is not configured, and susceptible to interception if `Secure` is omitted.
**Prevention:** Always append `; SameSite=Lax; Secure` (or `SameSite=Strict`) when manually setting cookies to enforce secure transmission and prevent CSRF.
