## 2024-05-24 - [CRITICAL] Unvalidated Input to Genkit AI Flows
**Vulnerability:** The AI flows in `src/ai/flows` (Pose Guide, Social Share, Style Assistant) accepted raw strings without limits or structure enforcement, leading to potential SSRF (if Genkit attempts to fetch an arbitrary URL instead of using a `data:image/` URI) and Denial of Service/Prompt Injection (due to unbounded string length for context/descriptions).
**Learning:** Genkit inputs must be strictly validated before passing them to the model, especially when expecting specific formats like base64 image data.
**Prevention:** Always use Zod's `.startsWith()`, `.url()`, `.max()`, and similar constraint methods on AI flow inputs.
