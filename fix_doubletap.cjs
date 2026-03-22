/**
 * node fix_doubletap.cjs
 * Fixes the double-tap issue on real mobile devices.
 * Run from the root of the nanajis-travels repo.
 */
const fs = require('fs');
const path = require('path');

// The correct toggleNav that prevents the ghost click from closing the dropdown
const NEW_TOGGLE = `
/* ── DROPDOWNS ── */
var _navTouchHandled = false;
function toggleNav(el) {
    var dd = el.parentElement;
    var isActive = dd.classList.contains('active');
    document.querySelectorAll('.site-dropdown').forEach(function(d) { d.classList.remove('active'); });
    if (!isActive) {
        dd.classList.add('active');
        if (window.innerWidth <= 768) {
            var content = dd.querySelector('.site-dropdown-content');
            if (content) {
                var headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
                content.style.top = headerBottom + 'px';
            }
        }
    }
    _navTouchHandled = true;
    setTimeout(function() { _navTouchHandled = false; }, 400);
}
document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.site-dropdown')) {
        document.querySelectorAll('.site-dropdown').forEach(function(d) { d.classList.remove('active'); });
    }
}, { passive: true });
document.addEventListener('click', function(e) {
    if (_navTouchHandled) return;
    if (!e.target.closest('.site-dropdown')) {
        document.querySelectorAll('.site-dropdown').forEach(function(d) { d.classList.remove('active'); });
    }
});`;

// Also the index.html version (uses .dropdown instead of .site-dropdown)
const NEW_TOGGLE_INDEX = `
/* ── DROPDOWNS ── */
var _navTouchHandled = false;
function toggleDropdown(el) {
    var dd = el.parentElement;
    var isActive = dd.classList.contains('active');
    document.querySelectorAll('.dropdown').forEach(function(d) { d.classList.remove('active'); });
    if (!isActive) {
        dd.classList.add('active');
        if (window.innerWidth <= 768) {
            var content = dd.querySelector('.dropdown-content');
            if (content) {
                var headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
                content.style.top = headerBottom + 'px';
            }
        }
    }
    _navTouchHandled = true;
    setTimeout(function() { _navTouchHandled = false; }, 400);
}
document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(function(d) { d.classList.remove('active'); });
    }
}, { passive: true });
document.addEventListener('click', function(e) {
    if (_navTouchHandled) return;
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(function(d) { d.classList.remove('active'); });
    }
});`;

function replaceToggle(p, oldFn, newFn) {
    // Replace everything from the DROPDOWNS comment to the end of the last listener
    var re = /\/\* ── DROPDOWNS ── \*\/[\s\S]*?document\.addEventListener\('click'[\s\S]*?\}\);/g;
    return p.replace(re, newFn.trim());
}

function patchFile(filePath, isIndex) {
    var html = fs.readFileSync(filePath, 'utf8');
    var p = html.replace(/\r\n/g, '\n');
    var newFn = isIndex ? NEW_TOGGLE_INDEX.trim() : NEW_TOGGLE.trim();
    var patched = replaceToggle(p, null, newFn);
    var changed = patched !== p;
    if (changed) fs.writeFileSync(filePath, patched.replace(/\n/g, '\r\n'), 'utf8');
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
var fixed = 0;
var total = 0;

// Fix index.html
var indexPath = path.join(root, 'index.html');
if (fs.existsSync(indexPath)) {
    total++;
    var changed = patchFile(indexPath, true);
    console.log((changed ? '  FIXED   ' : '  skip    ') + 'index.html');
    if (changed) fixed++;
}

// Fix all destination pages
var targets = walkDir(path.join(root, 'src', 'content'));
targets.sort().forEach(function(fp) {
    total++;
    var rel = path.relative(root, fp);
    var changed = patchFile(fp, false);
    console.log((changed ? '  FIXED   ' : '  skip    ') + rel);
    if (changed) fixed++;
});

console.log('\nDone — ' + fixed + '/' + total + ' files patched.\n');
console.log('  git add -A');
console.log('  git commit -m "Fix double-tap on mobile dropdowns"');
console.log('  git push\n');
