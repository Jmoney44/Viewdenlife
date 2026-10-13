const menuPanel = document.getElementById('mobilePanel');
const menuToggle = document.getElementById('menuToggle');
const menuIcon = document.getElementById('menuIcon');
const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

function setMenuOpen(isOpen) {
  menuPanel.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuIcon.innerHTML = isOpen
    ? '<path d="m6 6 12 12M18 6 6 18"/>'
    : '<path d="M4 7h16M4 12h16M4 17h16"/>';
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuPanel.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenuOpen(false);
});

document.getElementById('year').textContent = new Date().getFullYear();

contactForm.addEventListener('submit', event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const subject = `Viewdenlife enquiry: ${formData.get('topic')}`;
  const body = [
    `Name: ${formData.get('name')}`,
    `Email: ${formData.get('email')}`,
    `Topic: ${formData.get('topic')}`,
    '',
    formData.get('message')
  ].join('\n');
  const mailtoUrl = `mailto:viewdenlife@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formStatus.textContent = 'Your email app should open with your message ready to send.';
  window.location.href = mailtoUrl;
});
