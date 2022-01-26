
theme.cart = {
  cart_mini: document.querySelector("#cart-mini"),

  getCart: function() {
    var url = ''.concat(theme.routes.cart, '?t=').concat(Date.now());
    return fetch(url, {
      credentials: 'same-origin',
      method: 'GET'
    }).then(response => response.json());
  },

  changeItem: function(key, qty) {
    return this._updateCart({
      url: ''.concat(theme.routes.cartChange, '?t=').concat(Date.now()),
      data: JSON.stringify({
        'id': key + "",
        'quantity': qty
      })
    });
  },

  _updateCart: function(params) {
    return fetch(params.url, {
      method: 'POST',
      body: params.data,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .then(function (cart) {
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: {
            cart: cart
          }
        }));
        theme.cart.updateBubbleCount();
        return cart;
      });
  },

  updateBubbleCount: function() {
    let bubble = document.getElementById("cart-bubble-counter");
    theme.cart.getCart().then((cart) => {
      bubble.querySelector("span").innerHTML = cart.item_count;
    });
  },

  addItem: function(button) {
    if(button.tagName == "svg") {
      button = button.parentElement;
    }
    button.classList.add("ajax-loading");
    let form = button.closest("form");
    let data = '';
    let quantity = 1;
    if(form) {
      // add item from the form on product page
      data = theme.utils.serialize(form);
      if(form.querySelector(".product-qty__input")) {
        quantity = parseInt(form.querySelector(".product-qty__input").value);
      }
      else {
        quantity = 1;
      }
    }
    else {
      // collection grid items
      let product_id = button.getAttribute("data-product-id");
      data = `id=${product_id}&quantity=1`;
    }
    fetch(theme.routes.cartAdd, {
      method: 'POST',
      body: data,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.json())
    .then(function(data) {
      if (data.status === 422) {
        console.log(data);
        alert(`Error adding cart product.\r\n${data.description}`);
      } else {
        document.dispatchEvent(new CustomEvent('cart:added', {
          detail: {
            product: data,
            quantity: quantity
          }
        }));
        theme.cart.updateBubbleCount();
      }
      setTimeout(function() {
        button.classList.remove("ajax-loading");
      }, 2000);
    });
  },
  buildCartPopup: function (product, quantity) {
    let cartpopup = document.getElementById("cartPopup");
    let products = cartpopup.querySelector(".cartpopup__products");
    let subtotal = cartpopup.querySelector(".cartpopup__subtotal_price");
    products.classList.add("loading");
    // fill product
    let layout = '';
    let product_price = theme.Currency.formatMoney(product.price, theme.settings.moneyFormat);
    let total_price = theme.Currency.formatMoney(product.price * quantity, theme.settings.moneyFormat);
    layout += `
          <div class="cartpopup__product">
            <div class="cartpopup__product-image">
              <img loading="lazy" src="${product.featured_image.url.replace(".jpg", "_x220.jpg")}" />
            </div>
            <div class="cartpopup__product-data">
              <div class="cartpopup__product-title">
                ${product.product_title}
              </div>
              <div class="d-flex">
                <div class="cartpopup__product-price">
                  <span class="">${quantity}x</span>
                  <span class="">${product_price}</span>
                </div>
              </div>
            </div>
          </div>
        `;
    products.innerHTML = layout;
    subtotal.innerHTML = total_price;
    products.classList.remove("loading");
  },

  checkElement: (e) => {
    const el = e.target;
    const input = el.parentElement.querySelector("input");
    if(el.classList.contains("product-qty__plus")) {
      if(parseInt(input.value) < parseInt(input.getAttribute("max"))) {
        input.value = parseInt(input.value) + 1;
      }
      else {
        alert(theme.strings.qty_limit_reached);
        return false;
      }
    }
    else {
      if(parseInt(input.value) > parseInt(input.getAttribute("min"))) {
        input.value = parseInt(input.value) - 1;
      }
    }

    // Cart page
    if(window.location.pathname.includes("/cart")) {
      const variant_id = input.getAttribute("data-product-id");
      document.getElementsByTagName("body")[0].classList.add("loading");
      theme.cart.changeItem(variant_id, input.value).then((cart) => {
        window.location.reload();
      });
    }
  }
};

  // Remove Cart Item
  document.querySelectorAll('.remove-cart-item').forEach((el => {
    el.addEventListener('click', (e) => {
      theme.cart.changeItem(e.target.closest('tr').getAttribute('data-id'), 0)
      .then(() => e.target.closest('tr').remove())
      .then(() => window.location.reload())
    });
  }));

// Product Qty
document.addEventListener('page:loaded', () => {
  setTimeout(() => {
    let $plusButtons, $minusButtons;
    $plusButtons = [...document.querySelectorAll('.product-qty__plus')];
    $minusButtons = [...document.querySelectorAll('.product-qty__minus')];
    if ($plusButtons.length > 0 && $minusButtons.length > 0) {
      $plusButtons.forEach(el => el.addEventListener('click', theme.cart.checkElement));
      $minusButtons.forEach(el => el.addEventListener('click', theme.cart.checkElement));
    }
  }, 1500);
});

// Cart page Product Qty
document.querySelectorAll(".product-qty__input").forEach(function(el) {
  el.addEventListener("keyup", function(e) {
    if(!window.location.pathname.includes("/cart")) return;
    input = e.target;
    let variant_id = input.getAttribute("data-product-id");
    document.getElementsByTagName("body")[0].classList.add("loading");
    theme.cart.changeItem(variant_id, input.value).then((cart) => {
      window.location.reload();
    });
  });
});

export default theme.cart;
