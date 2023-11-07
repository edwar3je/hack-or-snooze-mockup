"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story. Markup is contingent on a few factors:
 *  - Is the user logged in?
 *  - Did the user favorite the story (must be logged in)?
 *  - Is the story self-published (must be logged in)?
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  // Markup if the user is not signed in
  if(!currentUser){
    return $(`
      <li id="${story.storyId}">
        <div class="story-details">
          <div class="story-hostlink">
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
          </div>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
      <hr>
    `);
  } else {

    /** Markup if the user is signed in, the story was favorited by the user and is a self-published story.
     *  Includes an unfavorite button and a delete button.
     */
    let ownStoryIds = currentUser.ownStories.map(({ storyId }) => storyId);
    for(let favoritedStory of currentUser.favorites){
      if(story.storyId === favoritedStory.storyId && ownStoryIds.includes(story.storyId)){
        return $(`
          <li id="${story.storyId}">
            <div class="story-full">
              <div class="story-buttons">
                <svg class="unfavorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
                <svg class="delete-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
              </div>
              <div class="story-details">
                <div class="story-hostlink">
                  <a href="${story.url}" target="a_blank" class="story-link">
                    ${story.title}
                  </a>
                  <small class="story-hostname">(${hostName})</small>
                </div>
                <small class="story-author">by ${story.author}</small>
                <small class="story-user">posted by ${story.username}</small>
              </div>
            </div>
          </li>
          <hr>
        `);
      }

      /** Markup if the user is signed in, the story was favorited by the user and is not a self-published story.
       *  Includes an unfavorite button.
      */
      else if(story.storyId === favoritedStory.storyId){
        return $(`
          <li id="${story.storyId}">
            <div class="story-full">
              <div class="story-buttons">
                <svg class="unfavorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              </div>
              <div class="story-details">
                <div class="story-hostlink">
                  <a href="${story.url}" target="a_blank" class="story-link">
                    ${story.title}
                  </a>
                  <small class="story-hostname">(${hostName})</small>
                </div>
                <small class="story-author">by ${story.author}</small>
                <small class="story-user">posted by ${story.username}</small>
              </div>
            </div>
          </li>
          <hr>
        `);
      }
    }

    /** Markup if the user is signed in, the story was not favorited by the user and is a self-published story
     *  Includes a favorite button and a delete button.
    */
    if(ownStoryIds.includes(story.storyId)){
      return $(`
        <li id="${story.storyId}">
          <div class="story-full">
            <div class="story-buttons">
              <svg class="favorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
              <svg class="delete-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
            </div>
            <div class="story-details">
              <div class="story-hostlink">
                <a href="${story.url}" target="a_blank" class="story-link">
                  ${story.title}
                </a>
                <small class="story-hostname">(${hostName})</small>
              </div>
              <small class="story-author">by ${story.author}</small>
              <small class="story-user">posted by ${story.username}</small>
            </div>
          </div>
        </li>
        <hr>
      `);
    }

    /** Markup if the user is signed in, the story was not favorited by the user and is not a self-published story
     *  Includes a favorite button.
    */ 
    return $(`
        <li id="${story.storyId}">
          <div class="story-full">
            <div class="story-buttons">
              <svg class="favorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
            </div>
            <div class="story-details">
              <div class="story-hostlink">
                <a href="${story.url}" target="a_blank" class="story-link">
                  ${story.title}
                </a>
                <small class="story-hostname">(${hostName})</small>
              </div>
              <small class="story-author">by ${story.author}</small>
              <small class="story-user">posted by ${story.username}</small>
            </div>
          </div>
        </li>
        <hr>
      `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    // If the user is logged in, an event listener should be added to the favorite/unfavorite buttons
    if(currentUser){
      let favoriteStoryIds = currentUser.favorites.map(({ storyId }) => storyId);
      let ownStoryIds = currentUser.ownStories.map(({ storyId }) => storyId);

      //If the story was favorited, an event listener should be added to the unfavorite button
      if(favoriteStoryIds.includes(story.storyId)){

        // If the story is self-published, an event listener should be added to the delete button
        if(ownStoryIds.includes(story.storyId)){
          $story.on("click", "svg.delete-button", async (evt) => {
            evt.preventDefault();
            await deleteOwnStory(story.storyId);
          })
        }
        $story.on("click", "svg.unfavorite-button", async (evt) => {
          evt.preventDefault();
          await unfavoriteAStory(story.storyId);
        })
      } else {

        /** If the story was not favorited, an event listener should be added to the favorite button 
         *  If the story is self-published, an event listener should be added to the delete button
        */
        if(ownStoryIds.includes(story.storyId)){
          $story.on("click", "svg.delete-button", async (evt) => {
            evt.preventDefault();
            await deleteOwnStory(story.storyId);
          })
        }
        $story.on("click", "svg.favorite-button", async (evt) => {
          evt.preventDefault();
          await favoriteAStory(story.storyId);
        })
      }
    }
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets a list of favorited stories, generates the HTML and places on the page. 
 *  If no stories have been favorited, a special message will display.
*/

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  if(currentUser.favorites.length > 0){
    let ownStoryIds = currentUser.ownStories.map(({ storyId }) => storyId);
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      if(ownStoryIds.includes(story.storyId)){
        $story.on("click", "svg.delete-button", async (evt) => {
          evt.preventDefault();
          await deleteOwnStory(story.storyId);
        })
      }
      $story.on("click", "svg.unfavorite-button", async (evt) => {
        evt.preventDefault();
        await unfavoriteAStory(story.storyId);
      });
      $allStoriesList.append($story);
    }
    $allStoriesList.show();
  } else {
    $allStoriesList.hide();
    $notFoundFavorite.show();
  }
}

