/* ══════════════════════════════════════════════
   College SMS API Reference — script.js
   ══════════════════════════════════════════════ */

/* ── State ── */
let methodFilter = 'ALL';
let roleFilter   = 'ALL';

/* ══════════════════════════════════════════════
   CARD TOGGLE (expand / collapse)
   ══════════════════════════════════════════════ */
function toggleCard(header) {
  const card = header.parentElement;
  card.classList.toggle('open');
}

/* ══════════════════════════════════════════════
   METHOD FILTER
   ══════════════════════════════════════════════ */
function setMethodFilter(method, btn) {
  methodFilter = method;

  // Deactivate all method buttons
  const methodValues = ['All', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  document.querySelectorAll('.filter-row .filter-btn').forEach(b => {
    const label = b.textContent.trim().toUpperCase();
    if (methodValues.includes(label)) {
      b.classList.remove('active');
    }
  });

  btn.classList.add('active');
  applyFilters();
}

/* ══════════════════════════════════════════════
   ROLE FILTER
   ══════════════════════════════════════════════ */
function setRoleFilter(role, btn) {
  roleFilter = role;

  // Deactivate all role buttons
  const roleValues = ['ALL ROLES', 'PUBLIC', 'ADMIN', 'HOD', 'STAFF', 'STUDENT'];
  document.querySelectorAll('.filter-row .filter-btn').forEach(b => {
    const label = b.textContent.trim().toUpperCase();
    if (roleValues.includes(label)) {
      b.classList.remove('active');
    }
  });

  btn.classList.add('active');
  applyFilters();
}

/* ══════════════════════════════════════════════
   SEARCH
   ══════════════════════════════════════════════ */
function filterEndpoints() {
  applyFilters();
}

/* ══════════════════════════════════════════════
   APPLY ALL FILTERS (method + role + search)
   ══════════════════════════════════════════════ */
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  let visibleCount = 0;

  document.querySelectorAll('.ep-card').forEach(card => {
    const cardMethod = (card.dataset.method || '').toUpperCase();
    const cardRoles  = (card.dataset.roles  || '').toUpperCase();
    const cardPath   = (card.dataset.path   || '').toLowerCase();
    const cardText   = card.textContent.toLowerCase();

    const methodMatch = methodFilter === 'ALL' || cardMethod === methodFilter;
    const roleMatch   = roleFilter === 'ALL'   || cardRoles.includes(roleFilter);
    const searchMatch = !searchTerm            || cardPath.includes(searchTerm) || cardText.includes(searchTerm);

    const visible = methodMatch && roleMatch && searchMatch;
    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  // Hide entire sections that have no visible cards
  document.querySelectorAll('.section').forEach(section => {
    const hasVisible = [...section.querySelectorAll('.ep-card')]
      .some(c => c.style.display !== 'none');
    section.style.display = hasVisible ? '' : 'none';
  });

  // Show/hide the "no results" message
  const noResults = document.getElementById('no-results');
  noResults.style.display = visibleCount === 0 ? '' : 'none';
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL TO SECTION + SIDEBAR ACTIVE
   ══════════════════════════════════════════════ */
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  // Find the sidebar link that references this section
  const link = document.querySelector(`.sidebar-link[onclick="scrollToSection('${id}')"]`);
  if (link) link.classList.add('active');
}

/* ══════════════════════════════════════════════
   COPY CODE BUTTON
   ══════════════════════════════════════════════ */
function copyCode(btn) {
  const pre = btn.nextElementSibling; // <pre> is always the next sibling
  const text = pre ? pre.innerText : '';

  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = '#4ade80';
    btn.style.borderColor = '#4ade80';

    setTimeout(() => {
      btn.textContent = original;
      btn.style.color  = '';
      btn.style.borderColor = '';
    }, 1500);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity  = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
  });
}

/* ══════════════════════════════════════════════
   INTERSECTION OBSERVER — sidebar active on scroll
   ══════════════════════════════════════════════ */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.sidebar-link[onclick="scrollToSection('${id}')"]`);
        if (link) link.classList.add('active');
      }
    });
  },
  {
    rootMargin: '-15% 0px -75% 0px',
    threshold: 0,
  }
);

// Observe every section once DOM is ready
document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});

/* ══════════════════════════════════════════════
   KEYBOARD SHORTCUT — focus search with "/"
   ══════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Skip if user is typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === '/') {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  // Press Escape to clear search and reset filters
  if (e.key === 'Escape') {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && document.activeElement === searchInput) {
      searchInput.blur();
    }
  }
});

/* ══════════════════════════════════════════════
   EXPAND ALL / COLLAPSE ALL (utility — not bound
   to UI but available if needed)
   ══════════════════════════════════════════════ */
function expandAll() {
  document.querySelectorAll('.ep-card').forEach(card => card.classList.add('open'));
}

function collapseAll() {
  document.querySelectorAll('.ep-card').forEach(card => card.classList.remove('open'));
}
