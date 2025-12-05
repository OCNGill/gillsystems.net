import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    renderTimeline();
    fetchGitHubActivity();
});

function initThemeToggle() {
    const toggleBtn = document.getElementById('legacy-toggle');
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateToggleState(savedTheme === 'theme-legacy');
    }

    toggleBtn.addEventListener('click', () => {
        const isLegacy = body.classList.contains('theme-legacy');

        if (isLegacy) {
            body.classList.remove('theme-legacy');
            body.classList.add('theme-modern');
            localStorage.setItem('theme', 'theme-modern');
            updateToggleState(false);
        } else {
            body.classList.remove('theme-modern');
            body.classList.add('theme-legacy');
            localStorage.setItem('theme', 'theme-legacy');
            updateToggleState(true);
        }
    });
}

function updateToggleState(isLegacy) {
    // Visual state handled by CSS, but could add aria updates here
    console.log(`System State: ${isLegacy ? 'LEGACY_PROTOCOL' : 'MODERN_ARCHITECTURE'}`);
}

function renderTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    if (!timelineContainer) return;

    // Timeline Data - 30 Years of Evolution
    // Based on user input: 30+ years experience, Gill Systems inception ~2002
    const events = [
        { year: '2025', title: 'The Reboot', desc: 'Gillsystems.net reborn. A living system serving humans.' },
        { year: '2023', title: 'VERDI Framework', desc: 'Development of the Visual Environment for Rapid Data Integration.' },
        { year: '2018', title: 'Cloud Native', desc: 'Migration of core enterprise systems to distributed architectures.' },
        { year: '2010', title: 'Legacy Online', desc: 'Launch of the original hand-coded HTML presence. (Toggle to view)' },
        { year: '2002', title: 'System Inception', desc: 'Gill Systems founded. "Systems Should Serve Humans" philosophy established.' },
        { year: '1998', title: 'Enterprise Scale', desc: 'Architecting large-scale solutions for complex organizational needs.' },
        { year: '1995', title: 'Root Access', desc: 'The journey begins. Early adoption of web technologies and systems thinking.' }
    ];

    const html = events.map(event => `
    <div class="timeline-item">
      <div class="timeline-year">[${event.year}]</div>
      <div class="timeline-content">
        <h3>${event.title}</h3>
        <p>${event.desc}</p>
      </div>
    </div>
  `).join('');

    timelineContainer.innerHTML = html;
}

async function fetchGitHubActivity() {
    const feedContainer = document.getElementById('github-feed');
    if (!feedContainer) return;

    try {
        // Fetching public events for OCNGill
        const response = await fetch('https://api.github.com/users/OCNGill/events/public');

        if (!response.ok) {
            if (response.status === 404) throw new Error('User not found');
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const recentEvents = data.slice(0, 5);

        if (recentEvents.length === 0) {
            feedContainer.innerHTML = '<p>No recent public activity detected in the hub.</p>';
            return;
        }

        const html = recentEvents.map(event => {
            const date = new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const type = event.type.replace('Event', '');
            const repo = event.repo.name.split('/')[1] || event.repo.name;

            return `
        <div class="feed-item">
          <span class="feed-date">[${date}]</span>
          <span class="feed-type">${type}</span>
          <span class="feed-repo">${repo}</span>
        </div>
      `;
        }).join('');

        feedContainer.innerHTML = html;
    } catch (error) {
        console.warn('GitHub fetch failed:', error);
        feedContainer.innerHTML = `
      <div class="error-message">
        <p>Unable to establish link with GitHub Mainframe.</p>
        <p class="sub-error">Running in offline mode.</p>
      </div>
    `;
    }
}
