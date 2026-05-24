export default function Header() {
  return (
    <header className="app-header">
      <div className="logo" aria-label="SplitWise">
        <svg className="logo-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="18" fill="url(#logoGrad)" />
          <path d="M10 13h6M10 18h16M10 23h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="13" r="3" fill="#fff" opacity="0.9" />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <span>SplitWise</span>
      </div>
      <p className="app-tagline">Split smarter, not harder</p>
    </header>
  );
}
