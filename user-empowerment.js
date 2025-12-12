/**
 * User Empowerment Page - Terminal Effects
 * Implements hash reveal and wave effects like Era pages
 */

document.addEventListener('DOMContentLoaded', function() {
    initEmpowermentTerminal();
});

function initEmpowermentTerminal() {
    const terminal = document.querySelector('.empowerment-era');
    if (!terminal) return;
    
    // Start boot sequence
    bootEmpowerment(terminal);
}

function bootEmpowerment(terminal) {
    const loader = document.getElementById('empowerment-loader');
    const content = document.getElementById('empowerment-content');
    const scanlines = document.getElementById('empowerment-scanlines');
    
    if (!loader || !content || !scanlines) return;
    
    terminal.classList.add('booted');
    
    // Boot sequence messages
    const messages = [
        'LOADING USER_EMPOWERMENT.EXE...',
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
            
            // Start terminal typing animation
            const typedText = document.getElementById('empowerment-terminal-typed-text');
            const cursor = document.getElementById('empowerment-terminal-cursor');
            
            if (typedText && cursor) {
                startTerminalTyping(typedText, cursor, loader);
            }
            
            // Start hash reveal animation
            setTimeout(() => {
                revealEmpowermentWithHash(content);
            }, 500);
        }
    }, 800);
}

function startTerminalTyping(typedText, cursor, loader) {
    // Hide loader and show typing elements
    typedText.style.display = 'inline';
    cursor.style.display = 'inline';
    
    // Start with cursor blinking right after prompt (empty typed text)
    typedText.textContent = '';
    
    const text = "G i l l s y s t e m s . n e t";
    let currentIndex = 0;
    
    // Small delay before starting to type (cursor blinks at prompt)
    setTimeout(() => {
        typeNextChar();
    }, 300);
    
    function typeNextChar() {
        if (currentIndex < text.length) {
            typedText.textContent = text.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeNextChar, 280); // Typing speed
        } else {
            // Typing complete, show enter key animation
            setTimeout(() => {
                showEnterAnimation(cursor, () => {
                    // Clear and restart after enter animation
                    setTimeout(() => {
                        typedText.textContent = '';
                        currentIndex = 0;
                        startTerminalTyping(typedText, cursor, loader);
                    }, 800);
                });
            }, 400);
        }
    }
}

function showEnterAnimation(cursor, callback) {
    cursor.style.display = 'none';
    
    const enterKey = document.createElement('span');
    enterKey.className = 'enter-key';
    enterKey.textContent = '↵';
    cursor.parentNode.insertBefore(enterKey, cursor);
    
    setTimeout(() => {
        enterKey.remove();
        cursor.style.display = 'inline';
        if (callback) callback();
    }, 500);
}

/**
 * Hash-decode reveal with wave effect
 * Text starts as random hash characters, then decodes letter by letter
 */
