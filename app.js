/* ==========================================================================
   Nuvexo - Premium Interactivity Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initializations
    initHeaderScroll();
    initMobileNav();
    initCustomCursor();
    initScrollReveal();
    initActiveNavTracking();
    initContactForm();
    initParallax();

});

/**
 * 2. Sticky Header Scroll Effect
 * Adds blur background and reduces padding on header scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Trigger immediately in case page loads scrolled down
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 3. Mobile Navigation Menu
 * Handles slide-out hamburger menu with lock-scroll behavior
 */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

    if (!toggleBtn || !overlay) return;

    const toggleMenu = () => {
        toggleBtn.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    };

    const closeMenu = () => {
        toggleBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    toggleBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * 4. Custom Apple-Inspired Cursor
 * Smooth lag-free mouse follower that reacts to interactive nodes
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;

    // Only enable custom cursor for devices with standard fine pointer (mouse/trackpad)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for inner dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Animate outer ring with a slight lag (lerp animation) for organic feel
    const renderCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        // Smooth factor (0.15 gives fluid elastic feel)
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover triggers for interactive nodes
    const hoverSelectors = 'a, button, select, input, textarea, .project-card, .highlight-card, .service-card, .why-card, .tech-card, .approach-card, .diff-card, .snapshot-card, .bento-card, .project-showcase-item';
    const elementsToHover = document.querySelectorAll(hoverSelectors);

    elementsToHover.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

/**
 * 5. High Performance Scroll Reveal
 * Fades in components smoothly using IntersectionObserver API
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // offset bottom trigger point slightly
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop tracking once revealed
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * 6. Active Navigation Highlight Tracking
 * Updates active states on nav items depending on scroll position
 */
function initActiveNavTracking() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const trackActiveSection = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for trigger point

        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', trackActiveSection, { passive: true });
    trackActiveSection(); // Trigger immediately
}

/**
 * 7. Secure Contact Form Submission
 * Captures form inputs, validates fields, and fires animated toast notifications
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toastContainer = document.getElementById('toastContainer');
    
    if (!form || !toastContainer) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Fetch Form Inputs
        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const projectVal = document.getElementById('projectType').value;
        const budgetVal = document.getElementById('budget').value;
        const timelineVal = document.getElementById('timeline').value;
        const detailsVal = document.getElementById('details').value.trim();

        // 2. Simple Field Validations
        if (!nameVal || !emailVal || !projectVal || !budgetVal || !timelineVal || !detailsVal) {
            showToast('Please fill out all the fields before submitting.', 'error');
            return;
        }

        // 3. Update Button State (simulating async pipeline processing)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        setTimeout(() => {
            // 4. Success State Handlers
            showToast(`Thank you, ${nameVal}! Your inquiry has been sent. We'll be in touch shortly.`, 'success');
            
            // Restore button & clear fields
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.reset();

        }, 1500);
    });

    /**
     * Helper to show glassmorphic toast notification
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Define appropriate SVG Icon
        let iconMarkup = '';
        if (type === 'success') {
            iconMarkup = `
                <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
            `;
        } else {
            iconMarkup = `
                <svg class="toast-icon" style="color: #f87171;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            `;
        }

        toast.innerHTML = `
            ${iconMarkup}
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Animate entrance
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Animate exit and remove
        setTimeout(() => {
            toast.classList.remove('show');
            // Remove from DOM after transition finishes
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 5000);
    }
}

/**
 * 8. Premium Parallax Motion
 * Applies a subtle scroll-driven parallax shift to featured project previews and floating blobs
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const parentTop = el.getBoundingClientRect().top + scrolled;
            const parentHeight = el.offsetHeight;
            const viewHeight = window.innerHeight;
            
            // Check if element is in viewport bounds
            if (scrolled + viewHeight > parentTop && scrolled < parentTop + parentHeight) {
                // Calculate relative position of element in viewport (-1 to 1)
                const elementCenter = parentTop + (parentHeight / 2);
                const viewportCenter = scrolled + (viewHeight / 2);
                const offset = viewportCenter - elementCenter;
                
                // Scale value to a gentle offset (speed factor of 0.05)
                const translateY = offset * 0.05;
                
                const img = el.querySelector('.showcase-img');
                if (img) {
                    img.style.transform = `translate3d(0, ${translateY}px, 0)`;
                }
            }
        });
        
        // Also apply a subtle lag shift to the floating background mesh orbs
        const orbs = document.querySelectorAll('.glow-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.03;
            orb.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
        });
        
    }, { passive: true });
}

