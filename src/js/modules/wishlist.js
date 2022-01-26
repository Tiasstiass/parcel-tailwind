theme.wishlist = {

  checkAllInWishlist: function () {

    const wishList = this.loadWishList();

    [...document.querySelectorAll('.product-grid-item__tag.heart')].forEach(item => {

      let itemHandle = item.getAttribute('data-handle');

      if (!itemHandle)
        return;

      const [isInWishlist] = this.isInWishlist(itemHandle, wishList);

      if (isInWishlist)
        item.classList.add('wishlist');
    });
  },

  isInWishlist: function (productHandle, wishList) {
    wishList = wishList || this.loadWishList();

    let product = wishList.findIndex(product => product === productHandle);

    return [(product > -1), product];
  },

  toggleItem: function (e) {

    let productHandle = e.dataset.handle;

    if (!productHandle)
      return;

    let wishList = this.loadWishList();

    let [isInWishList, product] = this.isInWishlist(productHandle, wishList);

    // if product is already in wishList => remove;
    if (isInWishList)
      wishList.splice(product, 1);
    else
      wishList = [...wishList, productHandle]

    e.classList.toggle('wishlist');
    // persist changes in localStorage
    this.saveWishList(wishList);
  },

  loadWishList: () => {
    try {
      let persistedState = localStorage.getItem('wishlist');

      if (persistedState === null)
        return [];

      return JSON.parse(persistedState);
    }
    catch (e) {
      console.warn(e);
      return [];
    }
  },

  saveWishList: (list) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(list));
    }
    catch (e) {
      console.warn(e);
    }
  }
}

export default theme.wishlist;
