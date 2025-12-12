/**
 * Philosophy Pages - Shared Terminal Effects
 * Handles boot sequence, looped terminal typing, hash reveal, and rolling wave highlight.
 */

document.addEventListener('DOMContentLoaded', () => {
    const configs = [
        {
            key: 'empowerment',
            loaderId: 'empowerment-loader',
            contentId: 'empowerment-content',
            scanlinesId: 'empowerment-scanlines',
            typedTextId: 'empowerment-terminal-typed-text',
            cursorId: 'empowerment-terminal-cursor',
            textId: 'empowerment-text',
            loaderMessages: [
                'LOADING USER_EMPOWERMENT.EXE...',
                'BOOT COMPLETE.'
            ],
            decodeOptions: {
                reverseClass: 'reverse-sentence',
                whiteWords: ['SERVE', 'TRANSPARENCY', 'GROWS', 'PARTNERSHIP', 'YOUR', 'SCALE'],
                waveLength: 15,
                waveSpeed: 60
            }
        },
        {
            key: 'transparency',
            loaderId: 'transparency-loader',
            contentId: 'transparency-content',
            scanlinesId: 'transparency-scanlines',
            typedTextId: 'transparency-terminal-typed-text',
            cursorId: 'transparency-terminal-cursor',
            textId: 'transparency-text',
            loaderMessages: [
                'LOADING RADICAL_TRANSPARENCY.EXE...',
                'BOOT COMPLETE.'
            ],
            decodeOptions: {
                whiteTagSelector: 'white',
                waveLength: 18,
                waveSpeed: 70
            }
        },
        {
            key: 'liberation',
            loaderId: 'liberation-loader',
            contentId: 'liberation-content',
            scanlinesId: 'liberation-scanlines',
            typedTextId: 'liberation-terminal-typed-text',
            cursorId: 'liberation-terminal-cursor',
            textId: 'liberation-text',
            loaderMessages: [
                'LOADING KNOWLEDGE_LIBERATION.EXE...',
                'BOOT COMPLETE.'
            ],
            decodeOptions: {
                whiteTagSelector: 'white',
                waveLength: 18,
                waveSpeed: 70
            }
        },
        {
            key: 'buildbusy',
            loaderId: 'buildbusy-loader',
            contentId: 'buildbusy-content',
            scanlinesId: 'buildbusy-scanlines',
            typedTextId: 'buildbusy-terminal-typed-text',
            cursorId: 'buildbusy-terminal-cursor',
            textId: 'buildbusy-text',
            loaderMessages: [
                'LOADING BUILD_VS_BUY.EXE...',
                'BOOT COMPLETE.'
            ],
            decodeOptions: {
                whiteTagSelector: 'white',
                waveLength: 18,
                waveSpeed: 70
            }
        }
    ];

    configs.forEach(cfg => initPhilosophyTerminal(cfg));
});

function initPhilosophyTerminal(cfg) {
    const terminal = document.querySelector(`[data-philosophy="${cfg.key}"]`);
    if (!terminal || terminal.dataset.initialized) {
        return;
    }

    terminal.dataset.initialized = 'true';
    bootPhilosophyTerminal(terminal, cfg);
}

function bootPhilosophyTerminal(terminal, cfg) {
    if (terminal.classList.contains('booted')) {
        return;
    }

    const loader = document.getElementById(cfg.loaderId);
    const content = document.getElementById(cfg.contentId);
    const scanlines = document.getElementById(cfg.scanlinesId);

    if (!loader || !content || !scanlines) {
        return;
    }

    terminal.classList.add('booted');

    const messages = Array.isArray(cfg.loaderMessages) && cfg.loaderMessages.length
        ? cfg.loaderMessages
        : [`LOADING ${cfg.key.toUpperCase()}.EXE...`, 'BOOT COMPLETE.'];

    let messageIndex = 0;
    const bootInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            loader.textContent = messages[messageIndex];
            messageIndex++;
        } else {
            clearInterval(bootInterval);
            loader.style.display = 'none';
            content.classList.remove('hidden');
            scanlines.classList.remove('hidden');

            if (cfg.typedTextId && cfg.cursorId) {
                const typedText = document.getElementById(cfg.typedTextId);
                const cursor = document.getElementById(cfg.cursorId);
                if (typedText && cursor) {
                    startTerminalTyping(typedText, cursor, cfg.loopText);
                }
            }

            if (cfg.decodeOptions && cfg.textId) {
                setTimeout(() => {
                    revealWithHash(cfg);
                }, cfg.hashDelay || 500);
            }
        }
    }, cfg.bootMessageDelay || 800);
}

