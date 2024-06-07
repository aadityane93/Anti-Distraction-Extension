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
  imageElement.style.width = '100%';
  imageElement.style.height = 'auto';

  videoElement.innerHTML = '';
  videoElement.appendChild(imageElement);
}

window.addEventListener('yt-page-data-updated', () => {
  checkCurrentVideo();
  hideBlockedVideos();
});
document.addEventListener('DOMContentLoaded', () => {
  checkCurrentVideo();
  hideBlockedVideos();
});

