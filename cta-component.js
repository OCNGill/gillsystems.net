/**
 * CTA Component - Reusable Call-to-Action with Mega Effects
 * Commander Gill's insanely awesome CTA with:
 * - Pulsing neon glow
 * - Wave animation through letters
 * - Interactive emoji portals
 * - Particle burst effects
 * - Sound effects on emoji interactions (Web Audio API - Plan A)
 */

// ============================================================
// Audio System (Plan A - Web Audio API)
// ============================================================

let audioCtx = null;
const audioBuffers = {};
let soundsEnabled = localStorage.getItem('soundsEnabled') === 'true';
let audioInitPromise = null; // Track in-flight initialization

/**
 * Initialize Web Audio API on first user gesture
 * Returns a promise that resolves when audio is fully ready
 */
async function initAudio() {
    // If already initializing, return the existing promise
    if (audioInitPromise) return audioInitPromise;
    
    // If audio context and buffers already exist, nothing to do
    if (audioCtx && audioBuffers.ohYeah && audioBuffers.sweet) {
        return Promise.resolve();
    }
    
    audioInitPromise = (async () => {
        try {
            // Ensure audioCtx exists (don't recreate if already present)
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                console.log('✅ AudioContext created, state:', audioCtx.state);
            }

            // Resume if suspended (must be called from user gesture context)
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
                console.log('✅ AudioContext resumed, state:', audioCtx.state);
            }

            // Load and decode both audio clips
            if (!audioBuffers.ohYeah) {
                audioBuffers.ohYeah = await loadAndDecode(
                    'assets/sounds/oh_yeah.ogg', 
                    'assets/sounds/oh_yeah.mp3'
                );
            }
            
            if (!audioBuffers.sweet) {
                audioBuffers.sweet = await loadAndDecode(
                    'assets/sounds/sweet.ogg', 
                    'assets/sounds/sweet.mp3'
                );
            }
            
            console.log('✅ Audio fully initialized - context:', audioCtx.state, 'buffers:', !!audioBuffers.ohYeah, !!audioBuffers.sweet);
        } catch (err) {
            console.error('Failed to initialize audio:', err);
            soundsEnabled = false;
            audioInitPromise = null;
            throw err;
        }
    })();
    
    return audioInitPromise;
}

/**
 * Load audio file with fallback
 */
async function loadAndDecode(primaryUrl, fallbackUrl) {
    try {
        const resp = await fetch(primaryUrl);
        const ab = await resp.arrayBuffer();
        return await audioCtx.decodeAudioData(ab);
    } catch (err) {
        console.warn(`Failed to load ${primaryUrl}, trying fallback...`);
        try {
            const resp = await fetch(fallbackUrl);
            const ab = await resp.arrayBuffer();
            return await audioCtx.decodeAudioData(ab);
        } catch (fallbackErr) {
            console.error(`Failed to load both ${primaryUrl} and ${fallbackUrl}:`, fallbackErr);
            throw fallbackErr;
        }
    }
}

/**
 * Play sound via Web Audio API
 */
function playSound(buffer, volume = 0.8) {
    if (!audioCtx || !soundsEnabled || !buffer) return;
    
    try {
        const src = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        
        src.buffer = buffer;
        gain.gain.value = Math.min(volume, 1.0);
        
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(0);
    } catch (err) {
        console.error('Error playing sound:', err);
    }
}

/**
 * Toggle sounds on/off
 */
async function toggleSounds() {
    soundsEnabled = !soundsEnabled;
    localStorage.setItem('soundsEnabled', soundsEnabled);
    
    // Initialize audio on first enable
    if (soundsEnabled && !audioCtx) {
        await initAudio();
    }
    
    return soundsEnabled;
}

/**
 * Ensure audio is initialized/resumed on the first user gesture on each page
 * This addresses the case where user previously enabled sounds (persisted in
 * localStorage) but navigates to a new page where the AudioContext hasn't been
 * created or resumed yet.
 */
