document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar ──────────────────────────────────────────────────────────────
    const navbar     = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks   = document.getElementById('nav-links');
    const toggleIcon = menuToggle?.querySelector('i');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            toggleIcon?.classList.toggle('fa-bars',  !isOpen);
            toggleIcon?.classList.toggle('fa-times',  isOpen);
        });

        // Close menu on nav-link or CTA click
        navLinks.querySelectorAll('.nav-link, .btn').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    function closeMenu() {
        navLinks?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
        toggleIcon?.classList.add('fa-bars');
        toggleIcon?.classList.remove('fa-times');
    }

    // Navbar scroll state
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });


    // ── Waitlist Form ────────────────────────────────────────────────────────
    document.querySelectorAll('.waitlist-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn  = form.querySelector('button[type="submit"]');
            const email      = emailInput?.value.trim();

            if (!email || !validateEmail(email)) {
                showFeedback(form, 'error', 'Please enter a valid email address.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            try {
                // Simulated async submit — replace with real API call in production
                await new Promise(resolve => setTimeout(resolve, 900));

                const key      = 'novatech_waitlist';
                const waitlist = JSON.parse(localStorage.getItem(key) || '[]');
                if (!waitlist.includes(email)) {
                    waitlist.push(email);
                    localStorage.setItem(key, JSON.stringify(waitlist));
                }

                showFeedback(form, 'success', "You're on the list! We'll be in touch.");
                if (emailInput) emailInput.value = '';
            } catch {
                showFeedback(form, 'error', 'Something went wrong. Please try again.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled  = false;
                    submitBtn.innerHTML = 'Join Now';
                }
            }
        });
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFeedback(form, type, message) {
        // Remove any existing feedback within the same parent
        form.parentElement.querySelectorAll('.form-feedback').forEach(el => el.remove());

        const feedback = document.createElement('p');
        feedback.className = `form-feedback ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
        feedback.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

        form.after(feedback);

        if (type === 'success') {
            setTimeout(() => feedback.remove(), 6000);
        }
    }


    // ── Reveal Animations ────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    // ── Staggered Reveal for Grid Children ──────────────────────────────────
    // Any element with .reveal-stagger will animate its direct children in sequence
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
                    // Ensure children have the reveal class applied
                    child.classList.add('reveal');
                    setTimeout(() => child.classList.add('active'), i * 110);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-stagger').forEach(el => staggerObserver.observe(el));


    // ── Smooth-scroll offset fix for fixed navbar ────────────────────────────
    // Handles anchor clicks with scroll-padding-top fallback for older browsers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            const navHeight = navbar ? navbar.offsetHeight : 80;
            const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    });


    // ── Modal Functions ────────────────────────────────────────────────────
    window.openModal = function(type) {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close modal on overlay click
    document.getElementById('demoModal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Handle contact form
    window.handleContact = function(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        
        // Show success
        const feedback = document.createElement('p');
        feedback.className = 'form-feedback success';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll be in touch soon.';
        
        const existingFeedback = form.parentElement.querySelector('.form-feedback');
        if (existingFeedback) existingFeedback.remove();
        
        form.after(feedback);
        form.reset();
        
        setTimeout(() => feedback.remove(), 5000);
    };

    // Handle demo request
    window.handleDemoRequest = function(e) {
        e.preventDefault();
        const form = e.target;
        
        // Show success
        const feedback = document.createElement('p');
        feedback.className = 'form-feedback success';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Demo request submitted! We\'ll contact you shortly.';
        
        const existingFeedback = form.parentElement.querySelector('.form-feedback');
        if (existingFeedback) existingFeedback.remove();
        
        form.after(feedback);
        form.reset();
        
        setTimeout(() => {
            closeModal();
            feedback.remove();
        }, 2000);
    };

});
