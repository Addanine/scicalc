function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeEnabled = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkModeEnabled);
    updateSliderIcon(darkModeEnabled);
}

function applyDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
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

document.addEventListener('DOMContentLoaded', applyDarkModePreference);