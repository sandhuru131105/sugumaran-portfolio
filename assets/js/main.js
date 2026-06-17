document.addEventListener('DOMContentLoaded', function () {

    // Set document theme dynamically to dark
    document.documentElement.setAttribute('data-theme', 'dark');

    // ===== Create and Append Page Loader and Scroll Progress Bar dynamically if they don't exist =====
    if (!document.getElementById('scrollProgress')) {
        const progress = document.createElement('div');
        progress.id = 'scrollProgress';
        document.body.prepend(progress);
    }

    if (!document.querySelector('.page-loader')) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <div class="loader-text">SUGUMARAN.</div>
        `;
        document.body.prepend(loader);
    }

    // Hide Page Loader
    window.addEventListener('load', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 600);
        }
    });

    // Fallback: Remove loader if loading takes too long
    setTimeout(() => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 2000);

    // ===== Initialize AOS (Animate on Scroll) =====
    AOS.init({
        duration: 900,
        easing: 'ease-out-quad',
        once: true,
        offset: 80,
        disable: 'mobile'
    });

    // ===== Scroll Indicators (Progress Bar & Scrolled Navbar) =====
    const navbar = document.getElementById('mainNavbar');
    const backToTop = document.getElementById('backToTop');
    const scrollProgressBar = document.getElementById('scrollProgress');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const scrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update Scroll Progress Bar
        if (totalHeight > 0 && scrollProgressBar) {
            const progressPercentage = (scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = progressPercentage + '%';
        }

        // Hide Navbar on Scroll Down, Show on Scroll Up
        if (navbar) {
            // Check if mobile menu is open, if so don't hide
            const isMobileMenuOpen = document.getElementById('navbarNav')?.classList.contains('show');
            
            if (scrollY > 100 && scrollY > lastScrollY && !isMobileMenuOpen) {
                // Scroll Down
                navbar.classList.add('nav-hidden');
            } else {
                // Scroll Up
                navbar.classList.remove('nav-hidden');
            }
        }

        // Navbar scrolled background appearance
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScrollY = scrollY;
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to align scroll state

    // ===== Active Nav Link on Scroll =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 160;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== Close Mobile Nav on Link Click =====
    const navbarCollapse = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.nav-link, .btn-contact-nav');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // ===== Smooth Scroll for Anchor Links with Offset =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPos = target.offsetTop - navHeight - 5;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Animated Count-Up Counters =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ultra smooth easeOutQuart curve
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(eased * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counters when scrolled into view
    const aboutSection = document.getElementById('about');
    let counterAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.25 });

    if (aboutSection) {
        counterObserver.observe(aboutSection);
    }

    // ===== Skill Bar Filling Animation =====
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.25 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ===== Interactive Project Category Filter =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filter === 'all' || itemCategory === filter) {
                    item.classList.remove('hide');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 350);
                }
            });
        });
    });

    // ===== Advanced Form Processing and Micro-Interactions =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Submit loading visual
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending Message...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2-all me-2"></i>Success! Talk to you soon.';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Green gradient success
                
                // Clear input fields
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }, 1800);
        });
    }

    // ===== Subtle Parallax Effect on Hero Image =====
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    if (heroImageWrapper && window.innerWidth > 991) {
        window.addEventListener('mousemove', function (e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 80;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 80;
            heroImageWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        heroImageWrapper.addEventListener('mouseleave', function () {
            heroImageWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    // ===== Modern Typewriter Effect for Hero Headline =====
    const gradientTextEl = document.querySelector('.hero-title .gradient-text');
    if (gradientTextEl) {
        const phrases = ['Graphic Designer.', 'Video Editor.'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                gradientTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 60;
            } else {
                gradientTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2200; // Time displaying the full phrase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400; // Break before typing next word
            }

            setTimeout(typeEffect, typingSpeed);
        }

        // Delay typing until page loader resolves
        setTimeout(typeEffect, 1200);
    }
});
