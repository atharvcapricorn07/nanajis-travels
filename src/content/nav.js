(function () {
  /* ============================================================
     NANAJI'S TRAVELOGUE — Shared Navigation
     Place this file at: src/content/nav.js
     Include in every travel page with:
       <script src="../nav.js"></script>
     (adjust path if page is deeper, e.g. "../nav.js" from international/india/usa/temples folders)
  ============================================================ */

  /* ── 1. INJECT CSS ───────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lato:wght@300;400;500;700&display=swap');

    /* ── SHARED NAV BAR ───────────────────────────────────── */
    .site-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      height: 72px;
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 56px;
      background: rgba(253,252,250,.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(201,186,165,.4);
      box-shadow: 0 2px 16px rgba(46,64,87,.07);
      font-family: 'Lato', Arial, sans-serif;
    }
    .site-logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.2rem; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      text-decoration: none;
      display: flex; align-items: center; gap: 10px;
      color: #2E4057;
    }
    .site-logo-mark {
      width: 28px; height: 28px;
      border: 1.5px solid #C9883A; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #C9883A; font-size: .6rem; flex-shrink: 0;
    }
    .site-nav { display: flex; gap: 2px; }
    .site-dropdown { position: relative; display: inline-block; }
    .site-dropbtn {
      background: none; border: none;
      color: #4E4A44;
      font-family: 'Lato', Arial, sans-serif;
      font-size: .78rem; font-weight: 500;
      letter-spacing: 2.2px; text-transform: uppercase;
      padding: 10px 16px; cursor: pointer;
      transition: color .25s; position: relative;
    }
    .site-dropbtn::after {
      content: ''; position: absolute; bottom: 4px; left: 16px; right: 16px;
      height: 1px; background: #C9883A;
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s ease;
    }
    .site-dropdown-content {
      display: none; position: absolute;
      top: 100%; right: 0; min-width: 230px; z-index: 300;
    }
    /* CSS hover only on real pointer devices — prevents double-tap bug on mobile */
    @media (hover: hover) and (pointer: fine) {
      .site-dropdown:hover .site-dropbtn { color: #C9883A; }
      .site-dropdown:hover .site-dropbtn::after { transform: scaleX(1); }
      .site-dropdown:hover .site-dropdown-content { display: block; }
    }
    .site-dropdown.active .site-dropdown-content { display: block; }
    .site-dropdown-inner {
      margin-top: 8px;
      background: #FDFCFA;
      border: 1px solid rgba(201,186,165,.4);
      border-radius: 4px;
      box-shadow: 0 12px 40px rgba(46,64,87,.14);
      overflow: hidden;
    }
    .site-dropdown-inner a {
      display: block; padding: 10px 20px;
      color: #4E4A44;
      font-family: 'Lato', Arial, sans-serif;
      font-size: .85rem; letter-spacing: .3px;
      text-decoration: none;
      border-bottom: 1px solid rgba(201,186,165,.2);
      transition: all .2s;
    }
    .site-dropdown-inner a:last-child { border-bottom: none; }
    .site-dropdown-inner a:hover { background: #F7F0E3; color: #C0664A; padding-left: 28px; }
    .site-about-btn {
      background: none; border: none;
      color: #C0664A;
      font-family: 'Lato', Arial, sans-serif;
      font-size: .78rem; font-weight: 500;
      letter-spacing: 2.2px; text-transform: uppercase;
      padding: 10px 16px; cursor: pointer;
      transition: color .25s;
    }
    .site-about-btn:hover { color: #C9883A; }
    .site-home-btn {
      background: none; border: none;
      color: #4E4A44;
      font-family: 'Lato', Arial, sans-serif;
      font-size: .78rem; font-weight: 500;
      letter-spacing: 2.2px; text-transform: uppercase;
      padding: 10px 16px; cursor: pointer;
      transition: color .25s; position: relative;
    }
    .site-home-btn::after {
      content: ''; position: absolute; bottom: 4px; left: 16px; right: 16px;
      height: 1px; background: #C9883A;
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s ease;
    }
    .site-home-btn:hover { color: #C9883A; }
    .site-home-btn:hover::after { transform: scaleX(1); }

    /* ── MOBILE TWO-ROW NAV ───────────────────────────────── */
    @media (max-width: 768px) {
      body { padding-top: 96px !important; }
      .site-header {
        height: auto;
        flex-direction: column;
        align-items: center;
        padding: 12px 16px 0;
      }
      .site-logo { padding-bottom: 10px; font-size: 1rem; }
      .site-nav {
        display: flex;
        width: calc(100% + 32px);
        margin: 0 -16px;
        overflow-x: auto; overflow-y: visible;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        border-top: 1px solid rgba(201,186,165,.3);
        gap: 0; padding: 0 8px;
      }
      .site-nav::-webkit-scrollbar { display: none; }
      .site-dropdown { flex-shrink: 0; }
      .site-dropbtn { font-size: .62rem; letter-spacing: 1.5px; padding: 10px 12px; white-space: nowrap; }
      .site-dropdown-inner { margin-top: 0; border-radius: 0; border-left: none; border-right: none; max-height: 60vh; overflow-y: auto; }
      .site-dropdown-content { display: none; }
      .site-dropdown.active .site-dropdown-content { display: block; position: fixed; left: 0; right: 0; min-width: 100%; z-index: 9999; }
    }
  `;
  document.head.appendChild(style);

  /* ── 2. RESOLVE BASE PATH ────────────────────────────────── */
  /* Works out the relative path from the current page back to
     src/content/ so all nav links resolve correctly regardless
     of which subfolder the page lives in.                      */
  function basePath() {
    var path = window.location.pathname;
    // Find src/content/ in the path and build relative prefix
    var match = path.match(/\/src\/content\/(international|india|usa|temples)\//);
    if (match) {
      // All content folders are one level inside src/content/
      // so we go up one folder to reach siblings: ../
      return '../';
    }
    // Fallback: page is at root (shouldn't happen for travel pages)
    return 'src/content/';
  }

  var base = basePath();
  var root = base + '../../'; // back to site root from src/content/<folder>/

  /* ── 3. INJECT HTML ──────────────────────────────────────── */
  var nav = document.createElement('header');
  nav.className = 'site-header';
  nav.innerHTML = `
    <a class="site-logo" href="${root}index.html">
      <div class="site-logo-mark">✦</div>
      Nanaji's Travelogue
    </a>
    <nav class="site-nav">

      <div class="site-dropdown">
        <button class="site-dropbtn">Abroad</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${base}international/bestofeurope.html">Best of Europe</a>
          <a href="${base}international/bhutan.html">Bhutan</a>
          <a href="${base}international/central_europe.html">Central Europe</a>
          <a href="${base}international/china.html">China</a>
          <a href="${base}international/dubai.html">Dubai</a>
          <a href="${base}international/egypt.html">Egypt</a>
          <a href="${base}international/indonesia.html">Indonesia &amp; Bali</a>
          <a href="${base}international/muscat.html">Muscat</a>
          <a href="${base}international/nepal.html">Nepal</a>
          <a href="${base}international/scandinavian.html">Scandinavian Countries</a>
          <a href="${base}international/singapore.html">Singapore</a>
          <a href="${base}international/srilanka.html">Srilanka</a>
          <a href="${base}international/vietnam_combodia.html">Vietnam &amp; Cambodia</a>
        </div></div>
      </div>

      <div class="site-dropdown">
        <button class="site-dropbtn">India</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${base}india/gujarat_rann.html">Gujarat Rann Festival</a>
          <a href="${base}india/jaipur_agra.html">Jaipur &amp; Agra</a>
          <a href="${base}india/karnataka.html">Karnataka</a>
          <a href="${base}india/kerala.html">Kerala</a>
          <a href="${base}india/madhyapradesh.html">Madhya Pradesh</a>
          <a href="${base}india/northeast.html">Northeast India</a>
          <a href="${base}india/punjab_himachal.html">Punjab &amp; Himachal</a>
          <a href="${base}india/rajasthan.html">Rajasthan</a>
          <a href="${base}india/uttarakhand.html">Uttarakhand</a>
          <a href="${base}india/uttarpradesh.html">Uttar Pradesh</a>
        </div></div>
      </div>

      <div class="site-dropdown">
        <button class="site-dropbtn">USA</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${base}usa/bayarea.html">Bay Area California</a>
          <a href="${base}usa/california.html">Southern California</a>
          <a href="${base}usa/newyork.html">New York &amp; Washington DC</a>
          <a href="${base}usa/seattle.html">Seattle</a>
          <a href="${base}usa/alaska.html">Alaska</a>
        </div></div>
      </div>

      <div class="site-dropdown">
        <button class="site-dropbtn">Temples</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${base}temples/andhrapradesh.html">Andhra Odyssey</a>
          <a href="${base}temples/ashtavinayak.html">Ashtavinayak</a>
          <a href="${base}temples/shegaon.html">Shegaon Diary</a>
          <a href="${base}temples/tamilnadu.html">Tamilnadu Temple Trail</a>
        </div></div>
      </div>

      <div class="site-dropdown">
        <button class="site-home-btn" onclick="window.location.href='${root}index.html'">Home</button>
      </div>

    </nav>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  /* ── 4. DROPDOWN LOGIC ───────────────────────────────────── */
  function toggleNav(btn) {
    var dd = btn.parentElement;
    var isActive = dd.classList.contains('active');
    document.querySelectorAll('.site-dropdown').forEach(function (d) {
      d.classList.remove('active');
    });
    if (!isActive) {
      dd.classList.add('active');
      // On mobile, pin dropdown below the header using fixed positioning
      if (window.innerWidth <= 768) {
        var content = dd.querySelector('.site-dropdown-content');
        if (content) {
          content.style.top = nav.getBoundingClientRect().bottom + 'px';
        }
      }
    }
  }

  // Attach toggle to all dropbtns (not home btn)
  nav.querySelectorAll('.site-dropbtn').forEach(function (btn) {
    // Click handler for desktop
    btn.addEventListener('click', function () { toggleNav(this); });
    // touchend for real mobile — fires before synthesized click, preventDefault stops double-fire
    btn.addEventListener('touchend', function (e) {
      e.preventDefault();
      toggleNav(this);
    });
  });

  // Close when tapping/clicking outside the nav
  document.addEventListener('touchstart', function (e) {
    if (!e.target.closest('.site-header')) {
      document.querySelectorAll('.site-dropdown').forEach(function (d) {
        d.classList.remove('active');
      });
    }
  }, { passive: true });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header')) {
      document.querySelectorAll('.site-dropdown').forEach(function (d) {
        d.classList.remove('active');
      });
    }
  });

})();
