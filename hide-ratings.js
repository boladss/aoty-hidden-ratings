// Hide rating and make element visible
function hideRating(element) {

  // Only hide ratings when viewing releases, but display when viewing a user profile
  if (!window.location.pathname.startsWith("/user/")) {

    // Store original value when hiding to access later when needed
    if (!element.dataset.ratingOriginalValue && element.textContent !== "NR") { 
      element.dataset.ratingOriginalValue = element.textContent.trim(); // Store original value
      
      // Check if element is in a trackRatings container (need to save color)
      if (element.closest('.trackRating')) {
        element.dataset.trackOriginalColor = getComputedStyle(element).color;
        element.style.color = 'dimgray'; // Hide color
      }

      element.textContent = '??'; // Hide rating
    }
  };
  return;
}

// Show rating and make element visible
function showRating(element) {
  if (element.dataset.ratingOriginalValue) {
    element.textContent = element.dataset.ratingOriginalValue; // Restore original value

    // Restore per-track color
    if (element.dataset.trackOriginalColor) {
      element.style.color = element.dataset.trackOriginalColor;
      delete element.dataset.trackOriginalColor; // Cleanup
    }

    delete element.dataset.ratingOriginalValue; // Cleanup
  }
}

function hideRatingBar(element) {
  // Only hide ratings when viewing releases, but display when viewing a user profile
  if (!window.location.pathname.startsWith("/user/")) {

    // Store bar data
    if (!element.dataset.ratingBarOriginalWidth && !element.dataset.ratingBarOriginalColor) {
      element.dataset.ratingBarOriginalWidth = element.style.width;
      element.dataset.ratingBarOriginalColor = getComputedStyle(element).backgroundColor;
      element.style.width = '0%';
      // bar.style.backgroundColor = 'dimgray';
    }
  }
}

function showRatingBar(element) {
  if (element.dataset.ratingBarOriginalWidth) {
    element.style.width = element.dataset.ratingBarOriginalWidth;
    element.style.backgroundColor = element.dataset.ratingBarOriginalColor;
    delete element.dataset.ratingBarOriginalWidth;
    delete element.dataset.ratingBarOriginalColor;
  }
}

// Apply preferences for all elements
function applyPreferences(preferences) {

  // Helper function to toggle hiding/showing ratings
  function toggleRatings(elements, hide) {
    elements.forEach(element => {
      hide ? hideRating(element) : showRating(element);
    });
  }

  function toggleRatingBars(bars, hide) {
    bars.forEach(bars => {
      hide ? hideRatingBar(bars) : showRatingBar(bars);
    })
  }

  // ----- AVERAGE RATINGS -----

  // RELEASE PAGE: Average critic and user rating
  const criticScore = document.querySelector('.albumCriticScore a');
  const userScore = document.querySelector('.albumUserScore a');

  // RELEASES PAGE: Average rating subtitles per release, with exceptions for individual reviews
  const averageRatingsReleases = document.querySelectorAll(".rating:not(.yourRatingContainer .rating):not(.albumReviewRow .rating)")

  // LISTS: Average ratings on lists (e.g., "Best of 2024")
  const averageRatingsLists = document.querySelectorAll('.scoreValue');

  // ----- PER-TRACK RATINGS -----
  const perTrackRatings = document.querySelectorAll('.trackRating span');

  // ----- RATING BARS -----
  const ratingBars = document.querySelectorAll('.ratingBar div:not(.yourRatingContainer .ratingBar div):not(.albumReviewRow .ratingBar div)');

  // Toggle elements
  toggleRatings([criticScore, userScore].filter(Boolean), preferences.hideAverageRatings);
  toggleRatings([...averageRatingsReleases, ...averageRatingsLists], preferences.hideAverageRatings);
  toggleRatings([...perTrackRatings], preferences.hidePerTrackRatings);

  toggleRatingBars([...ratingBars], preferences.hideRatingBars);
}

// Add listener for messages from the popup
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "updatePreferences") {
    applyPreferences(message.preferences);
  }
})

// Update DOM based on preferences upon loading
document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get([
    "hideAverageRatings", 
    "hideRatingBars",
    "hidePerTrackRatings"
  ], preferences => {
    applyPreferences(preferences);
  })
});