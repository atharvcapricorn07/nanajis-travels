/**
 * node fix_clean.cjs
 * Clean-slate fix for mobile nav dropdowns in all destination pages.
 * Rewrites the entire dropdown JS block from scratch regardless of current state.
 */
const fs = require('fs');
const path = require('path');

// ── The only JS needed ────────────────────────────────────────────────────────
const NAV_JS = `<script>
function toggleNav(el) {
    var dd = el.parentElement;
    var isActive = dd.classList.contains('active');
    document.querySelectorAll('.site-dropdown').forEach(function(d) {
        d.classList.remove('active');
    });
    if (!isActive) {
        dd.classList.add('active');
    }
}
document.addEventListener('click', function(e) {
    if (!e.target.closest('.site-dropdown')) {
        document.querySelectorAll('.site-dropdown').forEach(function(d) {
            d.classList.remove('active');
        });
    }
});
</script>`;

// ── The only CSS needed (replaces mobile dropdown lines) ──────────────────────
const OLD_DROPDOWN_CSS_RE = /\.site-dropdown-content \{[^}]*\}\s*\n\s*\.site-dropdown\.active[^\n]+/g;
const NEW_DROPDOWN_CSS =
`.site-dropdown-content { display: none; }
            .site-dropdown.active .site-dropdown-content {
                display: block;
                position: fixed;
                left: 0;
                right: 0;
                top: 96px;
                min-width: 100%;
                z-index: 9999;
            }`;

function patchFile(filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    var p = html.replace(/\r\n/g, '\n');

    // 1. Remove ALL existing toggleNav / DROPDOWN script blocks entirely
    p = p.replace(/<script>\s*\n?\/\* ── DROPDOWNS[\s\S]*?<\/script>/g, '');
    p = p.replace(/<script>\s*\n?\s*var _navTouchHandled[\s\S]*?<\/script>/g, '');
    p = p.replace(/<script>\s*\n?function toggleNav[\s\S]*?<\/script>/g, '');

    // 2. Add onclick to buttons that don't have it
    p = p.replace(
        /<button class="site-dropbtn"(?![^>]*onclick)>([^<]+)<\/button>/g,
        '<button class="site-dropbtn" onclick="toggleNav(this)">$1</button>'
    );

    // 3. Fix the mobile dropdown CSS
    // Find the @media block and replace the dropdown-content rules inside it
    p = p.replace(OLD_DROPDOWN_CSS_RE, function(match) {
        // Only replace if inside @media (i.e. has indentation suggesting it's in a media query)
        if (match.indexOf('site-dropdown.active') !== -1) {
            return NEW_DROPDOWN_CSS;
        }
        return match;
    });

    // 4. Fix site-header on mobile: remove backdrop-filter, add overflow:visible
    p = p.replace(
        /\.site-header \{\s*\n(\s*)height: auto[^}]+\}/,
        function(m, indent) {
            if (m.includes('backdrop-filter: none')) return m; // already fixed
            return m.replace(
                'padding: 12px 16px 0;\n' + indent + '}',
                'padding: 12px 16px 0;\n' + indent + 'backdrop-filter: none;\n' + indent + '-webkit-backdrop-filter: none;\n' + indent + 'background: rgba(253,252,250,.98);\n' + indent + 'overflow: visible;\n' + indent + '}'
            );
        }
    );

    // 5. Inject clean NAV_JS just before </body>
    if (!p.includes('function toggleNav')) {
        p = p.replace('</body>', NAV_JS + '\n</body>');
    }

    var changed = p !== html.replace(/\r\n/g, '\n');
    if (changed) fs.writeFileSync(filePath, p.replace(/\n/g, '\r\n'), 'utf8');
    return changed;
}

function walkDir(dir, results) {
    results = results || [];
    if (!fs.existsSync(dir)) return results;
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function(entry) {
        var full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkDir(full, results);
        else if (entry.name.endsWith('.html')) results.push(full);
    });
    return results;
}

var root = __dirname;
var targets = walkDir(path.join(root, 'src', 'content'));
console.log('\nFound ' + targets.length + ' files\n');
var fixed = 0;
targets.sort().forEach(function(fp) {
    var rel = path.relative(root, fp);
    var changed = patchFile(fp);
    if (changed) { console.log('  FIXED   ' + rel); fixed++; }
    else          { console.log('  skip    ' + rel); }
});
console.log('\nDone — ' + fixed + '/' + targets.length + ' patched.\n');
console.log('  git add -A');
console.log('  git commit -m "Clean fix: mobile nav dropdowns"');
console.log('  git push\n');
