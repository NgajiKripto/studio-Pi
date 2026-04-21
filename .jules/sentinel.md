## 2025-05-24 - Missing Input Validation in AI Flow Schemas
**Vulnerability:** The Zod schemas for the Genkit AI flows (`ai-pose-guide.ts`, `ai-social-share-suggestions.ts`, `ai-style-assistant-flow.ts`) lacked strict validation for `photoDataUri` and text input fields. `photoDataUri` could accept arbitrary strings, leading to Server-Side Request Forgery (SSRF) and Denial of Service (DoS) risks from unbounded large strings. Text inputs lacked length limits, enabling Prompt Injection and DoS.
**Learning:** In AI applications using Genkit and Zod schemas, user inputs are directly passed into the AI flows. Any unbounded string input or poorly validated URI is a significant security vector for SSRF, DoS, and Prompt Injections.
**Prevention:** Always add `.regex()` for URIs/formats to enforce specific patterns (like base64 image data URIs) and `.max()` length limits for both string and file-based data fields to prevent malicious manipulation.

## 2026-04-21 - Missing Security Headers in Next.js Config
**Vulnerability:** The application was missing basic security headers (e.g., X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security) in its Next.js configuration. This left the application vulnerable to basic attacks like MIME-type sniffing, clickjacking, and man-in-the-middle attacks.
**Learning:** By default, Next.js does not enforce these security headers. They must be explicitly configured using the `headers()` async function in `next.config.ts`.
**Prevention:** Always include a baseline set of security headers via the `headers()` configuration in `next.config.ts` to enforce secure defaults for all routes globally.
