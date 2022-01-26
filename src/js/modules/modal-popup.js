/**
 * Theme modal popups API
 */

document.addEventListener("DOMContentLoaded", function() {
  /**
  * Init modals on page load
  */
  document.querySelectorAll(".modal-popup").forEach(function(container) {
    theme.modalPopup(container);
  });
  /**
  * Init modal open triggers
  */
  document.querySelectorAll(".modal-trigger").forEach(function(trigger) {
    let modalId = trigger.getAttribute("data-modal-id");
    trigger.addEventListener("click", function() {
      if(window.Modals[modalId]) {
        window.Modals[modalId].open();
      }
    });
  });
});

/**
 * Prepare modal popup
 */
theme.modalPopup = (function(container) {
  // modal Open
  const modalOpen = () => {
    container.classList.add("open");
    document.dispatchEvent(new CustomEvent("modal:open", {'detail': container}));
  }

  // modal Close
  const modalClose = () => {
    container.classList.remove("open");
    document.dispatchEvent(new CustomEvent("modal:close", {'detail': container}));
  }

  let modalId = container.getAttribute("data-modal-id");
  window.Modals = window.Modals || [];
  window.Modals[modalId] = {
    "open": modalOpen,
    "close": modalClose
  }

  // move popup container under the body for fix z-index issues
  document.getElementsByTagName("body")[0].appendChild(container);

  container.classList.add("modal-prepared");

  return {
    modalPopup: this
  }
});

// Bind modal close
document.addEventListener("click", function(e) {
  let el = e.target;
  let modal = el.closest(".modal-popup");
  if(!modal) return;
  if((el.classList.contains("modal-popup__content") || el.closest(".modal-popup__content") && !el.classList.contains("modal-popup__close"))) return;
  let modalId = modal.getAttribute("data-modal-id");
  window.Modals[modalId].close();
});

// Modal open event
document.addEventListener("modal:open", function(e) {
  let body = document.getElementsByTagName("body")[0];
  body.classList.add("modal-open");
  body.classList.add("no-scroll");
});

// Modal close event
document.addEventListener("modal:close", function(e) {
  let body = document.getElementsByTagName("body")[0];
  body.classList.remove("modal-open");
  body.classList.remove("no-scroll");
});

export default theme.modalPopup;