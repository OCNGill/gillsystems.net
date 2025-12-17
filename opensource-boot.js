/**
 * Open Source Boot Animation - Handles interactive terminal boot sequence
 * Simplified from era-boot.js for single-page use
 */

document.addEventListener('DOMContentLoaded', function() {
    initOpensourceTerminal();
});

function initOpensourceTerminal() {
    const terminal = document.querySelector('.opensource-terminal');
    
    if (!terminal) return;
    
    // Auto-boot on page load
    setTimeout(() => {
        bootOpensource(terminal);
    }, 500);
}

function bootOpensource(terminal) {
    if (terminal.classList.contains('booted')) return;
    
    const loader = document.getElementById('opensource-loader');
    const content = document.getElementById('opensource-content');
    const scanlines = document.getElementById('opensource-scanlines');
    
    if (!loader || !content || !scanlines) return;
    
    terminal.classList.add('booted');
    
    // Boot sequence messages
    const messages = [
        'LOADING OPEN_SOURCE.EXE...',
        'BOOT COMPLETE.'
    ];
    
    let messageIndex = 0;
    const bootInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            loader.textContent = messages[messageIndex];
            messageIndex++;
        } else {
            clearInterval(bootInterval);
            // Hide loader, show content
            loader.style.display = 'none';
            content.classList.remove('hidden');
            scanlines.classList.remove('hidden');
            
            // Apply hash-decode effect with wave
            setTimeout(() => {
                revealWithHashDecode();
            }, 100);
        }
    }, 600);
}

/**
 * Hash-decode reveal with wave effect for opensource content
 */
function revealWithHashDecode() {
    const textElement = document.getElementById('opensource-text');
    const textElement2 = document.getElementById('opensource-text-2');
    
    if (!textElement) return;
    
    // Decode first paragraph
    decodeTextElement(textElement, 'What\'s Open Source?');
    
    // After first paragraph, decode second
    setTimeout(() => {
        if (textElement2) {
            decodeTextElement(textElement2, 'Thirty years of learning');
        }
    }, 2000);
}

function decodeTextElement(textElement, keepWhitePhrase) {
    const originalText = textElement.textContent;
    const chars = Array.from(originalText);
    
    // Find the phrase to keep white
    const keepWhiteStart = originalText.indexOf(keepWhitePhrase);
    const keepWhiteEnd = keepWhiteStart + keepWhitePhrase.length;
    
    // Create hash characters
    const hashChars = '0123456789ABCDEF';
    function randomHashChar() {
        return hashChars[Math.floor(Math.random() * hashChars.length)];
    }
    
    // Replace text with hash
    textElement.innerHTML = '';
    const letterSpans = [];
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'letter hash-char';
        span.dataset.original = char;
        
        // Mark characters that should stay white
        if (index >= keepWhiteStart && index < keepWhiteEnd) {
            span.classList.add('keep-white');
        }
        
        if (char === ' ') {
            span.textContent = ' ';
            span.style.whiteSpace = 'pre';
        } else {
            span.textContent = randomHashChar();
        }
        
        textElement.appendChild(span);
        letterSpans.push(span);
    });
    
    // Show with hash
    textElement.style.opacity = '1';
    
    // Decode effect
    setTimeout(() => {
        // Phase 1: Rapid randomization
        let randomizeCount = 0;
        const maxRandomize = 8;
        
        const randomizeInterval = setInterval(() => {
            letterSpans.forEach(span => {
                if (span.textContent !== ' ' && span.textContent !== span.dataset.original) {
                    span.textContent = randomHashChar();
                }
            });
            
            randomizeCount++;
            if (randomizeCount >= maxRandomize) {
                clearInterval(randomizeInterval);
                
                // Phase 2: Decode letters one by one
                let decodeIndex = 0;
                const decodeInterval = setInterval(() => {
                    if (decodeIndex < letterSpans.length) {
                        const span = letterSpans[decodeIndex];
                        if (span.textContent !== ' ') {
                            span.textContent = span.dataset.original;
                            span.classList.remove('hash-char');
                            if (!span.classList.contains('keep-white')) {
                                span.classList.add('decoded');
                            }
                        }
                        decodeIndex++;
                    } else {
                        clearInterval(decodeInterval);
                        
                        // Phase 3: Start wave effect
                        setTimeout(() => {
                            startWaveEffect(textElement);
                        }, 300);
                    }
                }, 24);
            }
        }, 64);
    }, 100);
}

/**
 * Wave effect - flowing highlight through text
 */
function startWaveEffect(paragraph) {
    const letters = paragraph.querySelectorAll('.letter');
    if (letters.length === 0) return;
    
    // Build list of non-space indices
    const validIndices = [];
    letters.forEach((letter, index) => {
        if (letter.textContent.trim() !== '') {
            validIndices.push(index);
        }
    });
    
    if (validIndices.length === 0) return;
    
    // Create wave sequence
    let wavePosition = 0;
    const waveLength = 18; // Matches the config in solutions-pages.js
    
    const intervalId = setInterval(() => {
        // Clear all highlights
        letters.forEach(letter => letter.classList.remove('hex-glow'));
        
        // Apply glow to wave window
        for (let i = 0; i < waveLength; i++) {
            const index = (wavePosition + i) % validIndices.length;
            const letterIndex = validIndices[index];
            letters[letterIndex].classList.add('hex-glow');
        }
        
        wavePosition = (wavePosition + 1) % validIndices.length;
    }, 70); // Matches waveSpeed in config
    
    paragraph.dataset.waveInterval = intervalId;
}
