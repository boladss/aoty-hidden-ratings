// Hide rating and make element visible (loaded as hidden to prevent flashes)
function hideRating(element) {
  element.textContent = '??';
  element.style.visibility = 'visible';
  return;
}

document.addEventListener("DOMContentLoaded", () => {
  // Releases page
  document.querySelectorAll('.rating').forEach(element => {hideRating(element)});
  
  // Lists
  document.querySelectorAll('.scoreValue').forEach(element => {hideRating(element)});
  
  // Per-track rating
  // document.querySelectorAll('.trackRating').forEach(element => {hideRating(element)});

  // Critic score
  const criticScore = document.querySelector('.albumCriticScore a');
  if (criticScore) hideRating(criticScore)
  
  // User score
  const userScore = document.querySelector('.albumUserScore a');
  if (userScore) hideRating(userScore)
});


