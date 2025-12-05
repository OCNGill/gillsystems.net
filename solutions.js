/**
 * Solutions Page - Interactive Service Cards
 * Gillsystems.net 2025
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize expand/collapse functionality
    initializeServiceCards();
    
    // Smooth scroll for anchor links
    initializeSmoothScroll();
});

/**
 * Initialize expandable service cards
 */
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card:not(.expanded)');
    
    serviceCards.forEach(card => {
        const expandBtn = card.querySelector('.expand-btn');
        const details = card.querySelector('.card-details');
        
        if (!expandBtn || !details) return;
        
        // Handle click on expand button
        expandBtn.addEventListener('click', () => {
            toggleCard(card, expandBtn, details);
        });
        
        // Handle keyboard accessibility
        expandBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard(card, expandBtn, details);
            }
        });
    });
}

/**
 * Toggle card expansion state
 */
function toggleCard(card, button, details) {
    const isExpanded = card.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse
        card.classList.remove('expanded');
        button.querySelector('.btn-text').textContent = 'See Full Details';
        button.setAttribute('aria-expanded', 'false');
        
        // Smooth collapse animation
        details.style.maxHeight = details.scrollHeight + 'px';
        requestAnimationFrame(() => {
            details.style.maxHeight = '0';
        });
    } else {
        // Expand
        card.classList.add('expanded');
        button.querySelector('.btn-text').textContent = 'Hide Details';
        button.setAttribute('aria-expanded', 'true');
        
        // Smooth expand animation
        details.style.maxHeight = details.scrollHeight + 'px';
        
        // After animation completes, remove max-height for dynamic content
        details.addEventListener('transitionend', function handler() {
            if (card.classList.contains('expanded')) {
                details.style.maxHeight = 'none';
            }
            details.removeEventListener('transitionend', handler);
        });
        
        // Scroll card into view smoothly after expansion
        setTimeout(() => {
            const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
            const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
            const scrollTo = cardTop - navHeight - 20;
            
            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        }, 100);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
                const scrollTo = targetTop - navHeight - 20;
                
                window.scrollTo({
                    top: scrollTo,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add visual feedback for CTA buttons
 */
function initializeCTATracking() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Could add analytics tracking here if needed
            console.log('CTA clicked:', button.textContent.trim());
        });
    });
}

// Initialize CTA tracking
document.addEventListener('DOMContentLoaded', initializeCTATracking);