function revealEmpowermentWithHash(content) {
    const textElement = document.getElementById('empowerment-text');
    
    if (!textElement) return;
    
    // Get the reverse-sentence span text if it exists
    const reverseSentence = textElement.querySelector('.reverse-sentence');
    const reverseSentenceText = reverseSentence ? reverseSentence.textContent.trim() : '';
    const fullText = textElement.textContent;
    
    // Words to highlight in white permanently
    const whiteWords = ['SERVE', 'TRANSPARENCY', 'GROWS', 'PARTNERSHIP', 'YOUR', 'SCALE'];
    
    // Create hash characters (0-9, A-F for hex-like appearance)
    const hashChars = '0123456789ABCDEF';
    function randomHashChar() {
        return hashChars[Math.floor(Math.random() * hashChars.length)];
    }
    
    // Replace text with hash, preserving the reverse-sentence structure
    textElement.innerHTML = '';
    
    // Create reverse-sentence span container if we have that text
    const reverseSentenceSpan = reverseSentenceText ? document.createElement('span') : null;
    if (reverseSentenceSpan) {
        reverseSentenceSpan.className = 'reverse-sentence';
    }
    
    const chars = Array.from(fullText);
    const letterSpans = [];
    let charIndex = 0;
    
    chars.forEach((char) => {
        const span = document.createElement('span');
        span.className = 'letter hash-char';
        span.dataset.original = char;
        span.dataset.charIndex = charIndex;
        
        if (char === ' ') {
            span.textContent = ' ';
            span.style.whiteSpace = 'pre';
        } else {
            span.textContent = randomHashChar();
        }
        
        // Determine if this char belongs in the reverse-sentence
        const currentPos = charIndex;
        const inReverseSentence = reverseSentenceText && currentPos < reverseSentenceText.length;
        
        if (inReverseSentence && reverseSentenceSpan) {
            reverseSentenceSpan.appendChild(span);
        } else {
            textElement.appendChild(span);
        }
        
        letterSpans.push(span);
        charIndex++;
    });
    
    // Insert the reverse-sentence span at the beginning if it exists
    if (reverseSentenceSpan && reverseSentenceSpan.childNodes.length > 0) {
        textElement.insertBefore(reverseSentenceSpan, textElement.firstChild);
    }
    
    // Mark white words by their position in the ORIGINAL text (before showing hash)
    whiteWords.forEach(word => {
        const wordIndex = fullText.indexOf(word);
        if (wordIndex !== -1) {
            for (let i = 0; i < word.length; i++) {
                if (letterSpans[wordIndex + i]) {
                    letterSpans[wordIndex + i].classList.add('white-word');
                    // Set to original character immediately (not hash)
                    letterSpans[wordIndex + i].textContent = letterSpans[wordIndex + i].dataset.original;
                }
            }
        }
    });
    
    // Show with hash
    content.style.opacity = '1';
    
    // Decode effect - randomize each letter rapidly then settle to original
    setTimeout(() => {
        // Phase 1: Rapid randomization (creates "decoding" effect)
        let randomizeCount = 0;
        const maxRandomize = 5; // Reduced from 8
        
        const randomizeInterval = setInterval(() => {
            letterSpans.forEach(span => {
                // Don't randomize white words - they stay white the whole time
                if (!span.classList.contains('white-word') && 
                    span.textContent !== ' ' && 
                    span.textContent !== span.dataset.original) {
                    span.textContent = randomHashChar();
                }
            });
            
            randomizeCount++;
            if (randomizeCount >= maxRandomize) {
                clearInterval(randomizeInterval);
                
                // Phase 2: Decode letters one by one from start to end
                let decodeIndex = 0;
                const decodeInterval = setInterval(() => {
                    if (decodeIndex < letterSpans.length) {
                        const span = letterSpans[decodeIndex];
                        // Don't decode white words - they're already correct and white
                        if (!span.classList.contains('white-word') && span.textContent !== ' ') {
                            span.textContent = span.dataset.original;
                            span.classList.remove('hash-char');
                            span.classList.add('decoded');
                        }
                        decodeIndex++;
                    } else {
                        clearInterval(decodeInterval);
                        
                        // Phase 3: Start wave effect
                        setTimeout(() => {
                            startEmpowermentWave(textElement);
                        }, 150); // Reduced from 300ms
                    }
                }, 12); // Faster decode - reduced from 24ms
            }
        }, 32); // Faster randomization - reduced from 64ms
    }, 50); // Reduced initial delay from 100ms
}

/**
 * Mark specific words to appear white permanently
 * These words will stay white throughout all animations
 */
function markWhiteWords(textElement, whiteWords) {
    const letters = textElement.querySelectorAll('.letter');
    const fullText = Array.from(letters).map(l => l.textContent).join('');
    
    whiteWords.forEach(word => {
        let searchPos = 0;
        while (true) {
            const index = fullText.indexOf(word, searchPos);
            if (index === -1) break;
            
            // Verify this is a whole word match (not part of another word)
            const beforeChar = index > 0 ? fullText[index - 1] : ' ';
            const afterChar = index + word.length < fullText.length ? fullText[index + word.length] : ' ';
            // Allow word boundaries to be whitespace OR punctuation
            const isWholeWord = /[\s\.,;:!?\-—]/.test(beforeChar) || index === 0;
            const hasValidEnd = /[\s\.,;:!?\-—]/.test(afterChar) || (index + word.length) >= fullText.length;
            
            if (isWholeWord && hasValidEnd) {
                // Mark letters in this word as white-word (permanent)
                for (let i = 0; i < word.length; i++) {
                    if (letters[index + i]) {
                        letters[index + i].classList.add('white-word');
                        // Remove any transient glow classes
                        letters[index + i].classList.remove('hex-glow');
                    }
                }
            }
            
            searchPos = index + word.length;
        }
    });
}

/**
 * Wave effect - rolling wave of white highlighting through text
 * White-tagged words stay white, everything else pulses with the wave
 */
function startEmpowermentWave(paragraph) {
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
    
    // Create wave sequence starting from beginning
    let wavePosition = 0;
    const waveLength = 15; // How many letters are highlighted at once
    
    const intervalId = setInterval(() => {
        // Clear all highlights except white-word class
        letters.forEach(letter => {
            if (!letter.classList.contains('white-word')) {
                letter.classList.remove('hex-glow');
            }
        });
        
        // Apply glow to wave window
        for (let i = 0; i < waveLength; i++) {
            const index = (wavePosition + i) % validIndices.length;
            const letterIndex = validIndices[index];
            // Only add glow if not a permanent white word
            if (!letters[letterIndex].classList.contains('white-word')) {
                letters[letterIndex].classList.add('hex-glow');
            }
        }
        
        wavePosition = (wavePosition + 1) % validIndices.length;
    }, 60); // Wave speed
    
    paragraph.dataset.waveInterval = intervalId;
}
