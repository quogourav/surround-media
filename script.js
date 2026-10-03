document.addEventListener('DOMContentLoaded', () => {
  const CONTACT_EMAIL = 'contact@surroundmedia.in';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('main section[id]');

  document.getElementById('year').textContent = new Date().getFullYear();

  // Header shadow + active nav link + back-to-top visibility on scroll
  const onScroll = () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('visible', scrollY > 400);

    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const closeNav = () => {
    nav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach(link => link.addEventListener('click', closeNav));

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Contact form -> FormSubmit (emails CONTACT_EMAIL)
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const btn = form.querySelector('button[type="submit"]');
  const setNote = (msg, cls) => { note.textContent = msg; note.className = 'form__note' + (cls ? ' ' + cls : ''); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      setNote('Please enter your name and a valid email address.', 'form__note--error');
      return;
    }
    btn.disabled = true;
    setNote('Sending...');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `New enquiry from ${location.hostname || 'website'}: ${data.interest}`,
          _template: 'table'
        })
      });
      const out = await res.json();
      if (!res.ok || String(out.success) !== 'true') throw new Error(out.message || 'failed');
      form.reset();
      setNote('Thank you! Your message has been sent. We will reply within one working day.');
    } catch (err) {
      console.error('Contact form failed:', err.message);
      setNote('Sorry, something went wrong. Please email us at ' + CONTACT_EMAIL + '.', 'form__note--error');
    } finally {
      btn.disabled = false;
    }
  });
});
