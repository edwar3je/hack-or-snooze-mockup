"use strict";

const testButton = document.querySelector(".test");

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */
console.log("testing this part");

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}


$navLogin.on("click", navLoginClick);

/** Show add story form on click on "submit" */

// Test comment

function navAddStoryClick(evt) {
  console.debug("navAddStory", evt)
  console.log("you just clicked the add story button");
}

testButton.addEventListener("click", navAddStoryClick);
$navAddStory.on("click", navAddStoryClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navAddStory.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}