function setupPageGestureToInitAudio() {
    // If audio is already fully initialized, nothing to do
    if (audioCtx && audioCtx.state === 'running' && audioBuffers.ohYeah && audioBuffers.sweet) {
        console.log('✅ Audio already initialized on page load');
        return;
    }

    console.log('⏳ Audio needs initialization - waiting for user gesture...');

    const handler = async (ev) => {
        console.log('🎯 User gesture detected, initializing audio...');
        
        try {
            // Initialize audio fully (creates context, resumes, decodes buffers)
            await initAudio();
            console.log('✅ Audio ready after user gesture');
        } catch (err) {
            console.warn('Could not initialize audio on gesture:', err);
        } finally {
            // Remove listeners after first attempt
            document.removeEventListener('pointerdown', handler);
            document.removeEventListener('touchstart', handler);
            document.removeEventListener('keydown', handler);
        }
    };

    // Listen for common user gesture events
    document.addEventListener('pointerdown', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
}

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
            <button class="cta-sound-toggle" id="cta-sound-toggle-${targetElementId}" title="Toggle sound effects">
                ${soundsEnabled ? '🔊' : '🔇'}
            </button>
        </div>
        <div class="cta-links">
            <a href="index.html#connect" class="cta-link">→ <strong>Get in Touch</strong> ✨</a>
        </div>
    `;
    
    // Append to target
    targetElement.appendChild(ctaDiv);
    
    // Set up sound toggle button
    const soundToggleBtn = ctaDiv.querySelector(`#cta-sound-toggle-${targetElementId}`);
    soundToggleBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const enabled = await toggleSounds();
        soundToggleBtn.textContent = enabled ? '🔊' : '🔇';

        // Because this click is a user gesture, ensure AudioContext is resumed
        if (enabled && audioCtx && audioCtx.state === 'suspended') {
            try {
                await audioCtx.resume();
                console.log('✅ AudioContext resumed via toggle button');
            } catch (err) {
                console.warn('Failed to resume AudioContext via toggle:', err);
            }
        }
    });

    // If sounds were previously enabled (localStorage) on a previous page,
    // prepare this page to initialize/resume audio on the next user gesture.
    if (soundsEnabled) {
        setupPageGestureToInitAudio();
    }
    
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
    [emoji1, emoji2].forEach((emoji, emojiIndex) => {
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
        
        // Desktop: mouseenter for sound + visual
        emoji.addEventListener('mouseenter', async () => {
            emoji.classList.add('cta-emoji-portal');
            
            // Play sound on hover (ensure audio is ready first)
            if (soundsEnabled) {
                // If audio isn't initialized yet, try to init (this hover is also a gesture)
                if (!audioCtx || !audioBuffers.ohYeah || !audioBuffers.sweet) {
                    try {
                        await initAudio();
                    } catch (err) {
                        console.warn('Failed to init audio on hover:', err);
                        return;
                    }
                }
                
                // Now play if context is running
                if (audioCtx && audioCtx.state === 'running' && audioBuffers[emojiIndex === 0 ? 'ohYeah' : 'sweet']) {
                    const soundKey = emojiIndex === 0 ? 'ohYeah' : 'sweet';
                    playSound(audioBuffers[soundKey], 0.9);
                }
            }
        });
        
        emoji.addEventListener('mouseleave', () => {
            emoji.classList.remove('cta-emoji-portal');
        });
        
        // Mobile: touchstart to initialize audio and play sound
        emoji.addEventListener('touchstart', async (e) => {
            e.preventDefault();
            
            // Initialize audio context on first touch if needed
            if (!audioCtx) {
                await initAudio();
            }
            
            // Resume audio context if suspended (iOS requirement)
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            // Play sound
            if (soundsEnabled && audioCtx) {
                const soundKey = emojiIndex === 0 ? 'ohYeah' : 'sweet';
                playSound(audioBuffers[soundKey], 0.9);
            }
            
            emoji.classList.add('cta-emoji-portal');
        });
        
        emoji.addEventListener('touchend', () => {
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
