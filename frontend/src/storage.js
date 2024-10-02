function toggleDarkMode() { //`toggleDarkMode` should toggle the dark mode class on the body
    document.body.classList.toggle('dark-mode');
    const darkModeEnabled = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkModeEnabled);
    updateSliderIcon(darkModeEnabled);
}

function applyDarkModePreference() { //`applyDarkModePreference` should apply the dark mode preference from local storage
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-switch').checked = true;
    }
    updateSliderIcon(darkModeEnabled);
}

function updateSliderIcon(darkModeEnabled) { //`updateSliderIcon` should update the slider icon based on the dark mode status
    const sliderIcon = document.getElementById('slider-icon');
    if (darkModeEnabled) {
        sliderIcon.src="/frontend/src/assets/moon.svg";
        sliderIcon.alt = "Moon Icon";

    } else {
        sliderIcon.src = "/frontend/src/assets/sun.svg";
        sliderIcon.alt = "Sun Icon";
    }
}

document.getElementById('dark-mode-switch').addEventListener('change', toggleDarkMode); //`dark-mode-switch` should toggle dark mode on change

document.addEventListener('DOMContentLoaded', applyDarkModePreference); //`DOMContentLoaded` should apply dark mode preference on load
