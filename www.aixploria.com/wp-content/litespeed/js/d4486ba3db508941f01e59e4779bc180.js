document.addEventListener('DOMContentLoaded', function() {
    const darkModeButton = document.getElementById('dark-mode-button');
    const siteLogo = document.querySelector('.logo24');

    function setLogo(mode) {
        siteLogo.src = mode === 'dark' ? '/wp-content/uploads/2023/02/aixploria-logo-2023.webp' : '/wp-content/uploads/2024/01/logo-light-aixploria-2024.webp'
    }
    darkModeButton.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark-mode')) {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', !1);
            darkModeButton.src = '/wp-content/uploads/2023/09/dark-mode-toggle-icon-5558.webp';
            setLogo('light')
        } else {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('dark-mode', !0);
            darkModeButton.src = '/wp-content/uploads/2023/09/dark-mode-toggle-icon-5558.webp';
            setLogo('dark')
        }
    });
    if (localStorage.getItem('dark-mode') === 'true') {
        document.documentElement.classList.add('dark-mode');
        darkModeButton.src = '/wp-content/uploads/2023/09/dark-mode-toggle-icon-5558.webp';
        setLogo('dark')
    } else {
        setLogo('light')
    }
});