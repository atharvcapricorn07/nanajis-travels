(function () {
  'use strict';

  /* ============================================================
     NANAJI'S TRAVELOGUE — Shared Navigation
     File location : src/content/nav.js
     Usage in every travel page (international / india / usa / temples):
       <script src="../nav.js"></script>
     Usage in index.html (site root):
       <script src="src/content/nav.js"></script>
  ============================================================ */

  /* ── 1. RESOLVE PATHS ───────────────────────────────────────
     All travel pages live one level inside src/content/, e.g.
       src/content/international/bestofeurope.html
       src/content/india/kerala.html
     So from any travel page:
       ../  = src/content/          (sibling folders)
       ../../  = src/               (not used)
       ../../../  = site root       (index.html)
     index.html is at site root, so paths start with src/content/
  ─────────────────────────────────────────────────────────── */
  var isRoot = !window.location.pathname.match(/\/src\/content\//);
  var toRoot = isRoot ? ''                : '../../../';
  var toContent = isRoot ? 'src/content/' : '../';

  /* ── 2. INJECT CSS ──────────────────────────────────────────*/
  var css = `
    .site-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      height: 72px;
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 56px;
      background: rgba(253,252,250,.97);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(201,186,165,.4);
      box-shadow: 0 2px 16px rgba(46,64,87,.07);
      font-family: 'Lato', Arial, sans-serif;
      box-sizing: border-box;
    }
    .site-logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.2rem; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      text-decoration: none;
      display: flex; align-items: center; gap: 10px;
      color: #2E4057;
      white-space: nowrap;
    }
    .site-logo-mark {
      width: 28px; height: 28px; flex-shrink: 0;
      border: 1.5px solid #C9883A; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #C9883A; font-size: .6rem;
    }
    .site-nav { display: flex; gap: 2px; align-items: center; }
    .site-dropdown { position: relative; display: inline-block; }
    .site-dropbtn, .site-home-btn {
      background: none; border: none;
      font-family: 'Lato', Arial, sans-serif;
      font-size: .78rem; font-weight: 500;
      letter-spacing: 2.2px; text-transform: uppercase;
      padding: 10px 16px; cursor: pointer;
      transition: color .25s; position: relative;
      color: #4E4A44;
    }
    .site-dropbtn::after, .site-home-btn::after {
      content: ''; position: absolute; bottom: 4px; left: 16px; right: 16px;
      height: 1px; background: #C9883A;
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s ease;
    }
    /* ── Desktop hover — ONLY on real pointer devices ───────
       This media query is false on touchscreens, so the CSS
       hover state never activates on mobile. This is the key
       fix that prevents the double-tap bug on real devices.  */
    @media (hover: hover) and (pointer: fine) {
      .site-dropdown:hover .site-dropbtn { color: #C9883A; }
      .site-dropdown:hover .site-dropbtn::after { transform: scaleX(1); }
      .site-dropdown:hover .site-dropdown-content { display: block; }
      .site-home-btn:hover { color: #C9883A; }
      .site-home-btn:hover::after { transform: scaleX(1); }
    }
    /* Active class used by JS on all devices */
    .site-dropdown.active .site-dropbtn { color: #C9883A; }
    .site-dropdown.active .site-dropbtn::after { transform: scaleX(1); }
    .site-dropdown-content {
      display: none; position: absolute;
      top: 100%; right: 0; min-width: 230px; z-index: 1001;
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
      transition: background .2s, color .2s, padding-left .2s;
    }
    .site-dropdown-inner a:last-child { border-bottom: none; }
    .site-dropdown-inner a:hover,
    .site-dropdown-inner a:focus {
      background: #F7F0E3; color: #C0664A; padding-left: 28px;
      outline: none;
    }

    /* ── Mobile: two-row header ─────────────────────────────*/
    @media (max-width: 768px) {
      body { padding-top: 96px !important; }
      .site-header {
        height: auto;
        flex-direction: column;
        align-items: center;
        padding: 12px 16px 0;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        background: rgba(253,252,250,.99);
      }
      .site-logo { padding-bottom: 10px; font-size: 1rem; }
      .site-nav {
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
      .site-dropbtn, .site-home-btn {
        font-size: .62rem; letter-spacing: 1.5px;
        padding: 10px 12px; white-space: nowrap;
      }
      /* On mobile, dropdowns open as full-width panels below the header.
         Position is set dynamically by JS so it always sits flush
         under the two-row header regardless of content height.         */
      .site-dropdown.active .site-dropdown-content {
        position: fixed; left: 0; right: 0;
        min-width: 100%; z-index: 9999;
      }
      .site-dropdown-inner {
        margin-top: 0; border-radius: 0;
        border-left: none; border-right: none;
        max-height: 60vh; overflow-y: auto;
      }
    }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 3. BUILD & INJECT HTML ─────────────────────────────────*/
  var i = toContent + 'international/';
  var ind = toContent + 'india/';
  var usa = toContent + 'usa/';
  var tem = toContent + 'temples/';

  var header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-logo" href="${toRoot}index.html">
      <div class="site-logo-mark">✦</div>
      Nanaji's Travelogue
    </a>
    <nav class="site-nav">
      <div class="site-dropdown">
        <button class="site-dropbtn">Abroad</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${i}bestofeurope.html">Best of Europe</a>
          <a href="${i}bhutan.html">Bhutan</a>
          <a href="${i}central_europe.html">Central Europe</a>
          <a href="${i}china.html">China</a>
          <a href="${i}dubai.html">Dubai</a>
          <a href="${i}egypt.html">Egypt</a>
          <a href="${i}indonesia.html">Indonesia &amp; Bali</a>
          <a href="${i}muscat.html">Muscat</a>
          <a href="${i}nepal.html">Nepal</a>
          <a href="${i}scandinavian.html">Scandinavian Countries</a>
          <a href="${i}singapore.html">Singapore</a>
          <a href="${i}srilanka.html">Srilanka &amp; Maldives</a>
          <a href="${i}vietnam_combodia.html">Vietnam &amp; Cambodia</a>
        </div></div>
      </div>
      <div class="site-dropdown">
        <button class="site-dropbtn">India</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${ind}gujarat_rann.html">Gujarat Rann Festival</a>
          <a href="${ind}jaipur_agra.html">Jaipur &amp; Agra</a>
          <a href="${ind}karnataka.html">Karnataka</a>
          <a href="${ind}kerala.html">Kerala</a>
          <a href="${ind}madhyapradesh.html">Madhya Pradesh</a>
          <a href="${ind}northeast.html">Northeast India</a>
          <a href="${ind}punjab_himachal.html">Punjab &amp; Himachal</a>
          <a href="${ind}rajasthan.html">Rajasthan</a>
          <a href="${ind}uttarakhand.html">Uttarakhand</a>
          <a href="${ind}uttarpradesh.html">Uttar Pradesh</a>
        </div></div>
      </div>
      <div class="site-dropdown">
        <button class="site-dropbtn">USA</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${usa}bayarea.html">Bay Area California</a>
          <a href="${usa}california.html">Southern California</a>
          <a href="${usa}newyork.html">New York &amp; Washington DC</a>
          <a href="${usa}seattle.html">Seattle</a>
          <a href="${usa}alaska.html">Alaska</a>
        </div></div>
      </div>
      <div class="site-dropdown">
        <button class="site-dropbtn">Temples</button>
        <div class="site-dropdown-content"><div class="site-dropdown-inner">
          <a href="${tem}andhrapradesh.html">Andhra Odyssey</a>
          <a href="${tem}ashtavinayak.html">Ashtavinayak</a>
          <a href="${tem}shegaon.html">Shegaon Diary</a>
          <a href="${tem}tamilnadu.html">Tamilnadu Temple Trail</a>
        </div></div>
      </div>
      <div class="site-dropdown">
        <button class="site-home-btn" onclick="window.location.href='${toRoot}index.html'">Home</button>
      </div>
    </nav>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  /* ── 4. DROPDOWN LOGIC ──────────────────────────────────────
     Single toggle function used by both desktop (click) and
     mobile (touchend). On mobile we use touchend + preventDefault
     to consume the event before the browser synthesises a click,
     which is what caused the original double-tap bug.
  ─────────────────────────────────────────────────────────── */
  function toggle(btn) {
    var dd = btn.parentElement;
    var opening = !dd.classList.contains('active');
    /* Close all first */
    document.querySelectorAll('.site-dropdown').forEach(function (d) {
      d.classList.remove('active');
    });
    if (opening) {
      dd.classList.add('active');
      /* On mobile, position the dropdown flush below the header */
      if (window.innerWidth <= 768) {
        var panel = dd.querySelector('.site-dropdown-content');
        if (panel) {
          panel.style.top = header.getBoundingClientRect().bottom + 'px';
        }
      }
    }
  }

  /* Attach to every dropbtn (not home btn) */
  header.querySelectorAll('.site-dropbtn').forEach(function (btn) {
    /* Desktop: plain click */
    btn.addEventListener('click', function (e) {
      toggle(this);
      e.stopPropagation();
    });
    /* Mobile: touchend fires before the synthesised click.
       preventDefault() stops the browser generating that click,
       so toggle() only runs once per tap.                       */
    btn.addEventListener('touchend', function (e) {
      e.preventDefault();
      toggle(this);
    });
  });

  /* Close on tap/click anywhere outside the header */
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
