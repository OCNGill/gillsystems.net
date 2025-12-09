/**
 * Era Boot Animation - Handles interactive terminal boot sequences
 */

document.addEventListener('DOMContentLoaded', function() {
    initEraTerminals();
    initTerminalTyping();
});

function initTerminalTyping() {
    const typedText = document.getElementById('terminal-typed-text');
    const cursor = document.getElementById('terminal-cursor');
    const loader = document.getElementById('dark_ages-loader');
    
    if (!typedText || !cursor || !loader) return;
    
    // Start the typing animation after boot sequence completes
    // This will be triggered from the bootEra function
}

function startTerminalTyping(typedText, cursor, loader) {
    // Hide loader and show typing elements
    loader.style.display = 'none';
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
            setTimeout(typeNextChar, 350);
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
    // Hide cursor temporarily
    cursor.style.display = 'none';
    
    // Create enter key element
    const enterKey = document.createElement('span');
    enterKey.className = 'enter-key';
    enterKey.textContent = '↵';
    cursor.parentNode.insertBefore(enterKey, cursor);
    
    // Remove enter key after animation
    setTimeout(() => {
        enterKey.remove();
        cursor.style.display = 'inline';
        if (callback) callback();
    }, 500);
}

function initEraTerminals() {
    const terminals = document.querySelectorAll('.era-terminal');
    
    terminals.forEach(terminal => {
        terminal.addEventListener('click', function() {
            if (!this.classList.contains('booted')) {
                bootEra(this);
            }
        });
        
        // Auto-boot on page load
        setTimeout(() => {
            bootEra(terminal);
        }, 500);
    });
}

function bootEra(terminal) {
    if (terminal.classList.contains('booted')) return;
    
    const eraName = terminal.dataset.era.toUpperCase();
    const loader = terminal.querySelector('[id*="-loader"]');
    const content = terminal.querySelector('[id*="-content"]');
    const scanlines = terminal.querySelector('[id*="-scanlines"]');
    
    if (!loader || !content || !scanlines) return;
    
    terminal.classList.add('booted');
    
    // Boot sequence messages - simplified since we have the typing animation
    const messages = [
        `LOADING ${eraName}_ERA.EXE...`,
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
            
            // Check if this is Dark Ages era for special two-part reveal
            if (terminal.dataset.era === 'dark_ages') {
                revealDarkAges(content);
                
                // Start the terminal typing animation after content reveals
                setTimeout(() => {
                    const typedText = document.getElementById('terminal-typed-text');
                    const cursor = document.getElementById('terminal-cursor');
                    const loader = document.getElementById('dark_ages-loader');
                    if (typedText && cursor && loader) {
                        startTerminalTyping(typedText, cursor, loader);
                    }
                }, 1000);
            } else {
                // Standard fade in for other eras
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.transition = 'opacity 0.5s ease-in';
                    content.style.opacity = '1';
                }, 50);
            }
        }
    }, 600); // Faster boot sequence
}

/**
 * Dark Ages two-part staged reveal with wave color effect
 */
function revealDarkAges(content) {
    const part1 = document.getElementById('dark-ages-part1');
    const part2 = document.getElementById('dark-ages-part2');
    const note = document.getElementById('dark-ages-note');
    
    if (!part1 || !part2 || !note) return;
    
    // Start with everything hidden
    content.style.opacity = '1';
    part1.style.opacity = '0';
    part2.classList.add('hidden');
    note.classList.add('hidden');
    
    // Part 1: Reveal immediately with typing animation and wave effect
    setTimeout(() => {
        part1.classList.add('typing');
        part1.style.opacity = '1';
        part1.classList.add('fade-in');
        
        // Split text into individual letters for wave effect
        splitTextIntoLetters(part1);
        
        // Start wave effect after a brief delay
        setTimeout(() => {
            startWaveEffect(part1);
        }, 200);
        
        // End typing cursor after animation
        setTimeout(() => {
            part1.classList.remove('typing');
            part1.classList.add('typed');
            
            // Part 2: Auto-reveal 1 second after Part 1 completes
            setTimeout(() => {
                part2.classList.remove('hidden');
                part2.classList.add('typing');
                part2.classList.add('fade-in');
                
                // Split Part 2 text and start its wave effect
                splitTextIntoLetters(part2);
                setTimeout(() => {
                    startWaveEffect(part2);
                }, 200);
                
                // End typing cursor and show note
                setTimeout(() => {
                    part2.classList.remove('typing');
                    part2.classList.add('typed');
                    
                    // Show AMD note after Part 2
                    setTimeout(() => {
                        note.classList.remove('hidden');
                        note.classList.add('fade-in');
                    }, 500);
                }, 800);
            }, 1000);
        }, 800);
    }, 100);
}

