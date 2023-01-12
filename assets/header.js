const header_menu = document.querySelector('.js-menu-drawer-trigger')
const header_nav = document.querySelector('.header__nav');
const drawer_body = document.querySelector('.drawer__body');
const drawer_wapper = document.querySelector('.drawer__wapper');
const icon_close = document.querySelector('.drawer__btn-close');
const overlay = document.querySelector('.drawer__overlay');
const body = document.querySelector('body');

function MenuDrawer() {
  header_menu.addEventListener('click', () => {
    drawer_body.innerHTML = header_nav.innerHTML;
    drawer_wapper.classList.toggle('active');
    overlay.classList.toggle('active');
    drawer_wapper.style.transition = "cubic-bezier(0.5, 0, 0.1, 1) 0.2s 0.05s";
    body.classList.toggle('o-hidden');
  })
  icon_close.addEventListener('click', () => {
    drawer_wapper.classList.toggle('active');
    overlay.classList.toggle('active');
    drawer_wapper.style.transition = "cubic-bezier(0.9,0,0.5,1) 0.2s";
    body.classList.toggle('o-hidden');
  })
  overlay.addEventListener('click', () => {
    drawer_wapper.classList.toggle('active');
    overlay.classList.toggle('active')
    drawer_wapper.style.transition = "cubic-bezier(0.9,0,0.5,1) 0.2s";
    body.classList.toggle('o-hidden');
  })
}
MenuDrawer()

function headerScroll() {
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
      body.classList.remove('scroll-up');
      return;
    }
    if (currentScroll > lastScroll && !body.classList.contains("scroll-down")) {
      // down
      body.classList.remove('scroll-up');
      body.classList.add("scroll-down");
    } else if (
      currentScroll < lastScroll &&
      body.classList.contains("scroll-down")
    ) {
      // up
      body.classList.remove("scroll-down");
      body.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
  });
}
headerScroll()
