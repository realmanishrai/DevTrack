function Navbar() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="DevTrack home">
        DevTrack
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#why-devtrack">Why DevTrack</a>
        <a href="#features">Features</a>
        <a href="#statistics">Statistics</a>
      </nav>

      <div className="site-actions">
        <button className="button button--primary" type="button">
          Log In
        </button>
      </div>
    </header>
  )
}

export default Navbar