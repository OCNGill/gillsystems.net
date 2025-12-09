document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ai-content');
    const loader = document.getElementById('ai-loader');
    
    if (!container || !loader) return;

    const fullText = "Left the dealership world as industry consolidation made independence extinct—time to build something they can't acquire.\n\nNow architecting the future: AI-augmented systems that amplify human capability, not replace it. Building with intention: every prompt crafted, every integration purposeful, every solution solving real problems. This site? Built entirely through AI collaboration. The next chapter writes itself in real-time.";

    // Auto-start after brief delay
    setTimeout(() => {
        startAIGeneration();
    }, 800);

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
        
        // Stream words with white-to-green effect
        const words = fullText.split(' ');
        
        for (let i = 0; i < words.length; i++) {
            // Add word with space (preserve line breaks)
            const wordToAdd = i === 0 ? words[i] : ' ' + words[i];
            
            // Check if this is part of the bold phrase
            const boldPhrase = "AI-augmented systems that amplify human capability,";
            const currentText = textSpan.textContent + wordToAdd;
            
            // Create word span
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.textContent = wordToAdd;
            
            // Check if word is part of bold phrase
            if (boldPhrase.includes(words[i])) {
                wordSpan.classList.add('bold-glow');
            }
            
            // Start as white
            wordSpan.style.color = '#ffffff';
            textSpan.appendChild(wordSpan);
            
            // Transition to green after a moment
            setTimeout(() => {
                wordSpan.style.color = '';
            }, 150);
            
            // Variable delay for natural feel (80-120ms - slower)
            const delay = 80 + Math.random() * 40;
            await new Promise(r => setTimeout(r, delay));
        }
        
        // Generation complete - add CTA prompt
        await new Promise(r => setTimeout(r, 500));
        
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'ai-cta';
        ctaDiv.innerHTML = `
            <div class="cta-line">
                <span class="terminal-prompt">C:\\></span>
                <span class="cta-text">Let's amplify your capabilities! 💪👍</span>
            </div>
            <div class="cta-links">
                <a href="index.html#connect" class="cta-link">→ Get in Touch</a>
            </div>
        `;
        container.appendChild(ctaDiv);
        
        // Fade in CTA
        setTimeout(() => {
            ctaDiv.style.opacity = '1';
        }, 50);
        
        // Keep cursor blinking
        cursor.style.animation = 'blink 1s infinite';
    }
});
