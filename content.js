const blockedKeywords = ["music", "vlog", "comedy", "meme", "song", "skit"];
const apiKey = ''; 

function checkCurrentVideo() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  const videoTitle = document.title;

  if (videoId) {
    console.log('Checking current video:', videoId, 'Title:', videoTitle);
    if (isBlockedVideo(videoTitle)) {
      console.log('Blocked video detected via metadata, redirecting to homepage');
      window.location.href = "https://www.youtube.com/";
    } else {
      // If not blocked by metadata, use YouTube API to check category
      checkVideoWithAPI(videoId);
    }
  }
}

function isBlockedVideo(title) {
  return blockedKeywords.some(keyword => title.toLowerCase().includes(keyword));
}

function checkVideoWithAPI(videoId) {
  fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        const category = data.items[0].snippet.categoryId;
        if (isBlockedCategory(category)) {
          console.log('Blocked video detected via API, redirecting to homepage');
          window.location.href = "https://www.youtube.com/";
        }
      } else {
        console.warn('No items found in API response for video ID:', videoId);
      }
    })
    .catch(error => {
      console.error('Error fetching video details:', error);
    });
}

function isBlockedCategory(categoryId) {
  const blockedCategories = ["10", "20", "22", "23", "24", "26"]; // Example categories: "10" for Music, "20" for Gaming, etc.
  return blockedCategories.includes(categoryId);
}

function hideBlockedVideos(videoElements) {
  videoElements.forEach(videoElement => {
    const titleElement = videoElement.querySelector('#video-title');
    const thumbnailLink = videoElement.querySelector('a#thumbnail');
    let videoId = null;

    if (thumbnailLink) {
      console.log('Thumbnail link found:', thumbnailLink.href);
      try {
        const url = new URL(thumbnailLink.href);
        const urlParams = new URLSearchParams(url.search);
        videoId = urlParams.get('v') || getVideoIdFromPath(url.pathname);
      } catch (error) {
        console.error('Error parsing URL:', thumbnailLink.href, error);
      }
    } else {
      console.warn('Thumbnail link is missing for element:', videoElement);
    }

    if (titleElement) {
      const videoTitle = titleElement.innerText || titleElement.textContent;
      if (isBlockedVideo(videoTitle)) {
        replaceWithImage(videoElement);
      } else if (videoId) {
        checkVideoWithAPIForElement(videoId, videoElement);
      }
    } else {
      console.warn('Title element is missing for video element:', videoElement);
    }
  });
}

function checkVideoWithAPIForElement(videoId, videoElement) {
  fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        const category = data.items[0].snippet.categoryId;
        if (isBlockedCategory(category)) {
          replaceWithImage(videoElement);
        }
      } else {
        console.warn('No items found in API response for video ID:', videoId);
      }
    })
    .catch(error => {
      console.error('Error fetching video details:', error);
    });
}

function getVideoIdFromPath(pathname) {
  const parts = pathname.split('/');
  const videoId = parts.length > 1 ? parts[parts.length - 1] : null;
  console.log('Extracted video ID from path:', videoId);
  return videoId;
}

function replaceWithImage(videoElement) {
  const imageElement = document.createElement('img');
  imageElement.src = chrome.runtime.getURL('images/study_harder.png');
  imageElement.alt = "Study Harder";

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
