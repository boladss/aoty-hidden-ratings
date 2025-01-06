// Popup relevant UI elements
const averageRatingsToggle = document.getElementById("toggle-average-ratings");
const ratingBarsToggle  = document.getElementById("toggle-rating-bars");
const perTrackRatingsToggle = document.getElementById("toggle-per-track-ratings");
const saveButton = document.getElementById("hidden-ratings-save");

// Access user preferences from local storage
browser.storage.local.get([
  "hideAverageRatings", 
  "hideRatingBars",
  "hidePerTrackRatings"
], (result) => {
  averageRatingsToggle.checked = result.hideAverageRatings ?? true;
  ratingBarsToggle.checked = result.hideRatingBars ?? false;
  perTrackRatingsToggle.checked = result.hidePerTrackRatings ?? false;
});

// Update preferences
saveButton.addEventListener("click", () => {
  // Consolidate individual preferences
  const preferences = {
    hideAverageRatings: averageRatingsToggle.checked,
    hideRatingBars: ratingBarsToggle.checked,
    hidePerTrackRatings: perTrackRatingsToggle.checked
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