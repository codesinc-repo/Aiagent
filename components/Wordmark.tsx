// Typographic wordmark. To use the real logo, drop it at /public/logo.png and
// replace this component's body with <img src="/logo.png" alt="RALU" />.
export default function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className={`wordmark${small ? " wordmark--sm" : ""}`} aria-label="RALU, Recognize & Level Up">
      <span className="wordmark__big">RALU</span>
      <span className="wordmark__small">Recognize &amp; Level Up</span>
    </span>
  );
}
