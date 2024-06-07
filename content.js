const blockedKeywords = ["music", "vlog", "comedy", "meme", "song", "skit"];

function checkCurrentVideo() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  const videoTitle = document.title;

  if (videoId) {
    console.log('Checking current video:', videoId, 'Title:', videoTitle);
    if (isBlockedVideo(videoTitle)) {
      window.location.href = "https://www.youtube.com/";
    }
  }
}

function isBlockedVideo(title) {
  return blockedKeywords.some(keyword => title.toLowerCase().includes(keyword));
}

function hideBlockedVideos(videoElements) {
  videoElements.forEach(videoElement => {
    const titleElement = videoElement.querySelector('#video-title');
    if (titleElement) {
      const videoTitle = titleElement.innerText || titleElement.textContent;
      if (isBlockedVideo(videoTitle)) {
        replaceWithImage(videoElement);
      }
    } else {
      console.warn('Title element is missing for video element:', videoElement);
    }
  });
}

function replaceWithImage(videoElement) {
  const imageElement = document.createElement('img');
  imageElement.src = chrome.runtime.getURL('images/study_harder.png');
  imageElement.alt = "Study Harder";

  // Apply styles to match the size of a normal YouTube video thumbnail
  imageElement.style.width = '100%';
  imageElement.style.height = 'auto';
  imageElement.style.objectFit = 'cover';

  videoElement.innerHTML = '';
  videoElement.appendChild(imageElement);
}

function observeDOMChanges() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('ytd-rich-item-renderer') ||
             node.matches('ytd-grid-video-renderer') ||
             node.matches('ytd-video-renderer'))) {
          console.log('New video element added:', node);
          hideBlockedVideos([node]);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('yt-page-data-updated', () => {
  try {
    console.log('yt-page-data-updated event');
    checkCurrentVideo();
    hideBlockedVideos(document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer'));
    observeDOMChanges();
  } catch (error) {
    console.error('Error during yt-page-data-updated event:', error);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOMContentLoaded event');
    checkCurrentVideo();
    hideBlockedVideos(document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer'));
    observeDOMChanges();
  } catch (error) {
    console.error('Error during DOMContentLoaded event:', error);
  }
});
