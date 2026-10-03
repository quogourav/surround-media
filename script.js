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

  // Contact form -> prefilled mailto (static site, no backend)
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const email = (data.get('email') || '').trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      note.textContent = 'Please enter your name and a valid email address.';
      note.classList.add('form__note--error');
      return;
    }
    note.classList.remove('form__note--error');
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Interested in: ${data.get('interest')}`,
      '',
      (data.get('message') || '').trim()
    ].join('\n');
    const subject = `Project enquiry — ${data.get('interest')}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Thanks! Your email app should open with your message ready to send.';
  });
});
