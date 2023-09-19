const btnAddToCart = document.querySelector(".js-product-form-submit-btn");
const drawerOverlay = document.querySelector(".overlay");
const cartDrawer = document.querySelector(".cart-drawer");
const accordionItems = document.querySelectorAll(".js-accordion-trigger");
const accordionContents = document.querySelectorAll(".accordion-content");
const variantSwatchItems = document.querySelectorAll(".js-variant-swatch-item");
const productPrice = document.querySelector(".js-product-prices");
const variantItems = document.querySelectorAll(".js-variant-option-value");
const btnPlus = document.querySelector(".quantity-selector-plus");
const btnMinus = document.querySelector(".quantity-selector-minus");
const valueInput = document.querySelector(".quantity-input");

class updateProduct {
  constructor() {
    this.items =
      [
        {
          'quantity': valueInput.value
        }
      ];
    this.renderInfo();
    this.updateInfo();
    this.updateCart();
    this.handleEvent();
  }

  renderInfo() {
    // Render color swatch
    variantSwatchItems.forEach((variantSwatchItem) => {
      variantSwatchItem.style.backgroundColor = variantSwatchItem.dataset.optionValue;
    });

    // Find selected options
    var selectedOptions = [];
    document.querySelectorAll(".js-variant-item:checked").forEach((variantItemChecked) => {
      selectedOptions.push(variantItemChecked.value)
    });

    // Find the matched variant
    var matchedVariant = product.variants.find(variant => {
      var pass = true;
      for (var i = 0; i < selectedOptions.length; i++) {
        if (selectedOptions.indexOf(variant.options[i]) === -1) {
          pass = false;
          break
        }
      }
      return pass;
    })

    // Change product form variant id
    let productId = document.querySelector("#product-id");
    productId.value = matchedVariant.id;

    // Change status product
    let statusProduct = document.querySelector(".product__status");
    if (matchedVariant.available == true) {
      statusProduct.innerHTML = `<span>• Item is in stock</span>`
    }
    else {
      statusProduct.innerHTML = `<span>• Item is out stock</span>`
    }

    //  Change url
    var url = new URLParse(window.location.href, true);
    url.query.variant = matchedVariant.id;
    window.history.replaceState(null, null, url.toString());

    //  Change prices
    document.querySelector('.product-price-last').textContent = formatMoney(matchedVariant.compare_at_price, moneyFormat);
    document.querySelector('.product-price').textContent = formatMoney(matchedVariant.price, moneyFormat);

    // Change button
    if (matchedVariant.available) {
      btnAddToCart.innerHTML = `<span>Add to cart</span>`;
      btnAddToCart.disabled = false;
    }
    else {
      btnAddToCart.innerHTML = `<span>Out of stock</span>`;
      btnAddToCart.disabled = true;
    };
    this.items[0].id = matchedVariant.id;
  }

