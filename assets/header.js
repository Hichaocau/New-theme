const header_menu = document.querySelector('.js-menu-drawer-trigger')
const header_nav = document.querySelector('.header__nav');
const icon_close = document.querySelector('.drawer__btn-close');
const overlay = document.querySelector('.drawer__overlay');

function MenuDrawer() {
  header_menu.addEventListener('click', () => {
    header_nav.classList.remove('translate100');
    header_nav.classList.add('translate0');
    header_nav.style.transition = "cubic-bezier(0.5, 0, 0.1, 1) 0.2s 0.2s"
    overlay.classList.toggle('active');
  })
  icon_close.addEventListener('click', () => {
    header_nav.classList.add('translate100');
    header_nav.classList.remove('translate0');
    header_nav.style.transition = "cubic-bezier(0.9,0,0.5,1) 0.2s"
    overlay.classList.toggle('active');
  })
  overlay.addEventListener('click', () => {
    header_nav.classList.add('translate100')
    header_nav.classList.remove('translate0')
    header_nav.style.transition = "cubic-bezier(0.9,0,0.5,1) 0.2s"
    overlay.classList.toggle('active')
  })
}
MenuDrawer()
