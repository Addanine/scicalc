function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeEnabled = document.body.classList.contains('dark-mode'); // Check if dark mode is enabled
    localStorage.setItem('darkMode', darkModeEnabled);
    updateSliderIcon(darkModeEnabled);
}

function applyDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true'; // Check if dark mode is enabled
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-switch').checked = true;
    }
    updateSliderIcon(darkModeEnabled);
}

function updateSliderIcon(darkModeEnabled) {
    const sliderIcon = document.getElementById('slider-icon');
    if (darkModeEnabled) {
        sliderIcon.src = "{{ url_for('static', filename='assets/moon.svg') }}";
        sliderIcon.alt = "Moon Icon";
    } else {
        sliderIcon.src = "{{ url_for('static', filename='assets/sun.svg') }}";
        sliderIcon.alt = "Sun Icon";
    }
}

document.getElementById('dark-mode-switch').addEventListener('change', toggleDarkMode);

document.addEventListener('DOMContentLoaded', applyDarkModePreference); // Apply dark mode preference when the page loads