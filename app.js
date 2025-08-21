// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('themeToggle');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');
const downloadResumeBtn = document.getElementById('downloadResume');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Unable to store theme preference');
        }
    }

    init() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        document.body.setAttribute('data-color-scheme', this.currentTheme);
        this.updateThemeIcon();
        
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        document.body.setAttribute('data-color-scheme', this.currentTheme);
        this.setStoredTheme(this.currentTheme);
        this.updateThemeIcon();
        
        // Add visual feedback
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    updateThemeIcon() {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section, .hero');
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Highlight active section on scroll
        window.addEventListener('scroll', () => this.highlightActiveSection());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (hamburger && navMenu && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (!href || !href.startsWith('#')) {
            return;
        }

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navbarHeight = 80; // Fixed navbar height
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            // Smooth scroll
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });

            // Update active state immediately
            this.setActiveLink(href);
        }
    }

    setActiveLink(activeHref) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            }
        });
    }

    highlightActiveSection() {
        const scrollPos = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.setActiveLink(`#${sectionId}`);
            }
        });
    }
}

// Scroll Management
class ScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Scroll to top button
        window.addEventListener('scroll', () => this.handleScroll());
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // Animate progress bars when they come into view
        this.animateProgressBars();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide scroll to top button
        if (scrollToTopBtn) {
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Navbar background opacity
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollTop > 50) {
                navbar.style.backgroundColor = `rgba(var(--color-surface), 0.98)`;
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = `rgba(var(--color-surface), 0.95)`;
            }
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    animateProgressBars() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach((bar, index) => {
                        setTimeout(() => {
                            const targetWidth = bar.getAttribute('style')?.match(/width:\s*(\d+)%/)?.[1] || '0';
                            bar.style.width = '0%';
                            // Trigger reflow
                            bar.offsetHeight;
                            bar.style.transition = 'width 1.5s ease-out';
                            bar.style.width = `${targetWidth}%`;
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe skills and languages sections
        const skillsSection = document.getElementById('skills');
        const aboutSection = document.getElementById('about');
        if (skillsSection) observer.observe(skillsSection);
        if (aboutSection) observer.observe(aboutSection);
    }
}

// Form Management
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }

    validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        let isValid = true;

        // Validate name
        if (name && !this.validateField(name)) isValid = false;

        // Validate email
        if (email && !this.validateField(email)) isValid = false;

        // Validate subject
        if (subject && !this.validateField(subject)) isValid = false;

        // Validate message
        if (message && !this.validateField(message)) isValid = false;

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);

        // Clear previous error
        this.clearError(field);

        // Validation rules
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.classList.add('error');
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('error');
    }

    async submitForm() {
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission(formData);
            
            // Success feedback
            this.showSuccessMessage();
            contactForm.reset();
        } catch (error) {
            // Error feedback
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                // For demo purposes, we'll always resolve successfully
                console.log('Form submitted:', Object.fromEntries(formData));
                resolve();
            }, 1500);
        });
    }

    showSuccessMessage() {
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
    }

    showErrorMessage(errorText) {
        this.showNotification(errorText, 'error');
    }

    showNotification(text, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `status status--${type} notification`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        notification.innerHTML = `<i class="${icon}"></i> ${text}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .animate-ready {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease-out;
            }

            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .form-control.error {
                border-color: var(--color-error);
                box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatableElements = document.querySelectorAll('.card, .timeline-item, .skill-item, .language-item');
        animatableElements.forEach(el => {
            el.classList.add('animate-ready');
            observer.observe(el);
        });
    }
}

// Resume Download Handler
class ResumeManager {
    constructor() {
        this.init();
    }

    init() {
        if (downloadResumeBtn) {
            downloadResumeBtn.addEventListener('click', (e) => this.handleDownload(e));
        }
    }

    handleDownload(e) {
        e.preventDefault();
        
        // Show notification since we don't have an actual resume file
        this.showNotification();

        // In a real application, you would do:
        // const link = document.createElement('a');
        // link.href = 'path/to/resume.pdf';
        // link.download = 'Bhanu_Prasad_Samal_Resume.pdf';
        // link.click();
    }

    showNotification() {
        const notification = document.createElement('div');
        notification.className = 'status status--info notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            Resume download feature would be implemented with an actual PDF file.
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize Application
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
        } else {
            this.initializeManagers();
        }
    }

    initializeManagers() {
        try {
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.scrollManager = new ScrollManager();
            this.formManager = new FormManager();
            this.animationManager = new AnimationManager();
            this.resumeManager = new ResumeManager();

            // Performance optimizations
            this.optimizeScrollHandlers();
            
            console.log('Portfolio application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    optimizeScrollHandlers() {
        // Use throttled scroll handlers for better performance
        const throttledScrollHandler = Utils.throttle(() => {
            this.scrollManager.handleScroll();
            this.navigationManager.highlightActiveSection();
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    }
}

// Initialize the application
const app = new App();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, ThemeManager, NavigationManager, FormManager };
}