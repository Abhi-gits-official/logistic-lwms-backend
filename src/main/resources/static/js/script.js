// This file contains JavaScript code for the frontend application, handling user interactions, and dynamic content updates.

document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const bootstrapTheme = document.getElementById('bootstrap-theme');
    const body = document.body;
    const card = document.querySelector('.card');
    const loginTitle = document.querySelector('.login-title');
    const loginSubtitle = document.querySelector('.login-subtitle');
    const modules = document.querySelectorAll('.module');
    const toast = document.getElementById('toast');
    let darkMode = false;    // Form elements (but no custom submit handler)
    const loginForm = document.getElementById('login-form');
    
    // Remove the custom login form submit handler so the form submits to the backend
    // The form will now submit normally to /thymeleaf/admin/login

    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        if (darkMode) {
            bootstrapTheme.href = "https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-dark.min.css";
            body.classList.remove('bg-light', 'text-dark');
            body.classList.add('bg-dark', 'text-light');
            card.classList.remove('bg-white', 'text-dark');
            card.classList.add('bg-dark', 'text-light');
            loginTitle.style.color = "#fff";
            loginSubtitle.classList.remove('text-muted');
            loginSubtitle.classList.add('text-light');
            themeToggle.textContent = "☀️";
        } else {
            bootstrapTheme.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
            body.classList.remove('bg-dark', 'text-light');
            body.classList.add('bg-light', 'text-dark');
            card.classList.remove('bg-dark', 'text-light');
            card.classList.add('bg-white', 'text-dark');
            loginTitle.style.color = "#2c3e50";
            loginSubtitle.classList.remove('text-light');
            loginSubtitle.classList.add('text-muted');
            themeToggle.textContent = "🌙";
        }
    });

    function showModule(event, moduleId) {
        modules.forEach(module => {
            module.classList.remove('active');
        });
        document.getElementById(moduleId).classList.add('active');

        // Hide toast when switching modules
        toast.classList.add('hidden');
    }


    // // Example function to show toast notification
    // function showToast(message) {
    //     toast.textContent = message;
    //     toast.classList.remove('hidden');
    //     setTimeout(() => {
    //         toast.classList.add('hidden');
    //     }, 3000);
    // }

    // Add event listeners for navigation
    const navItems = document.querySelectorAll('.sidebar li');
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const moduleId = item.getAttribute('onclick').match(/'([^']+)'/)[1];
            showModule(event, moduleId);
        });
    });
});