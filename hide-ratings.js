// Hide rating and make element visible
function hideRating(element) {

  // Only hide ratings when viewing releases, but display when viewing a user profile
  if (!window.location.pathname.startsWith("/user/")) {

    // Store original value when hiding to access later when needed
    if (!element.dataset.ratingOriginalValue) { 
      element.dataset.ratingOriginalValue = element.textContent.trim(); // Store original value
      element.textContent = '??'; // Hide rating
    }
  };
  return;
}

// Show rating and make element visible
function showRating(element) {
  if (element.dataset.ratingOriginalValue) {
    element.textContent = element.dataset.ratingOriginalValue; // Restore original value
    delete element.dataset.ratingOriginalValue; // Cleanup
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

  // RELEASE PAGE: Average critic and user ratings
  const criticScore = document.querySelector('.albumCriticScore a');
  const userScore = document.querySelector('.albumUserScore a');

  // RELEASES PAGE: Average rating subtitles per release, with exceptions for individual reviews
  const averageRatings = document.querySelectorAll(".rating:not(.yourRatingContainer .rating):not(.albumReviewRow .rating)")

  // Toggle elements
  toggleRatings([criticScore, userScore].filter(Boolean), preferences.hideAverageRatings);
  toggleRatings([...averageRatings], preferences.hideAverageRatings);
    
  // Lists
  // document.querySelectorAll('.scoreValue').forEach(element => {hideRating(element)});
  
  // Per-track rating
  // document.querySelectorAll('.trackRating').forEach(element => {hideRating(element)});
}

// Add listener for messages from the popup
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "updatePreferences") {
    applyPreferences(message.preferences);
  }
})

// Update DOM based on preferences upon loading
document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(["hideAverageRatings"], preferences => {
    applyPreferences(preferences);
  })
});