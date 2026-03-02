// LoanShield - JavaScript for Interactive Features

// Theme Management
let isTogglingTheme = false;

function initTheme() {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('loanshield-theme') || 'dark';

    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            updateThemeIcon(true);
        } else {
            document.body.classList.remove('light-mode');
            updateThemeIcon(false);
        }
    });
}

function toggleTheme() {
    // Prevent rapid toggling
    if (isTogglingTheme) return;
    isTogglingTheme = true;

    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
        const body = document.body;
        const isLight = body.classList.toggle('light-mode');

        // Save preference (async to avoid blocking)
        try {
            localStorage.setItem('loanshield-theme', isLight ? 'light' : 'dark');
        } catch (e) {
            console.warn('Unable to save theme preference:', e);
        }

        // Update icon
        updateThemeIcon(isLight);

        // Allow toggling again after transition completes
        setTimeout(() => {
            isTogglingTheme = false;
        }, 350); // Slightly longer than CSS transition (300ms)
    });
}

function updateThemeIcon(isLight) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            // Only update if changed to avoid unnecessary reflows
            const newClassName = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            if (icon.className !== newClassName) {
                icon.className = newClassName;
            }
        }
    }
}

// Tab Navigation Variables
let currentTab = 0;
const tabs = document.querySelectorAll('.tab-content');
const tabItems = document.querySelectorAll('.tab-item');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Remove preload class to enable transitions after page load
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    // Initialize theme
    initTheme();

    // Setup theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Show first tab if on assessment page
    if (tabs.length > 0) {
        showTab(0);
        setupTabClickListeners();
    }

    // Generate floating icons
    generateFloatingIcons();

    // Setup smooth scrolling
    setupSmoothScroll();

    // Setup navbar scroll effect
    setupNavbarScroll();

    // Animate elements on scroll
    setupScrollAnimations();

    // Result page animations
    animateResultPage();

    // Update navigation active state
    updateActiveNavLink();
});

// Tab Navigation Functions
function showTab(tabIndex) {
    // Hide all tabs
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });

    // Remove active class from all tab items
    tabItems.forEach(item => {
        item.classList.remove('active');
    });

    // Show current tab
    if (tabs[tabIndex]) {
        tabs[tabIndex].classList.add('active');
        tabs[tabIndex].style.display = 'block';
    }

    // Highlight current tab item
    if (tabItems[tabIndex]) {
        tabItems[tabIndex].classList.add('active');
    }

    // Update button visibility
    updateNavigationButtons();
}

function nextTab() {
    if (currentTab < tabs.length - 1) {
        if (validateCurrentTab()) {
            currentTab++;
            showTab(currentTab);
            scrollToTop();
        }
    }
}

function prevTab() {
    if (currentTab > 0) {
        currentTab--;
        showTab(currentTab);
        scrollToTop();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (!prevBtn || !nextBtn || !submitBtn) return;

    // Show/hide previous button
    if (currentTab === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-flex';
    }

    // Show/hide next button and submit button
    if (currentTab === tabs.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

function validateCurrentTab() {
    const currentTabElement = tabs[currentTab];
    const inputs = currentTabElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value || input.value.trim() === '') {
            input.style.borderColor = '#ef4444';
            isValid = false;

            // Reset border color after 2 seconds
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });

    if (!isValid) {
        // Show validation message
        showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
}

function setupTabClickListeners() {
    tabItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Only allow clicking on previous tabs or current tab
            if (index <= currentTab) {
                currentTab = index;
                showTab(currentTab);
                scrollToTop();
            }
        });
    });
}

// Floating Icons Generation
function generateFloatingIcons() {
    const floatingContainer = document.querySelector('.floating-icons');
    if (!floatingContainer) return;

    const icons = ['💰', '💳', '📊', '💵', '🏦', '📈', '💸', '🪙', '📉', '💴', '💶', '💷', '💱', '🏧', '💹', '💲'];
    const numIcons = 200;

    for (let i = 0; i < numIcons; i++) {
        const iconElement = document.createElement('div');
        iconElement.className = 'float-icon';
        iconElement.textContent = icons[Math.floor(Math.random() * icons.length)];
        iconElement.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 30 + 20}px;
            opacity: ${Math.random() * 0.1 + 0.05};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        floatingContainer.appendChild(iconElement);
    }
}

// Smooth Scroll Setup
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements
    const animatedElements = document.querySelectorAll('.feature-card, .process-step, .model-card, .education-card, .metric-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Result Page Animations
function animateResultPage() {
    // Check if we're on result page
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const targetWidth = progressBar.getAttribute('data-width') || progressBar.style.width;

        // Animate progress bar
        setTimeout(() => {
            progressBar.style.width = targetWidth;
        }, 500);
    }

    // Animate contribution bars if present
    const contributionBars = document.querySelectorAll('.contribution-bar');
    if (contributionBars.length > 0) {
        contributionBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.getAttribute('data-width') || bar.style.width;
                bar.style.width = targetWidth;
            }, 800 + (index * 100));
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update active navigation link based on current page
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Form submission handler (optional enhancement)
function handleFormSubmit(event) {
    if (!validateCurrentTab()) {
        event.preventDefault();
        return false;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        submitBtn.disabled = true;
    }

    return true;
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
`;
document.head.appendChild(style);

// Expose functions globally for button onclick handlers
window.nextTab = nextTab;
window.prevTab = prevTab;
window.handleFormSubmit = handleFormSubmit;

console.log('🚀 LoanShield initialized successfully!');
