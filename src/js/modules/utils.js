theme.utils = {
  /**
   * Modern way of checking isDevice(typeOf)
   * @param {String} userAgent
   * @returns {Boolean}
   * @example isDevice('mobile');
   *
   * @author Mark Chang
   * @version 1.0.0
   */
  isDevice: (typeOf) => {

    // check different device types and map to window.matchMedia
    const devices = {
      'mobile': '(max-width: 480px)',
      'tablet': '(min-width: 481px) and (max-width: 768px)',
      'desktop': '(min-width: 769px) and (max-width: 979px)',
      'largeDesktop': '(min-width: 980px)'
    };

    // check if device type is valid
    if (!devices[typeOf]) {
      throw new Error('Device type is not valid');
    }

    // return true if typeOf matches the window.matchMedia
    return window.matchMedia(devices[typeOf]).matches;
  },

  /**
   * Check for device screen width
   */
  isMobile: () => {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (w <= 768) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * Check if element is in viewport
   * @param {object} element
   * @returns {boolean}
   * @example isElementInViewport(document.querySelector('.element'));
   *
   * @author Mark Chang
   * @version 1.0.0
   */
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Get browser scrollbar width
   * 
   * @author Alex H 
   * @version 1.0.0
   */
  getScrollbarWidth: () => { return window.innerWidth - document.body.clientWidth },

  /**
   * Determine if element visible in viewport 
   */
  isVisible: (el) => {
    var rect = el.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
  },

  /**
   * Fallback default value
   */
  defaultTo: (value, defaultValue) => {
    return (value == null || value !== value) ? defaultValue : value
  },

  /**
   * Serialize form
   */
  serialize: (form) => {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (
        !field.name ||
        field.disabled ||
        ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
      )
        return;
      if (field.type === 'select-multiple') {
        Array.prototype.slice.call(field.options).forEach(function (option) {
          if (!option.selected) return;
          arr.push(
            encodeURIComponent(field.name) +
            '=' +
            encodeURIComponent(option.value)
          );
        });
        return;
      }
      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
        return;
      arr.push(
        encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
      );
    });
    return arr.join('&');
  },

  /**
   * return the optimized image url from the given shopify img url and specified width
   *
   * @param {string} img_url the original shopify image url
   * @param {number} width the target image width
   * @returns {string} shopify image url
   * @author Jeffrey
   */
  getShopifyImageUsingWidth: (img_url, width) => {
    // most common image sizes
    const commonImageSizes = [200, 360, 540, 720, 1080];

    // get the closest image size form the screen width
    let size = commonImageSizes.reduce((prev, curr) => Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev);

    let queryIndex = img_url.indexOf('?') - 4;
    let newUrl = img_url.substring(0, queryIndex) + `_${size}x` + img_url.substring(queryIndex, img_url.length);
    return newUrl;
  },

  /**
   * return image snippet
   *
   * @param {string} img_url the original shopify image url
   * @param {number} width the target image width
   * @returns {string} <picture> layout
   * @author Jeffrey
   */
  generateImageSnippet: (img_url, width) => {
    let new_img_url = theme.utils.getShopifyImageUsingWidth(img_url, width);
    let imageHTML = `
      <picture class="image-responsive__image">
        <img data-src="${new_img_url}" class="lazy skeleton-loading" loading="lazy" src="${new_img_url}" />
      </picture>
    `.trim();
    return imageHTML;
  },

  /**
   * Infinite scroll pagination
   *  main_container - css selector for main container
   *  grid_container - selector for grid items wrapper
   *  item - selector for grid item 
  */
  infiniteScrollPagination: function (main_container, grid_container, item) {
    let container = document.querySelector(main_container);
    let grid = container.querySelector(grid_container);
    let pagination = container.querySelector(".pagination");
    let next = pagination.querySelector(".next a");
    let isBlocked = false;
    if (!next) return;

    pagination.classList.add("infiniteScroll");
    window.addEventListener("scroll", function (e) {
      setTimeout(function() {
        if (!theme.utils.isVisible(pagination)) return;
        if (!next) return;
        if (isBlocked) return;
        isBlocked = true;
        let url = next.getAttribute("href");
        if (!url) return;
        container.classList.add("loading");
        fetch(url, {
          credentials: 'same-origin',
          method: 'GET'
        }).then(response => response.text())
          .then((data) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            data = doc.querySelector(main_container);
            next = doc.querySelector(".pagination").querySelector(".next a");
            let items = data.querySelectorAll(item);
            items.forEach(function (item) { 
              item.querySelectorAll("[data-src]").forEach(function(el) {
                el.src = el.getAttribute("data-src"); // fix lazy images
              });
              grid.appendChild(item);
            });
            isBlocked = false;
            container.classList.remove("loading");
            theme.initImages(container);
          });
      }, 100);
    });
  },
};

export default theme.utils;
