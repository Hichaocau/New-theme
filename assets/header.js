const header_btn = document.querySelector('.js-menu-drawer-trigger')
const header_nav = document.querySelector('.header__nav');
const icon_close = document.querySelector('.drawer__btn-close');
const overlay = document.querySelector('.drawer__overlay');

header_btn.addEventListener('click', () => {
  header_nav.classList.remove('translate100');
  header_nav.classList.add('translate0');
  overlay.classList.toggle('active');
})

icon_close.addEventListener('click', () => {
  header_nav.classList.add('translate100');
  header_nav.classList.remove('translate0');
  overlay.classList.toggle('active');
})

overlay.addEventListener('click', () => {
  header_nav.classList.add('translate100')
  header_nav.classList.remove('translate0')
  overlay.classList.toggle('active')
})