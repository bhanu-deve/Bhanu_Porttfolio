// ===== PARTICLES =====
(function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random() * 100}%;
            animation-duration:${Math.random() * 15 + 10}s;
            animation-delay:-${Math.random() * 15}s;
        `;
        container.appendChild(p);
    }
})();

// ===== CURSOR GLOW (desktop only) =====
const glow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
} else {
    glow.style.display = 'none';
}

// ===== TYPED TEXT =====
const phrases = ['REST APIs', 'Web Apps', 'AI Solutions', 'Clean Code', 'Full-Stack Apps'];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
    const cur = phrases[pi];
    if (!deleting) {
        typedEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) {
            deleting = true;
            return setTimeout(typeLoop, 1900);
        }
    } else {
        typedEl.textContent = cur.slice(0, --ci);
        if (ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
        }
    }
    setTimeout(typeLoop, deleting ? 55 : 100);
}
typeLoop();

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.skill-card, .edu-item, .exp-card, .project-card, .cert-card'
).forEach(el => observer.observe(el));

// Stagger skill cards
document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.animationDelay = (i * 0.06) + 's';
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 110) current = s.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 450);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMsg').value.trim();
    if (!name || !email || !message) return;

    const btn = this.querySelector('.btn-send');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate sending (replace with real EmailJS / Formspree integration)
    setTimeout(() => {
        const successEl = document.getElementById('formSuccess');
        successEl.style.display = 'block';
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        this.reset();
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
    }, 1400);
});

// ===== AUTO YEAR IN FOOTER =====
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ===== SMOOTH NAV SCROLL (offset for fixed nav) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = document.querySelector('nav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});
