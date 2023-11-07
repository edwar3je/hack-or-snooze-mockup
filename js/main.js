"use strict";

/** DOM elements defined (using jQuery).
 *  Primarily used to show/hide specific elements.
 */

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $addStoryForm = $("#add-story-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navAddStory = $("#nav-add-story");
const $navFavorites = $("#nav-favorites");
const $navMyStories = $("#nav-my-stories");

const $navFillers = $("#nav-fill-1, #nav-fill-2, #nav-fill-3");

const $notFoundFavorite = $("#not-found-favorite");
const $notFoundOwn = $("#not-found-own");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $addStoryForm,
    $navAddStory,
    $navFavorites,
    $navMyStories,
    $navFillers,
    $notFoundFavorite,
    $notFoundOwn
  ];
  components.forEach(c => c.hide());
}

/** Hides the left navigation components (used when user is not logged in) */

function hideNavComponents() {
  const navComponents = [
    $navAddStory,
    $navFavorites,
    $navMyStories,
    $navFillers
  ]
  navComponents.forEach(n => n.hide());
}

/** Hides not found messages. */

function hideNotFound() {
  const notFoundComponents = [
    $notFoundFavorite,
    $notFoundOwn
  ];
  notFoundComponents.forEach(n => n.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // If we got a logged-in user, update the UI to show left nav links (otherwise, hide the links)
  if (currentUser){
    updateUIOnUserLogin();
  } else {
    hideNavComponents();
  }
}

hideNavComponents();
hideNotFound();

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
