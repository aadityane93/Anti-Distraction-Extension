chrome.runtime.onInstalled.addListener(() => {
  console.log('NE Blocker extension installed.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_VIDEO') {
    fetchVideoDetails(message.videoId).then(isBlocked => {
      sendResponse({ isBlocked });
    }).catch(error => {
      console.error('Error in fetchVideoDetails:', error);
      sendResponse({ isBlocked: false });
    });
    return true; // Will respond asynchronously
  }
});

async function fetchVideoDetails(videoId) {
  const apiKey = 'AIzaSyBnJ9afb22z9dcrCbopPxRdiKpTVx8wESQ'; // Insert your YouTube Data API key here
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No items found in API response');
    }

    const category = data.items[0].snippet.categoryId;
    return isBlockedCategory(category);
  } catch (error) {
    console.error('Error fetching video details:', error);
    return false;
  }
}

function isBlockedCategory(categoryId) {
  // Define the categories for meme, rap, song, comedy, and skits based on YouTube category IDs
  const blockedCategories = ["10", "20", "22", "23", "24", "26"]; // Example categories: "10" for Music, "20" for Gaming, "22" for Vlogs, etc.
  return blockedCategories.includes(categoryId);
}


  

//AIzaSyBnJ9afb22z9dcrCbopPxRdiKpTVx8wESQ