  updateInfo() {
    // this.renderInfo();
    variantItems.forEach((variantItem) => {
      variantItem.addEventListener('change', () => {
        this.renderInfo();
      })
    });
  }
  init() {
    const btnPlusCarts = document.querySelectorAll(".js-cart-drawer-quantity-btn-plus");
    const btnMinusCarts = document.querySelectorAll(".js-cart-drawer-quantity-btn-minus");
    const valueInputCarts = document.querySelectorAll(".js-cart-drawer-quantity-input");
    const btnCloseCart = document.querySelector(".js-cart-drawer-btn-close");
    const productId = document.querySelectorAll(".cart-drawer__product-item");
    const btnRemoves = document.querySelectorAll(".js-cart-drawer-delete-btn");

    btnCloseCart.addEventListener('click', () => {
      this.openDrawer();
    })

    btnPlusCarts.forEach( (btnPlusCart, index) => {
      btnPlusCart.addEventListener('click', () => {
        valueInputCarts[index].value++;
        this.changeDataCart(productId[index].getAttribute("data-id"), valueInputCarts[index].value);
      });
    });

    btnMinusCarts.forEach( (btnMinusCart, index) => {
      btnMinusCart.addEventListener('click', () => {
        if(valueInputCarts[index].value > 1) {
          valueInputCarts[index].value--;
          this.changeDataCart(productId[index].getAttribute("data-id"), valueInputCarts[index].value);
        }
      });
    });

    valueInputCarts.forEach((valueInput, index) => {
      valueInput.addEventListener('change', () => {
        this.changeDataCart(productId[index].getAttribute("data-id"), valueInput.value);
      })
    })

    btnRemoves.forEach( (btnRemove, index) => {
      btnRemove.addEventListener('click', () => {
        this.changeDataCart(productId[index].getAttribute("data-id"), 0);
      })
    });
  }
  updateCart() {
    fetch('/?view=cart')
      .then(response => response.text())
      .then(cartData => {
        document.querySelector(".cart-drawer__main").innerHTML = cartData;
        this.init();
      })
  }
  changeDataCart(productId, inputValue) {
    let data = {
      'id': productId,
      'quantity': inputValue
    }
    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.updateCart();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  openDrawer() {
    // open/close drawer
    drawerOverlay.classList.toggle("active");
    cartDrawer.classList.toggle("active");
    body.classList.toggle('o-hidden');
  }
  handleEvent() {
    btnAddToCart.addEventListener("click", (e) => {
      e.preventDefault();
      this.openDrawer();
    });

    drawerOverlay.addEventListener("click", (e) => {
      this.openDrawer();
    });
    btnPlus.addEventListener('click', () => {
      valueInput.value++;
    });
    btnMinus.addEventListener('click', () => {
      if(valueInput.value > 1) {
        valueInput.value--;
      }
    });
    btnAddToCart.addEventListener('click', () => {
      let formData = {
        'items': [
          {
            'id': this.items[0].id,
            'quantity': valueInput.value
          }
        ]
      }
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.updateCart();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
}
const updateProductObj = new updateProduct();

class accordionToggle {
  constructor() {
    this.handleToggle();
  }
  handleToggle() {
    accordionItems.forEach(((accordionItem, index) => {
      if(accordionItem.hasAttribute("open")) {
        accordionContents[index].style.maxHeight = accordionContents[index].scrollHeight + "px";
      }
      accordionItem.addEventListener("click", () => {
        accordionItem.toggleAttribute("open");
        accordionContents[index].classList.toggle("open");
        if(accordionItem.hasAttribute("open")) {
          accordionContents[index].style.maxHeight = accordionContents[index].scrollHeight + "px";
        }
        else {
          accordionContents[index].style.maxHeight = "0";
        }
      });
    }));
  }
}
const accordionObj = new accordionToggle()

class slideShow {
  constructor() {
    this.productMedias = document.querySelectorAll(".product__media")
    this.btnClose = document.querySelector(".js-dialog-close-btn");
    this.dialogMain = document.querySelector(".dialog-main");
    this.slideContainer = document.querySelector(".dialog-gallery-slides");
    this.slideImages = document.querySelectorAll(".dialog-gallery-slide");
    this.btnNext = document.querySelector(".js-slide-next-btn")
    this.btnPrev = document.querySelector(".js-slide-prev-btn")
    this.handleEvent();

    this.withImage = this.slideImages[0].clientWidth;
    // this.slideContainer.style.width = `${this.slideImages.length * this.withImage}px`;
    this.index = 0;
  }
  nextSlide() {
    if (this.index < this.slideImages.length -1) {
      this.index++;
    }
    else {
      this.index = 0
    }
    // this.slideContainer.style.transform = `translateX(-${this.withImage * this.index}px)`;
    this.slideContainer.style.transform = `translateX(-${100 * this.index}%)`;
  }
  prevSlide() {
    if (this.index == 0) {
      this.index = this.slideImages.length -1;
    }
    else {
      this.index--;
    }
    // this.slideContainer.style.transform = `translateX(-${this.withImage * this.index}px)`;
    this.slideContainer.style.transform = `translateX(-${100 * this.index}%)`;
  }
  handleEvent() {
    this.btnClose.addEventListener("click", () => {
      this.dialogMain.classList.add("d-none-important");
      body.classList.toggle('o-hidden');
    });
    this.productMedias.forEach(productMedia => {
      productMedia.addEventListener('click', () => {
        this.dialogMain.classList.remove("d-none-important");
        body.classList.toggle('o-hidden');
      })
    });
    this.btnNext.addEventListener("click", () => {
      this.nextSlide();
    });
    this.btnPrev.addEventListener("click", () => {
      this.prevSlide();
    });
  }
}

const slideShowObj = new slideShow()

// let cartContents = fetch(window.Shopify.routes.root + 'cart/clear.js')
//   .then(response => response.json())
//   .then(function(data){
//     console.log(data);
//   })