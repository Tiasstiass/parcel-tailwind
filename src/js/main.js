// Import 3rd party libraries from node_modules
// ex.: import React from 'react';

// Global namespace
window.theme = window.theme || {};

// Import as function from module exports
// ex.: use import from to init manually the module
import labBranding from './modules/lab_branding';

import cart from './modules/cart.js';
theme.cart = cart;

import wishlist from './modules/wishlist';
theme.wishlist = wishlist;

import item from './modules/item';
theme.item = item;

import currency from './modules/currency.js';
theme.Currency = currency;

import modals from './modules/modal-popup.js';
theme.modalPopup = modals;

import utils from './modules/utils.js';
theme.utils = utils;

import LazyLoad from 'vanilla-lazyload'
window.LazyLoad = LazyLoad;

import Splide from '@splidejs/splide';
window.Splide = Splide;

import fslightbox from 'fslightbox';
window.Lightbox = fslightbox;

// Init Main Javascript
theme.initMain = () => {
  // lab branding
  labBranding();
}

/*************************************************************************************/
/********************************* DO NOT EDIT BELOW *********************************/
/*************************************************************************************/
/**
 * Custom DOMready function
 * @param {*} callback
 */
theme.DOMready = (callback) => {
  if (document.readyState !== 'loading') callback();
  else document.addEventListener('DOMContentLoaded', callback);
}

/**
 * Use this event listener to run your JS after the DOM is ready
 */
theme.DOMready(() => {
  // Init Main JS
  theme.initMain();
  // dispatch customEvent
  document.dispatchEvent(new CustomEvent('page:loaded'));
});