/** Gets a list of self-published stories, generates the HTML and places on the page.
 *  If no stories have been published, a special message will display.
 */

function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");

  $allStoriesList.empty();

  if(currentUser.ownStories.length > 0){
    let favoriteStoryIds = currentUser.favorites.map(({ storyId }) => storyId);
    for(let story of currentUser.ownStories){
      const $story = generateStoryMarkup(story);
      if(favoriteStoryIds.includes(story.storyId)){
        $story.on("click", "svg.unfavorite-button", async (evt) => {
          evt.preventDefault();
          await unfavoriteAStory(story.storyId);
        })
      } else {
        $story.on("click", "svg.favorite-button", async (evt) => {
          evt.preventDefault();
          await favoriteAStory(story.storyId);
        })
      }
      $story.on("click", "svg.delete-button", async (evt) => {
        evt.preventDefault();
        await deleteOwnStory(story.storyId);
      });
      $allStoriesList.append($story);
    }
    $allStoriesList.show();
  } else {
    $allStoriesList.hide();
    $notFoundOwn.show();
  }
}

/** Uses static method from StoryList to create a new story and add it to the story list.
 * 
 *  If any of the input values are empty, the function will not create a new Story instance.
 */

async function submitNewStory(evt) {
  console.debug("submitNewStory", evt);
  evt.preventDefault();

  const title = $("#add-story-title").val();
  const author = $("#add-story-author").val();
  const url = $("#add-story-url").val();

  if(!title || !author || !url) return false;

  const newStory = { title: title, author: author, url: url };
  
  await storyList.addStory(currentUser, newStory);

  location.reload();
}

$addStoryForm.on("submit", submitNewStory);

/** An async function that makes an API call to favorite a story, change the "favorite" button
 *  to an "unfavorite" button (adds unfavoriteAStory as an event listener) and adds story to
 *  the current user's favorites in real-time.
 * 
 *  As a bonus, the function also re-creates the HTML for the delete button if the story is
 *  self-published.
 */

async function favoriteAStory(id) {
  let currentStoryId = id;

  // API call that adds story to user's 'favorites' on backend
  await currentUser.addFavorite(currentStoryId);

  const buttonContainer = document.getElementById(currentStoryId)
                              .querySelector('div.story-full')
                              .querySelector('div.story-buttons');
  let ownStoryIds = currentUser.ownStories.map(({ storyId }) => storyId);

  // If the story is self-published, adds an unfavorite button alongside a delete button (otherwise, just adds an unfavorite button)
  if(ownStoryIds.includes(currentStoryId)){
    buttonContainer.innerHTML = `<svg class="unfavorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
                                 <svg class="delete-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
  } else {
    buttonContainer.innerHTML = `<svg class="unfavorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
  }

  // Adds an event listener to the new unfavorite button that allows users to unfavorite the story.
  const newButtonElement = buttonContainer.querySelector('svg.unfavorite-button');
  newButtonElement.addEventListener("click", async (evt) => {
    evt.preventDefault();
    await unfavoriteAStory(currentStoryId);
  });

  // Adds the story object to the user's 'favorites' on the frontend.
  const newStoryInfo = await axios({
    url: `${BASE_URL}/stories/${currentStoryId}`,
    method: "GET",
  });
  let newStory = new Story(newStoryInfo.data.story);
  currentUser.favorites.push(newStory);
}

/** An async function that makes an API call to unfavorite a story and change the "unfavorite" button
 *  to a "favorite" button (adds favoriteAStory as an event listener) and adds story to the current
 *  user's favorites in real-time.
 * 
 *  As a bonus, the function also re-creates the HTML for the delete button if the story is
 *  self-published.
 */

async function unfavoriteAStory(id) {
  let currentStoryId = id;

  // API call that removes story from user's 'favorites' on backend
  await currentUser.removeFavorite(currentStoryId);

  const buttonContainer = document.getElementById(currentStoryId)
                              .querySelector('div.story-full')
                              .querySelector('div.story-buttons');
  let ownStoryIds = currentUser.ownStories.map(({ storyId }) => storyId);

  // If the story is self-published, adds a favorite button alongside a delete button (otherwise, just adds a favorite button)
  if(ownStoryIds.includes(currentStoryId)){
    buttonContainer.innerHTML = buttonContainer.innerHTML = `<svg class="favorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                                                             <svg class="delete-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
  } else {
    buttonContainer.innerHTML = `<svg class="favorite-button" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>`;
  }

  // Adds an event listener to the new favorite button that allows users to favorite the story.
  const newButtonElement = buttonContainer.querySelector('svg.favorite-button');
  newButtonElement.addEventListener("click", async (evt) => {
    evt.preventDefault();
    await favoriteAStory(currentStoryId);
  });

  // Removes the story object from the user's 'favorites' on the front-end.
  const oldStoryInfo = await axios({
    url: `${BASE_URL}/stories/${currentStoryId}`,
    method: "GET",
  });
  let oldStory = new Story(oldStoryInfo.data.story);
  let index;
  for(let x=0; x < currentUser.favorites.length; x++){
    if(currentUser.favorites[x].storyId === oldStory.storyId){
      index = x;
    }
  }
  currentUser.favorites.splice(index, 1);
}

/** Deletes a self-published story on the backend and reloads the page.
 *  Difficult to delete from the DOM while maintaining the page.
 */

async function deleteOwnStory(id){
  try {
    let currentStoryId = id;
    await axios({
      url: `${BASE_URL}/stories/${currentStoryId}`,
      method: "DELETE",
      data: { token: localStorage.getItem("token") }
    });
    location.reload();
  } catch (err) {
    console.log(err)
  }
}