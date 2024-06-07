function checkCurrentVideo() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  if (videoId) {
    chrome.runtime.sendMessage({ type: 'CHECK_VIDEO', videoId }, response => {
      if (response && response.isBlocked) {
        window.location.href = "https://www.youtube.com/";
      }
    });
  }
}

function hideBlockedVideos() {
  const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer');
  videoElements.forEach(videoElement => {
    const videoId = videoElement.querySelector('a#thumbnail')?.href.split('v=')[1];
    if (videoId) {
      chrome.runtime.sendMessage({ type: 'CHECK_VIDEO', videoId }, response => {
        if (response && response.isBlocked) {
          replaceWithImage(videoElement);
        }
      });
    }
  });
}

function replaceWithImage(videoElement) {
  const imageElement = document.createElement('img');
  imageElement.src = chrome.runtime.getURL('images/study_harder.png'); // Assumes you have an image at this path
  imageElement.alt = "Study Harder";

  // Apply styles to match the size of a normal YouTube video thumbnail
  imageElement.style.width = '100%';
  imageElement.style.height = 'auto';
  imageElement.style.objectFit = 'cover'; // Ensures the image covers the area

  const thumbnailElement = videoElement.querySelector('#thumbnail');
  if (thumbnailElement) {
    thumbnailElement.innerHTML = ''; // Clear existing content
    thumbnailElement.appendChild(imageElement); // Add the new image
  }

  const titleElement = videoElement.querySelector('#video-title');
  if (titleElement) {
    titleElement.textContent = 'Study Harder';
  }
}

// Observe changes to the DOM and apply the filter to new elements
function observeDOMChanges() {
  const observer = new MutationObserver(hideBlockedVideos);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('yt-page-data-updated', () => {
  checkCurrentVideo();
  hideBlockedVideos();
  observeDOMChanges();
});
document.addEventListener('DOMContentLoaded', () => {
  checkCurrentVideo();
  hideBlockedVideos();
  observeDOMChanges();
});
