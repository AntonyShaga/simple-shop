function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container page footer-inner">
        <p className="footer-copy">© {new Date().getFullYear()} Padre Gino Pizza</p>

        <nav className="footer-nav" aria-label="Footer navigation">
          <ul className="footer-links">
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/privacy">Privacy</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
