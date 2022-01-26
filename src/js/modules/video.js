/**
 * Video section
 * Loads vimeo videos by click
 */

 window.VimeoPlayers = [];
 const prepareVideoIframe = (section) => {
  if(theme.utils.isMobile() && section.getAttribute("data-force-mobile-image") == "true") {
    if(section.closest(".video-loading")) {
      section.closest(".video-loading").classList.remove("skeleton-loading");
    }
    section.classList.add("loaded");
    section.classList.add("force-image");
    return;
  }

  let video_link = theme.utils.isMobile() ? section.getAttribute("data-video-link-mobile") : section.getAttribute("data-video-link");
  if(video_link == "") return;
  let parts = video_link.split("/");
  let video_id = parts[parts.length - 1];
  parts = video_id.split("?");
  video_id = parts[0];
  let extra_params = '';
  if(typeof parts[1] !== 'undefined') {
    extra_params = parts[1];
  }
  let iframe = document.createElement("iframe");
  let options = `?controls=0&loop=1&muted=1&background=1&dnt=true&${extra_params}`;
  iframe.src = "https://player.vimeo.com/video/" + video_id + options;
  iframe.frameborder = "0";
  iframe.allow = "autoplay; fullscreen";
  iframe.allowfullscreen = "true";
  iframe.autoplay = "1";
  iframe.loop = "true";
  iframe.allowfullscreen = "allowfullscreen"; 
  iframe.frameborder = "0";
  iframe.onload = () => {
    if(typeof Vimeo === 'undefined') {
      loadVimeoScript();
      checkIfVimeoIsReady().then(function() {
        window.VimeoPlayers[video_id] = new Vimeo.Player(iframe);
        onVideoReady(section, window.VimeoPlayers[video_id]);
        fixVideoAspect(iframe, window.VimeoPlayers[video_id]);
      });
    }
    else {
      window.VimeoPlayers[video_id] = new Vimeo.Player(iframe);
      onVideoReady(section, window.VimeoPlayers[video_id]);
      fixVideoAspect(iframe, window.VimeoPlayers[video_id]);
    }
  };
  return iframe;
} 

const onVideoReady = (section, player) => {
  console.log("Video ready", player);
  player.play().then(() => {
    if(section.closest(".video-loading")) {
      section.closest(".video-loading").classList.remove("skeleton-loading");
    }
    section.classList.add("loaded");
    section.classList.remove("loading");  
  })
  .catch((error) => {
    console.log("Video error:", error);
  });

  // Fallback for iPhone (play event not fired) 
  setTimeout(() => {
    if(section.closest(".video-loading")) {
      section.closest(".video-loading").classList.remove("skeleton-loading");
    }
    section.classList.add("loaded");
    section.classList.remove("loading");     
  }, 0);
}

// Fix iframe size for equal with the container
const fixVideoAspect = (iframe, player) => {
  // Fix iframe size for equal with the container
  Promise.all([player.getVideoWidth(), player.getVideoHeight()]).then(dimensions => {
    const [width, height] = dimensions;
    let video_aspect = width / height;

    let container = iframe.closest(".video-holder");
    let container_aspect = container.offsetWidth / container.offsetHeight;
    let modifier = 0;
    if(video_aspect > container_aspect) {
      modifier = video_aspect / container_aspect;
    }
    else {
      modifier = container_aspect / video_aspect;
    }
    if(modifier < 3.5) { // limit for max change
      iframe.setAttribute("style", `transform: scale(${modifier});`);
    }
  });
}

/**
 * Prepare video sections and bind Play on click event
 */
let videos = document.querySelectorAll(".video-section");
videos.forEach((section) => {
  let container = section.querySelector(".video-holder");
  let button_play = section.querySelector(".video-button");
  let iframe = prepareVideoIframe(section);
  if(button_play) {
    button_play.addEventListener("click", () => {
      container.appendChild(iframe);
      if(!section.parentElement.classList.contains("video-autoplay")) {
        section.classList.add("loading");
      }
    });
  }
});

/**
 * Bind autoplay on scroll event
 */
document.addEventListener("scroll", () => {
  setTimeout(() => {
    let videos = document.querySelectorAll(".video-autoplay .video-section:not(.loaded)");
    videos.forEach((section) => {
      if(theme.utils.isVisible(section)) {
        let button = section.querySelector(".video-button");
        if(button) {
          button.dispatchEvent(new Event("click"));
        }
      }
    });
  }, 100);
});
document.dispatchEvent(new Event("scroll"));

const checkIfVimeoIsReady = () => {
  var wait;
  var timeout;

  var deferred = new Promise((resolve, reject) => {
    wait = setInterval(function() {
      if (!Vimeo) {
        return;
      }

      clearInterval(wait);
      clearTimeout(timeout);
      resolve();
    }, 500);

    timeout = setTimeout(function() {
      clearInterval(wait);
      reject();
    }, 4000); // subjective. test up to 8 times over 4 seconds
  });

  return deferred;
}

const loadVimeoScript = () => {
  let s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "https://player.vimeo.com/api/player.js";
  document.querySelector("head").append(s);
}