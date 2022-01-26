theme.item = {

  getShopifyItem: async (itemHandle) => {
    try {
      let product = await fetch(`/products/${itemHandle}`);
      product = await product.text();

      const parser = new DOMParser();
      const HTMLDocument = parser.parseFromString(product, "text/html");

      let container = HTMLDocument.documentElement.querySelector("#ProductJson");
      let item = JSON.parse(container.innerHTML);

      item.image = item.featured_image;
      return item;
    }
    catch (e) {
      console.error(e.stack);
      return undefined;
    }
  }
}

export default theme.item;
