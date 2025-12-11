/**
 * CTA Component - Reusable Call-to-Action with Mega Effects
 * Commander Gill's insanely awesome CTA with:
 * - Pulsing neon glow
 * - Wave animation through letters
 * - Interactive emoji portals
 * - Particle burst effects
 */

function insertCTA(targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    
    if (!targetElement) {
        console.error(`CTA target element not found: ${targetElementId}`);
        return;
    }
    
    // Create CTA container
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'ai-cta cta-component';
    ctaDiv.innerHTML = `
        <div class="cta-line">
            <span class="terminal-prompt">C:\\></span>
            <span class="cta-text" id="cta-main-${targetElementId}">Let's amplify your capabilities!</span>
            <span class="cta-emoji cta-emoji-1" data-link="true">💪</span>
            <span class="cta-emoji cta-emoji-2" data-link="true">👍</span>
        </div>
        <div class="cta-links">
            <a href="index.html#connect" class="cta-link">→ <strong>Get in Touch</strong> ✨</a>
        </div>
    `;
    
    // Append to target
    targetElement.appendChild(ctaDiv);
    
    // Fade in and activate effects after brief delay
    setTimeout(() => {
        ctaDiv.style.opacity = '1';
        
        setTimeout(() => {
            activateCTAEffects(`cta-main-${targetElementId}`, 
                              ctaDiv.querySelector('.cta-emoji-1'),
                              ctaDiv.querySelector('.cta-emoji-2'));
        }, 300);
    }, 100);
}

function activateCTAEffects(ctaMainId, emoji1, emoji2) {
    const ctaMain = document.getElementById(ctaMainId);
    
    if (!ctaMain) return;
    
    // Split into letters for wave effect - preserve spacing!
    const text = ctaMain.textContent;
    ctaMain.innerHTML = '';
    const letters = Array.from(text).map((char, idx) => {
        const span = document.createElement('span');
        span.className = 'cta-letter';
        span.textContent = char;
        span.dataset.index = idx;
        
        // Preserve spaces properly
        if (char === ' ') {
            span.style.whiteSpace = 'pre';
        }
        
        ctaMain.appendChild(span);
        return span;
    });
    
    // Apply pulsing neon glow animation to container
    ctaMain.classList.add('cta-glow-pulse');
    
    // Wave effect: letters light up in sequence continuously
    let wavePos = 0;
    const waveLength = 8;
    const waveInterval = 124; // Slowed down from 93ms to 124ms (one-third slower)
    let waveIndex = 0;
    setInterval(() => {
        letters.forEach((letter, idx) => {
            letter.classList.remove('cta-wave-active');
        });
        
        for (let i = 0; i < waveLength; i++) {
            const idx = (wavePos + i) % letters.length;
            letters[idx].classList.add('cta-wave-active');
        }
        
        wavePos = (wavePos + 1) % letters.length;
    }, waveInterval);
    
    // Make emojis clickable and add particle effect
    [emoji1, emoji2].forEach(emoji => {
        if (!emoji) return;
        
        emoji.style.cursor = 'pointer';
        emoji.classList.add('cta-emoji-interactive');
        
        emoji.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Particle burst effect
            createCTAParticleBurst(emoji);
            
            // Navigate
            setTimeout(() => {
                window.location.href = 'index.html#connect';
            }, 300);
        });
        
        emoji.addEventListener('mouseenter', () => {
            emoji.classList.add('cta-emoji-portal');
        });
        
        emoji.addEventListener('mouseleave', () => {
            emoji.classList.remove('cta-emoji-portal');
        });
    });
}

function createCTAParticleBurst(emoji) {
    const rect = emoji.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-burst';
        particle.innerHTML = emoji.textContent;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 3 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let px = x, py = y;
        let opacity = 1;
        
        const animate = () => {
            px += vx;
            py += vy;
            opacity -= 0.02;
            
            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}
