// Popup relevant UI elements
const toggleAverageRatings = document.getElementById("toggle-average-ratings");
const toggleRatingBars = document.getElementById("toggle-rating-bars");
const togglePerTrackRatings = document.getElementById("toggle-per-track-ratings");
const saveButton = document.getElementById("hidden-ratings-save");

// Access user preferences from local storage
browser.storage.local.get([
  "hideAverageRatings", 
  "hideRatingBars",
  "hidePerTrackRatings"
], (result) => {
  toggleAverageRatings.checked = result.hideAverageRatings ?? false;
  toggleRatingBars.checked = result.hideRatingBars ?? false;
  togglePerTrackRatings.checked = result.hidePerTrackRatings ?? false;
});

// Update preferences
saveButton.addEventListener("click", () => {
  // Consolidate individual preferences
  const preferences = {
    hideAverageRatings: toggleAverageRatings.checked,
    hideRatingBars: toggleRatingBars.disabled ? false : toggleRatingBars.checked,
    hidePerTrackRatings: togglePerTrackRatings.checked
  }

  // Save preferences to local storage
  browser.storage.local.set(preferences, () => {
    console.log("Preferences saved!", preferences);

    // Send message to content script, to update current viewing page on save
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { type: "updatePreferences", preferences });
    })
  });
})

document.addEventListener('DOMContentLoaded', function () {
  // Disable the rating bars toggle when average ratings are visible
  function handleToggleRatingBars() {
    if (!toggleAverageRatings.checked) {
      toggleRatingBars.disabled = true;
    } else {
      toggleRatingBars.disabled = false;
    }
  }

  // Event listener for the rating bars toggle
  toggleAverageRatings.addEventListener('change', handleToggleRatingBars);

  // Run on startup, but with timeout to ensure checkboxes have been rendered
  setTimeout(() => {
    handleToggleRatingBars();
  }, 100);
})