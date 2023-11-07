"use strict";

const testButton = document.querySelector(".test");

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  if(currentUser){
    $navAddStory.show();
    $navFavorites.show();
    $navMyStories.show();
    $navFillers.show();
  }
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}


$navLogin.on("click", navLoginClick);

/** Show add story form on click on "submit".
 *  Also maintains nav elements on click.
*/

function navAddStoryClick(evt) {
  console.debug("navAddStory", evt);
  hidePageComponents();
  $navAddStory.show();
  $navFavorites.show();
  $navMyStories.show();
  $navFillers.show();
  $addStoryForm.show();
}

$navAddStory.on("click", navAddStoryClick);

/** Shows favorited stories upon clicking "favorites".
 *  Also maintains nav elements on click.
 */

function navFavoritesClick(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  $navAddStory.show();
  $navFavorites.show();
  $navMyStories.show();
  $navFillers.show();
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

/** Shows self-published stories upon clicking "my stories".
 *  Also maintains nav elements on click.
 */

function navOwnStoriesClick(evt) {
  console.debug("navOwnStories", evt);
  hidePageComponents();
  $navAddStory.show();
  $navFavorites.show();
  $navMyStories.show();
  $navFillers.show();
  putOwnStoriesOnPage();
}

$navMyStories.on("click", navOwnStoriesClick);

/** When a user first logins in, update the navbar to reflect that. 
 *  This should include all nav elements previously hidden.
*/

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navAddStory.show();
  $navFavorites.show();
  $navMyStories.show();
  $navFillers.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}