(() => {
  const html = document.documentElement;
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
  const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function getStoredTheme() {
    try {
      const value = localStorage.getItem('color-scheme');
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }

  function applyTheme(stored) {
    if (colorSchemeMeta) {
      colorSchemeMeta.content = stored ?? 'light dark';
    }
    html.classList.remove('dark', 'light');
    if (stored === 'dark' || stored === 'light') {
      html.classList.add(stored);
    }
  }

  function toggleColorScheme() {
    const systemDark = systemDarkQuery.matches;
    const stored = getStoredTheme();
    const currentDark = stored ? stored === 'dark' : systemDark;
    const target = currentDark ? 'light' : 'dark';
    const nextStored = (target === 'dark') === systemDark ? null : target;

    try {
      if (nextStored === null) {
        localStorage.removeItem('color-scheme');
      } else {
        localStorage.setItem('color-scheme', nextStored);
      }
    } catch {
      // Storage may be blocked; still apply theme for the current session.
      applyTheme(target);
      return;
    }

    applyTheme(nextStored);
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleColorScheme);
  }
  if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener('click', toggleColorScheme);
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'color-scheme') {
      applyTheme(event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null);
    }
  });

  systemDarkQuery.addEventListener('change', () => {
    applyTheme(getStoredTheme());
  });

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpenIcon = document.getElementById('menuOpenIcon');
  const menuCloseIcon = document.getElementById('menuCloseIcon');
  const navbar = document.getElementById('navbar');

  function setMobileMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (menuOpenIcon && menuCloseIcon) {
      menuOpenIcon.classList.toggle('hidden', open);
      menuCloseIcon.classList.toggle('hidden', !open);
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('hidden');
      setMobileMenu(isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMobileMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        setMobileMenu(false);
        menuBtn.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        !mobileMenu.classList.contains('hidden') &&
        navbar &&
        !navbar.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    });
  }

  // Single passive scroll listener for navbar shadow and scroll-to-top button
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function updateScrollState() {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('shadow-md', y > 10);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', y > 500);
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
      });
    });
  }

  // Active Navigation Highlight
  const navLinks = document.querySelectorAll('nav a[data-nav-link]');
  const sections = document.querySelectorAll('main > section[id]');

  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${sectionId}`;
      if (isMatch) {
        link.setAttribute('aria-current', 'location');
        link.classList.add('text-blue-600', 'dark:text-blue-400');
        link.classList.remove('text-slate-600', 'dark:text-slate-300');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('text-blue-600', 'dark:text-blue-400');
        link.classList.add('text-slate-600', 'dark:text-slate-300');
      }
    });
  }

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  // Section Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  if (!reducedMotionQuery.matches && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // Project Category Filtering
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');
  const featuredCard = document.getElementById('project-isolat');
  const filterStatus = document.getElementById('projectFilterStatus');
  const activeFilterClasses = ['bg-blue-600', 'text-white', 'shadow-sm'];
  const inactiveFilterClasses = [
    'bg-white',
    'dark:bg-slate-800',
    'text-slate-600',
    'dark:text-slate-300',
    'border',
    'border-slate-200',
    'dark:border-slate-700',
    'hover:bg-slate-100',
    'dark:hover:bg-slate-700',
  ];

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.getAttribute('data-filter');

      filterButtons.forEach((btnEl) => {
        const isSelected = btnEl === button;
        btnEl.setAttribute('aria-pressed', String(isSelected));
        if (isSelected) {
          btnEl.classList.remove(...inactiveFilterClasses);
          btnEl.classList.add(...activeFilterClasses);
        } else {
          btnEl.classList.remove(...activeFilterClasses);
          btnEl.classList.add(...inactiveFilterClasses);
        }
      });

      let visibleCount = 0;
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const show = selectedFilter === 'all' || category === selectedFilter;
        card.classList.toggle('hidden', !show);
        if (show) visibleCount += 1;
      });

      if (featuredCard) {
        featuredCard.classList.toggle('lg:col-span-2', selectedFilter === 'all');
      }

      if (filterStatus) {
        const label = selectedFilter === 'all' ? 'all' : selectedFilter;
        filterStatus.textContent = `Showing ${visibleCount} ${label} project${visibleCount === 1 ? '' : 's'}.`;
      }
    });
  });

  // Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formSuccessHeading = document.getElementById('formSuccessHeading');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const submitLabel = document.getElementById('contactSubmitLabel');
  const submitIcon = document.getElementById('contactSubmitIcon');
  const submitSpinner = document.getElementById('contactSubmitSpinner');
  const formError = document.getElementById('formError');

  let isSubmitting = false;

  function setSubmitting(loading) {
    isSubmitting = loading;
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('opacity-75', loading);
    submitBtn.classList.toggle('cursor-not-allowed', loading);
    if (submitLabel) {
      submitLabel.textContent = loading ? 'Sending…' : 'Send Message';
    }
    if (submitIcon) {
      submitIcon.classList.toggle('hidden', loading);
    }
    if (submitSpinner) {
      submitSpinner.classList.toggle('hidden', !loading);
    }
  }

  function showFormError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.remove('hidden');
  }

  function clearFormError() {
    if (!formError) return;
    formError.textContent = '';
    formError.classList.add('hidden');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      clearFormError();
      setSubmitting(true);

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          contactForm.classList.add('hidden');
          if (formSuccess) {
            formSuccess.classList.remove('hidden');
          }
          contactForm.reset();
          if (formSuccessHeading) {
            formSuccessHeading.focus();
          }
        } else {
          let errorText = 'There was a problem submitting your message. Please try again or email me directly.';
          try {
            const payload = await response.json();
            if (payload && Array.isArray(payload.errors) && payload.errors.length > 0) {
              errorText = payload.errors.map((err) => err.message).join(' ');
            }
          } catch {
            // Keep generic fallback message
          }
          showFormError(errorText);
        }
      } catch {
        showFormError('Network error — please check your connection or email element45.official@gmail.com directly.');
      } finally {
        setSubmitting(false);
      }
    });
  }

  if (resetFormBtn && contactForm && formSuccess) {
    resetFormBtn.addEventListener('click', () => {
      formSuccess.classList.add('hidden');
      contactForm.classList.remove('hidden');
      clearFormError();
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.focus();
    });
  }
})();
