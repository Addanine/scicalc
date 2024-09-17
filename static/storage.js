function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function applyDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-switch').checked = true;
    }
}

document.getElementById('dark-mode-switch').addEventListener('change', toggleDarkMode);

document.addEventListener('DOMContentLoaded', applyDarkModePreference);