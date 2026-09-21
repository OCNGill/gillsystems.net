// AI Era page - minimal page script.
// The rebuilt page is fully static content-first (the Sovereign AI Stack is the
// hero), so the old hash-decode typing choreography is retired. This script only
// keeps the footer copyright year current.
(function () {
    var el = document.getElementById('footer-year');
    if (el) {
        el.textContent = String(new Date().getFullYear());
    }
})();
