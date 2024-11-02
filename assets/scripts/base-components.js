class snapsTopNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header>
    <div class="container">
      <a href="https://snapsedu.com/" class="logo"><img src="https://snapsedu.com/assets/images/logo.png" alt="Logo"
          class="logo"></a>
      <nav>
        <ul>
          <li><a href="https://snapsedu.com/">Home</a></li>
          <li><a href="https://snapsedu.com/papers.html">Question Papers</a></li>
          <li><a href="https://snapsedu.com/notes.html">Notes</a></li>
          <li><a href="https://snapsedu.com/contact.html">Contact us</a></li>
        </ul>
      </nav>
    </div>
  </header>`
  }
}

customElements.define('snaps-top-nav', snapsTopNav);
///////////////////////////////////////////////////////////////////


class snapsBottomNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <footer>
        <div class="container">
            <p>&copy; 2024 SNAPS Education. All Rights Reserved.</p>
            <p><a href="https://snapsedu.com/contact.html">Contact</a> <a
                    href="https://snapsedu.com/about.html">About</a></p>
        </div>
    </footer>`
  }
}

customElements.define('snaps-bottom-nav', snapsBottomNav);
///////////////////////////////////////////////////////////////////