/**
 * Split paragraph text into individual letter spans, preserving spaces and emojis
 */
function splitTextIntoLetters(paragraph) {
    const text = paragraph.textContent;
    paragraph.innerHTML = '';
    
    // Use Array.from to properly split emojis (handles Unicode properly)
    const characters = Array.from(text);
    
    // Split text into characters, preserving spaces, emojis, and special characters
    for (let i = 0; i < characters.length; i++) {
        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.textContent = characters[i];
        
        // Special handling for spaces to preserve word spacing
        if (characters[i] === ' ') {
            letter.style.whiteSpace = 'pre';
        }
        
        paragraph.appendChild(letter);
    }
}

/**
 * Start the wave color effect on a paragraph
 * Single white letter wave flowing outward from center, then backward
 */
function startWaveEffect(paragraph) {
    const letters = paragraph.querySelectorAll('.letter');
    if (letters.length === 0) return;
    
    // Define text segments that should remain white (headings only)
    const permanentWhitePatterns = [
        'Dark Ages (2010-2016):',
        'Every architect knows:'
    ];
    
    // 1. Mark permanent white letters (Headings)
    permanentWhitePatterns.forEach(pattern => {
        const patternChars = Array.from(pattern);
        // Search for pattern in the letters array
        for (let i = 0; i <= letters.length - patternChars.length; i++) {
            let match = true;
            for (let j = 0; j < patternChars.length; j++) {
                if (letters[i + j].textContent !== patternChars[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                for (let j = 0; j < patternChars.length; j++) {
                    letters[i + j].classList.add('permanent-white');
                }
            }
        }
    });

    // 2. Mark emojis as permanent white
    letters.forEach(letter => {
        const char = letter.textContent;
        if (/\p{Emoji}/u.test(char) || ['💪', '🤖'].includes(char)) {
            letter.classList.add('permanent-white');
        }
    });
    
    // 3. Build a list of "animatable" indices
    // These are indices in the `letters` NodeList that are NOT permanent-white and NOT spaces
    const validIndices = [];
    letters.forEach((letter, index) => {
        if (!letter.classList.contains('permanent-white') && letter.textContent.trim() !== '') {
            validIndices.push(index);
        }
    });

    if (validIndices.length === 0) return;

    // 4. Create the animation sequence (Center -> Outward)
    const centerIndexInValid = Math.floor(validIndices.length / 2);
    const sequence = [];
    
    // Add center
    sequence.push(validIndices[centerIndexInValid]);
    
    // Expand outwards (alternating left/right)
    let offset = 1;
    while (true) {
        let added = false;
        const left = centerIndexInValid - offset;
        const right = centerIndexInValid + offset;
        
        if (left >= 0) {
            sequence.push(validIndices[left]);
            added = true;
        }
        
        if (right < validIndices.length) {
            sequence.push(validIndices[right]);
            added = true;
        }
        
        if (!added) break;
        offset++;
    }
    
    // 5. Run the animation
    let sequenceIndex = 0;
    let direction = 1; // 1 for forward (outward), -1 for backward (inward)
    let currentHighlightedIndex = -1;

    // Clear any existing interval
    if (paragraph.dataset.waveInterval) {
        clearInterval(parseInt(paragraph.dataset.waveInterval));
    }

    const intervalId = setInterval(() => {
        // Turn off current
        if (currentHighlightedIndex !== -1) {
            letters[currentHighlightedIndex].classList.remove('white');
        }

        // Get next target from sequence
        const targetIndex = sequence[sequenceIndex];
        
        // Turn on next
        if (targetIndex !== undefined) {
            letters[targetIndex].classList.add('white');
            currentHighlightedIndex = targetIndex;
        }

        // Advance sequence
        sequenceIndex += direction;

        // Check boundaries and reverse
        if (sequenceIndex >= sequence.length) {
            direction = -1;
            sequenceIndex = sequence.length - 2; 
        } else if (sequenceIndex < 0) {
            direction = 1;
            sequenceIndex = 1;
        }
    }, 50); // Speed of the wave

    paragraph.dataset.waveInterval = intervalId;
}
