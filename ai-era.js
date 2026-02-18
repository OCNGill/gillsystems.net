// AI Era generation functions - called by era-boot.js after typing animation
const container = document.getElementById('ai-content');
const loader = document.getElementById('ai_era-loader');

const fullText = "Left the dealership world as industry consolidation made independence extinct—time to build something they can't acquire.\n\nNow architecting the future: AI-augmented systems that amplify human capability, not replace it. Building with intention: every prompt crafted, every integration purposeful, every solution solving real problems. This site? Built entirely through AI collaboration. The next chapter writes itself in real-time.";

function startTerminalTyping(typedText, cursor, loader) {
    // Keep loader visible (don't hide it for AI era)
    typedText.style.display = 'inline-block';
    cursor.style.display = 'inline-block';

    typedText.textContent = '';

    const text = "G i l l s y s t e m s . n e t";
    let currentIndex = 0;

    setTimeout(() => {
        typeNextChar();
    }, 300);

    function typeNextChar() {
        if (currentIndex < text.length) {
            typedText.textContent = text.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeNextChar, 350);
        } else {
            setTimeout(() => {
                showEnterAnimation(cursor, () => {
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

async function startAIGeneration() {
    // Show "thinking" dots
    loader.textContent = 'INITIALIZING AI_ERA.EXE';
    await new Promise(r => setTimeout(r, 400));

    loader.textContent = 'INITIALIZING AI_ERA.EXE.';
    await new Promise(r => setTimeout(r, 400));

    loader.textContent = 'INITIALIZING AI_ERA.EXE..';
    await new Promise(r => setTimeout(r, 400));

    loader.textContent = 'INITIALIZING AI_ERA.EXE...';
    await new Promise(r => setTimeout(r, 400));

    // Hide loader, show content area
    loader.style.display = 'none';
    container.style.display = 'block';

    // Create heading
    const heading = document.createElement('div');
    heading.className = 'ai-heading';
    heading.style.color = '#ffffff'; // White text for title
    heading.textContent = 'AI Era - what does it really mean?';
    container.appendChild(heading);

    // Create text container with cursor
    const textDiv = document.createElement('div');
    textDiv.className = 'ai-generated-text';

    const textSpan = document.createElement('span');
    textSpan.className = 'ai-text';

    const cursor = document.createElement('span');
    cursor.className = 'ai-cursor';
    cursor.textContent = '█';

    textDiv.appendChild(textSpan);
    textDiv.appendChild(cursor);
    container.appendChild(textDiv);

    // Create a hidden hash version in background
    const hashChars = '0123456789ABCDEF';

    // Pre-populate with hashed version of full text
    const words = fullText.split(' ');
    const letterSpanMap = {}; // Track all letter spans by index
    let globalLetterIndex = 0;

    words.forEach((word, wordIdx) => {
        const wordToAdd = wordIdx === 0 ? word : ' ' + word;
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        if ('AI-augmented systems that amplify human capability,'.includes(word)) {
            wordSpan.classList.add('bold-glow');
        }

        // Create letter spans for all characters (hash initially)
        const chars = Array.from(wordToAdd);
        chars.forEach(char => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'ai-letter';
            letterSpan.dataset.original = char;
            letterSpan.dataset.index = globalLetterIndex;
            letterSpanMap[globalLetterIndex] = letterSpan;

            if (char === ' ' || char === '\n') {
                letterSpan.textContent = char;
                letterSpan.style.whiteSpace = 'pre';
            } else {
                // Start fully hashed
                letterSpan.textContent = hashChars[Math.floor(Math.random() * hashChars.length)];
                letterSpan.style.color = '#666'; // dim gray hash
            }

            wordSpan.appendChild(letterSpan);
            globalLetterIndex++;
        });

        textSpan.appendChild(wordSpan);
    });

    // Now stream the reveal: hash -> white -> green
    const words2 = fullText.split(' ');
    let revealIndex = 0;

    for (let i = 0; i < words2.length; i++) {
        // Reveal word-by-word
        const wordToAdd = i === 0 ? words2[i] : ' ' + words2[i];
        const wordLength = Array.from(wordToAdd).length;

        // After word delay, start revealing its letters
        setTimeout(() => {
            // For each letter in this word, do the decode animation
            for (let j = 0; j < wordLength; j++) {
                const letterIdx = revealIndex + j;
                const letterSpan = letterSpanMap[letterIdx];
                if (letterSpan && letterSpan.textContent !== ' ' && letterSpan.textContent !== '\n') {
                    // Hash flicker phase (40ms per flicker, 5-9 flickers)
                    const randomizeCount = 5 + Math.floor(Math.random() * 4);
                    let flickerCount = 0;

                    const flickerInterval = setInterval(() => {
                        letterSpan.textContent = hashChars[Math.floor(Math.random() * hashChars.length)];
                        flickerCount++;

                        if (flickerCount >= randomizeCount) {
                            clearInterval(flickerInterval);

                            // Reveal as white
                            setTimeout(() => {
                                letterSpan.textContent = letterSpan.dataset.original;
                                letterSpan.style.color = '#ffffff';

                                // Fade to green
                                setTimeout(() => {
                                    letterSpan.style.transition = 'color 0.3s ease';
                                    letterSpan.style.color = '';
                                }, 250);
                            }, j * 25); // Stagger within word
                        }
                    }, 40); // Hash flicker speed
                }
            }

            revealIndex += wordLength;
        }, i * 165); // Word reveal delay (slower - 150-200ms range was 80-120ms)
    }

    // Generation complete - insert CTA component
    await new Promise(r => setTimeout(r, 500));

    // Start white wave effect on all text
    startAIWaveEffect(textSpan);

    // Use the reusable CTA component
    insertCTA('ai-content');

    // Keep cursor blinking
    cursor.style.animation = 'blink 1s infinite';
}

/**
 * Wave effect for AI generated text
 */
function startAIWaveEffect(textContainer) {
    const letters = textContainer.querySelectorAll('.ai-letter');
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
    const waveLength = 15; // How many letters are highlighted at once

    const intervalId = setInterval(() => {
        // Clear all wave highlights
        letters.forEach(letter => letter.classList.remove('ai-wave-active'));

        // Apply wave highlight
        for (let i = 0; i < waveLength; i++) {
            const index = (wavePosition + i) % validIndices.length;
            const letterIndex = validIndices[index];
            letters[letterIndex].classList.add('ai-wave-active');
        }

        wavePosition = (wavePosition + 1) % validIndices.length;
    }, 60); // Wave speed

    textContainer.dataset.waveInterval = intervalId;
}
