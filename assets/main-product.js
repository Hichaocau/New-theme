// const body = document.querySelector("body");
const btnAddToCart = document.querySelector(".js-product-form-submit-btn");
const drawerOverlay = document.querySelector(".overlay");
const cartDrawer = document.querySelector(".cart-drawer");
const btnClose = document.querySelector(".js-cart-drawer-btn-close");
const accordionItems = document.querySelectorAll(".js-accordion-trigger");
const accordionContents = document.querySelectorAll(".accordion-content");
const variantSwatchItems = document.querySelectorAll(".js-variant-swatch-item");
const productPrice = document.querySelector(".js-product-prices");
const variantItems = document.querySelectorAll(".js-variant-option-value");
const btnPlus = document.querySelector(".quantity-selector-plus");
const btnMinus = document.querySelector(".quantity-selector-minus");
const valueInput = document.querySelector(".quantity-input");


// console.log(product);
class updateProduct {
  constructor() {
    this.updateInfo();
    this.renderColorSwatch();
    this.handleEvent();
    this.getdataApi();
  }
  updateInfo() {
    variantItems.forEach((variantItem) => {
      variantItem.addEventListener('change', () => {

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

        this.getdataApi(matchedVariant);

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
      })
    });
  }
  handleEvent() {
    const btnPlusCarts = document.querySelectorAll(".js-cart-drawer-quantity-btn-plus");
    const btnMinusCarts = document.querySelectorAll(".js-cart-drawer-quantity-btn-minus");
    const valueInputCarts = document.querySelectorAll(".js-cart-drawer-quantity-input");

    btnPlus.addEventListener('click', () => {
      valueInput.value++;
    });
    btnMinus.addEventListener('click', () => {
      if(valueInput.value > 1) {
        valueInput.value--;
      }
    });

    btnPlusCarts.forEach( (btnPlusCart, index) => {
      btnPlusCart.addEventListener('click', () => {
        valueInputCarts[index].value++;
        this.updateInfo();
      });
    });

    btnMinusCarts.forEach( (btnMinusCart, index) => {
      btnMinusCart.addEventListener('click', () => {
        if(valueInputCarts[index].value > 1) {
          valueInputCarts[index].value--;
        }
      });
    });
  }
  renderColorSwatch() {
    variantSwatchItems.forEach((variantSwatchItem, index) => {
      variantSwatchItem.style.backgroundColor = variantSwatchItem.dataset.optionValue;
    });
  }
  getdataApi(dataProduct) {
    // var cartContents = fetch(window.Shopify.routes.root + 'cart.js')
    //   .then(response => response.json())
    //   .then(data => {
    //     // console.log(data);
    //     return data
    //   })

    btnAddToCart.addEventListener('click', () => {
      console.log(dataProduct);
      if (dataProduct) {
        this.updateInfo();
        let formData = {
          'items': [
            {
              'id': dataProduct.id,
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
        .then(response => {
          console.log(response);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

    });
  }
}
const updateProductObj = new updateProduct();


class cartDrawerMain {
  constructor() {
    this.handleEvent();
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

    btnClose.addEventListener("click", (e) => {
      this.openDrawer();
    });
  }
}
const cartDrawerObj = new cartDrawerMain();



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


// let cartContents = fetch(window.Shopify.routes.root + 'cart/clear.js')
//   .then(response => response.json())
//   .then(function(data){
//     console.log(data);
//   })