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
  
  window.addEventListener('yt-page-data-updated', checkCurrentVideo);
  document.addEventListener('DOMContentLoaded', checkCurrentVideo);
  