document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      siteNav.classList.toggle('is-open', !isOpen);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      });
    });
  }

  const filterButtons = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-card');
  const emptyMessage = document.querySelector('#filter-empty');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        let visibleCount = 0;

        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        projectCards.forEach((card) => {
          const matches = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !matches);
          if (matches) visibleCount += 1;
        });

        if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
      });
    });
  }

  document.querySelectorAll('.detail-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const detail = document.getElementById(button.getAttribute('aria-controls'));
      if (!detail) return;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      detail.hidden = isExpanded;
    });
  });

  const form = document.querySelector('#contact-form');
  if (!form) return;

  const fields = {
    name: { input: document.querySelector('#name'), error: document.querySelector('#name-error') },
    email: { input: document.querySelector('#email'), error: document.querySelector('#email-error') },
    message: { input: document.querySelector('#message'), error: document.querySelector('#message-error') },
  };
  const status = document.querySelector('#form-status');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const showError = (field, message) => {
    field.input.classList.add('invalid');
    field.input.setAttribute('aria-invalid', 'true');
    field.error.textContent = message;
  };

  const clearError = (field) => {
    field.input.classList.remove('invalid');
    field.input.removeAttribute('aria-invalid');
    field.error.textContent = '';
  };

  const validate = () => {
    let isValid = true;
    const nameValue = fields.name.input.value.trim();
    const emailValue = fields.email.input.value.trim();
    const messageValue = fields.message.input.value.trim();

    Object.values(fields).forEach(clearError);
    if (!nameValue) { showError(fields.name, 'Please enter your name.'); isValid = false; }
    if (!emailValue) showError(fields.email, 'Please enter your email address.');
    else if (!emailPattern.test(emailValue)) showError(fields.email, 'Please enter a valid email address.');
    if (!messageValue) showError(fields.message, 'Please add a short message.');
    if (!nameValue || !emailValue || !emailPattern.test(emailValue) || !messageValue) isValid = false;
    return isValid;
  };

  Object.values(fields).forEach((field) => {
    field.input.addEventListener('input', () => {
      if (field.input.value.trim()) clearError(field);
      if (status) status.textContent = '';
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) {
      if (status) status.textContent = 'Please review the highlighted fields.';
      return;
    }
    if (status) status.textContent = 'Thanks — your message is ready to send. I’ll be in touch soon.';
    form.reset();
    Object.values(fields).forEach(clearError);
  });
});
