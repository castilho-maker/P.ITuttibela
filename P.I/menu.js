// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
}