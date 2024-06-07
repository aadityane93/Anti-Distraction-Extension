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
          videoElement.style.display = 'none';
        }
      });
    }
  });
}

window.addEventListener('yt-page-data-updated', () => {
  checkCurrentVideo();
  hideBlockedVideos();
});
document.addEventListener('DOMContentLoaded', () => {
  checkCurrentVideo();
  hideBlockedVideos();
});