function startTerminalTyping(typedText, cursor, loopText = 'G i l l s y s t e m s . n e t') {
    typedText.style.display = 'inline';
    cursor.style.display = 'inline';
    typedText.textContent = '';

    let currentIndex = 0;

    setTimeout(() => {
        typeNextChar();
    }, 300);

    function typeNextChar() {
        if (currentIndex < loopText.length) {
            typedText.textContent = loopText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeNextChar, 280);
        } else {
            setTimeout(() => {
                showEnterAnimation(cursor, () => {
                    setTimeout(() => {
                        typedText.textContent = '';
                        currentIndex = 0;
                        startTerminalTyping(typedText, cursor, loopText);
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
        if (callback) {
            callback();
        }
    }, 500);
}

function revealWithHash(cfg) {
    const textElement = document.getElementById(cfg.textId);
    const content = document.getElementById(cfg.contentId);
    if (!textElement) {
        return;
    }

    const options = cfg.decodeOptions || {};
    const charMeta = buildCharMetadata(textElement, options);
    const originalText = charMeta.map(meta => meta.char === '\n' ? ' ' : meta.char).join('');

    const { letterSpans } = rebuildTextWithHash(textElement, charMeta, options);

    if (options.whiteWords && options.whiteWords.length) {
        markWhiteWords(letterSpans, originalText, options.whiteWords);
    }

    if (content) {
        content.style.opacity = '1';
    }

    setTimeout(() => {
        runDecodeSequence(letterSpans, textElement, options);
    }, options.initialDelay || 50);
}

function buildCharMetadata(textElement, options) {
    const meta = [];
    const walker = document.createTreeWalker(textElement, NodeFilter.SHOW_TEXT, null);

    while (walker.nextNode()) {
        const node = walker.currentNode;
        const textValue = node.textContent || '';
        const isReverse = Boolean(options.reverseClass && node.parentElement && node.parentElement.closest(`.${options.reverseClass}`));
        const isWhite = Boolean(options.whiteTagSelector && node.parentElement && node.parentElement.closest(options.whiteTagSelector));

        for (const char of Array.from(textValue)) {
            meta.push({
                char,
                isReverse,
                isWhite
            });
        }
    }

    return meta;
}

function rebuildTextWithHash(textElement, charMeta, options) {
    textElement.innerHTML = '';

    const letterSpans = [];
    let activeReverseSpan = null;

    charMeta.forEach((meta, index) => {
        const charValue = meta.char === '\n' ? ' ' : meta.char;
        const span = document.createElement('span');
        span.className = 'letter hash-char';
        span.dataset.original = charValue;
        span.dataset.charIndex = String(index);

        if (charValue === ' ') {
            span.textContent = ' ';
            span.style.whiteSpace = 'pre';
        } else {
            span.textContent = randomHashChar();
        }

        if (meta.isWhite) {
            span.classList.add('white-word');
            span.classList.remove('hash-char');
            span.classList.add('decoded');
            span.textContent = charValue;
        }

        if (meta.isReverse && options.reverseClass) {
            if (!activeReverseSpan) {
                activeReverseSpan = document.createElement('span');
                activeReverseSpan.className = options.reverseClass;
                textElement.appendChild(activeReverseSpan);
            }
            activeReverseSpan.appendChild(span);
        } else {
            activeReverseSpan = null;
            textElement.appendChild(span);
        }

        letterSpans.push(span);
    });

    return { letterSpans };
}

function markWhiteWords(letterSpans, originalText, whiteWords) {
    whiteWords.forEach(word => {
        let searchPos = 0;
        while (searchPos < originalText.length) {
            const index = originalText.indexOf(word, searchPos);
            if (index === -1) {
                break;
            }

            for (let i = 0; i < word.length; i++) {
                const span = letterSpans[index + i];
                if (span) {
                    span.classList.add('white-word');
                    span.classList.remove('hash-char');
                    span.classList.add('decoded');
                    span.textContent = span.dataset.original;
                }
            }

            searchPos = index + word.length;
        }
    });
}

function runDecodeSequence(letterSpans, paragraph, options) {
    const maxRandomize = options.randomizeIterations || 5;
    const randomizeSpeed = options.randomizeSpeed || 32;
    const decodeSpeed = options.decodeSpeed || 12;
    const waveDelay = options.waveDelay || 150;

    let randomizeCount = 0;
    const randomizeInterval = setInterval(() => {
        letterSpans.forEach(span => {
            const original = span.dataset.original || '';
            if (!span.classList.contains('white-word') && original.trim() !== '') {
                span.textContent = randomHashChar();
            }
        });

        randomizeCount++;
        if (randomizeCount >= maxRandomize) {
            clearInterval(randomizeInterval);

            let decodeIndex = 0;
            const decodeInterval = setInterval(() => {
                if (decodeIndex < letterSpans.length) {
                    const span = letterSpans[decodeIndex];
                    const original = span.dataset.original || '';
                    if (!span.classList.contains('white-word') && original.trim() !== '') {
                        span.textContent = original;
                        span.classList.remove('hash-char');
                        span.classList.add('decoded');
                    } else if (original.trim() === '') {
                        span.textContent = original;
                    }
                    decodeIndex++;
                } else {
                    clearInterval(decodeInterval);
                    setTimeout(() => {
                        startWaveEffect(paragraph, options);
                    }, waveDelay);
                }
            }, decodeSpeed);
        }
    }, randomizeSpeed);
}

function startWaveEffect(paragraph, options = {}) {
    const letters = paragraph.querySelectorAll('.letter');
    if (!letters.length) {
        return;
    }

    const waveLength = options.waveLength || 15;
    const waveSpeed = options.waveSpeed || 60;

    const validIndices = [];
    letters.forEach((letter, index) => {
        const original = letter.dataset.original || '';
        if (original.trim() !== '') {
            validIndices.push(index);
        }
    });

    if (!validIndices.length) {
        return;
    }

    if (paragraph.dataset.waveInterval) {
        clearInterval(Number(paragraph.dataset.waveInterval));
    }

    let wavePosition = 0;
    const intervalId = setInterval(() => {
        letters.forEach(letter => {
            if (!letter.classList.contains('white-word')) {
                letter.classList.remove('hex-glow');
            }
        });

        for (let i = 0; i < waveLength; i++) {
            const index = validIndices[(wavePosition + i) % validIndices.length];
            const letter = letters[index];
            if (!letter.classList.contains('white-word')) {
                letter.classList.add('hex-glow');
            }
        }

        wavePosition = (wavePosition + 1) % validIndices.length;
    }, waveSpeed);

    paragraph.dataset.waveInterval = String(intervalId);
}

function randomHashChar() {
    const hashChars = '0123456789ABCDEF';
    return hashChars[Math.floor(Math.random() * hashChars.length)];
}
