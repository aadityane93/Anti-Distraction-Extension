chrome.runtime.onInstalled.addListener(() => {
    console.log('NE Blocker extension installed.');
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CHECK_VIDEO') {
      fetchVideoDetails(message.videoId).then(isBlocked => {
        sendResponse({ isBlocked });
      });
      return true; // Indicates response will be sent asynchronously
    }
  });
  
  async function fetchVideoDetails(videoId) {
    const apiKey = 'AIzaSyBnJ9afb22z9dcrCbopPxRdiKpTVx8wESQ'; // Replace with your YouTube Data API key
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.items.length > 0) {
        const category = data.items[0].snippet.categoryId;
        return isBlockedCategory(category);
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    }
    return false;
  }
  
  function isBlockedCategory(categoryId) {
    // Define the categories for meme, rap, song, comedy, and skits based on YouTube category IDs
    const blockedCategories = ["10", "23", "24", "34", "35"]; // Example categories: "10" for Music, "23" for Comedy, etc.
    return blockedCategories.includes(categoryId);
  }
  

//AIzaSyBnJ9afb22z9dcrCbopPxRdiKpTVx8wESQ