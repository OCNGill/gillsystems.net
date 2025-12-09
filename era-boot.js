/**
 * Era Boot Animation - Handles interactive terminal boot sequences
 */

document.addEventListener('DOMContentLoaded', function() {
    initEraTerminals();
});

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
    
    // Boot sequence messages
    const messages = [
        `LOADING ${eraName}_ERA.EXE...`,
        'Initializing memory banks...',
        'Accessing archives...',
        'Loading experiences...',
        'Compiling lessons learned...',
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
            
            // Fade in content
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.transition = 'opacity 0.5s ease-in';
                content.style.opacity = '1';
            }, 50);
        }
    }, 400);
}
