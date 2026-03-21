/**
 * Run from the root of the nanajis-travels repo:
 *   node fix_dropdowns.js
 *
 * Patches every HTML file under src/content/ and root index.html,
 * replacing the old mobile dropdown JS and fixing CSS positioning.
 */

const fs = require('fs');
const path = require('path');

// ── NEW JS ───────────────────────────────────────────────────────────────────
const NEW_JS = `
    // ── DROPDOWN HANDLING (mobile + desktop) ──
    (function() {
        function closeAll() {
            document.querySelectorAll('.site-dropdown, .dropdown').forEach(function(d) {
                d.classList.remove('active');
            });
        }

        document.querySelectorAll('.site-dropdown, .dropdown').forEach(function(dd) {
            var btn = dd.querySelector('.site-dropbtn, .dropbtn');
            if (!btn) return;

            ['touchend', 'click'].forEach(function(evt) {
                btn.addEventListener(evt, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var isActive = dd.classList.contains('active');
                    closeAll();
                    if (!isActive) dd.classList.add('active');
                }, { passive: false });
            });
        });

        document.querySelectorAll('.site-dropdown-inner a, .dropdown-inner a').forEach(function(link) {
            link.addEventListener('touchend', function(e) {
                e.stopPropagation();
                var href = this.href;
                closeAll();
                setTimeout(function() { window.location.href = href; }, 50);
                e.preventDefault();
            }, { passive: false });
        });

        document.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.site-dropdown, .dropdown')) closeAll();
        }, { passive: true });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.site-dropdown, .dropdown')) closeAll();
        });
    })();`;

// ── OLD JS PATTERN ───────────────────────────────────────────────────────────
// Matches the if (window.matchMedia(...).matches) { ... } block
const OLD_JS_RE = /(?:\/\/[^\n]*[Mm]obile[^\n]*\n\s*)?if\s*\(\s*window\.matchMedia\([^)]+\)\.matches\s*\)\s*\{[\s\S]*?\n\s*\}/g;

// ── CSS FIXES ────────────────────────────────────────────────────────────────
const CSS_FIXES = [
    // Destination pages: .site-dropdown-content position:fixed → absolute
    [
        'position: fixed; top: auto; left: 0; right: 0; min-width: 100%; }',
        'position: absolute; top: 100%; left: 0; min-width: 220px; }'
    ],
    // index.html: .dropdown-content position:fixed → absolute
    [
        'position: fixed;\n                top: auto;\n                left: 0; right: 0;\n                min-width: 100%;',
        'position: absolute;\n                top: 100%;\n                left: 0;\n                min-width: 200px;'
    ],
];

function patchFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;

    // 1. Replace old JS
    html = html.replace(OLD_JS_RE, NEW_JS);

    // 2. Fix CSS
    for (const [oldStr, newStr] of CSS_FIXES) {
        html = html.split(oldStr).join(newStr);
    }

    const changed = html !== original;
    if (changed) fs.writeFileSync(filePath, html, 'utf8');
    return changed;
}

function walkDir(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkDir(full, results);
        else if (entry.name.endsWith('.html')) results.push(full);
    }
    return results;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
const root = __dirname;
const targets = [];

// Root index.html
const rootIndex = path.join(root, 'index.html');
if (fs.existsSync(rootIndex)) targets.push(rootIndex);

// All HTML files under src/content/
walkDir(path.join(root, 'src', 'content'), targets);

console.log(`Found ${targets.length} HTML files\n`);
let fixed = 0;
for (const filePath of targets.sort()) {
    const rel = path.relative(root, filePath);
    const changed = patchFile(filePath);
    if (changed) {
        console.log(`  FIXED   ${rel}`);
        fixed++;
    } else {
        console.log(`  skip    ${rel}`);
    }
}

console.log(`\nDone — ${fixed}/${targets.length} files patched.`);
