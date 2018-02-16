import '@babel/polyfill';

import { getSuggestItems, getSearchItems } from 'shared/processQuery';

import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_ENTER } from 'react-app/constants/keys';

import '../react-app/components/Input/Input.scss';
import '../react-app/components/Spinner/Spinner.scss';
import '../react-app/App.scss';


var escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

var input = document.querySelector('input');
var placeholder = document.querySelector('.input__placeholder');
var searchResults = document.querySelector('.search-results');
var searchResultsItems = document.querySelector('.search-results__items');
var searchResultsLabel = document.querySelector('.search-results__label');
var inputSuggest = document.querySelector('.input-suggest');
var loadingIcon = document.querySelector('.input__ico-loading');
var searchButton = document.querySelector('.input__btn-search');
var suggestHint = document.querySelector('.suggest-hint');

var hideSuggest = () => {
  inputSuggest.innerHTML = '';
  inputSuggest.hidden = true;
  document.removeEventListener('keydown', onDocumentKeyDown);
};

var onSearchItemsLoaded = (res) => {
  loadingIcon.hidden = true;
  suggestHint.hidden = true;
  searchResults.hidden = false;

  if (!res.length) {
    searchResultsLabel.innerHTML = `Nothing found for <strong>${escapeHtml(input.value)}</strong>`;
    return;
  }

  searchResultsLabel.innerHTML = `Results for <strong>${escapeHtml(input.value)}</strong>:`;

  var searchResultsItemsHtml = res
    .map((item) => `<div class="search-item">${escapeHtml(item)}</div>`)
    .join('');

  searchResultsItems.innerHTML = searchResultsItemsHtml;
};

var loadSearchItems = (query = input.value) => {
  if (!query) {
    return;
  }

  hideSuggest();

  loadingIcon.hidden = false;

  getSearchItems(query)
    .then((searchRes) => {
      if (input.value !== query) {
        return;
      }

      onSearchItemsLoaded(searchRes);
    });
};

var onDocumentKeyDown = (event) => {
  var { keyCode } = event;
  var suggestItems = Array.from(inputSuggest.children);
  var maxIndex = suggestItems.length - 1;
  var newIndex;
  var selectedIndex = suggestItems.indexOf(inputSuggest.querySelector('.input-suggest__item--hovered'));

  switch (keyCode) {
    case KEY_ARROW_DOWN:
      event.preventDefault();
      if (selectedIndex === null) {
        newIndex = 0;
      } else {
        newIndex = selectedIndex >= maxIndex ? 0 : selectedIndex + 1;
      }
      suggestItems[newIndex].dispatchEvent(new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
      break;

    case KEY_ARROW_UP:
      event.preventDefault();
      if (selectedIndex === 0) {
        newIndex = maxIndex;
      } else {
        newIndex = selectedIndex && selectedIndex <= maxIndex ? selectedIndex - 1 : maxIndex;
      }
      suggestItems[newIndex].dispatchEvent(new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
      break;

    case KEY_ENTER:
      if (selectedIndex !== null) {
        suggestItems[selectedIndex].dispatchEvent(new MouseEvent('mousedown', {
          view: window,
          bubbles: true,
          cancelable: true
        }));
      }
      break;

    default:
      break;
  }
};

var onInputChange = () => {
  var value = input.value;

  searchResults.hidden = true;
  suggestHint.hidden = false;
  placeholder.hidden = !!value;
  loadingIcon.hidden = true;
  if (!value) {
    hideSuggest();
  }

  getSuggestItems(value)
    .then((res) => {
      var isInputFocused = document.activeElement === input;
      if (!isInputFocused || input.value !== value || !res.length) {
        return;
      }

      inputSuggest.hidden = false;

      var suggestHtml = res
        .map((item) => `<div class="input-suggest__item">${escapeHtml(item)}</div>`)
        .join('');

      inputSuggest.innerHTML = suggestHtml;

      var suggestItems = Array.from(document.querySelectorAll('.input-suggest__item'));
      suggestItems.forEach((item, index) => {
        var onSuggestItemMouseEnter = () => {
          suggestItems.forEach((_item) => {
            _item.classList.remove('input-suggest__item--hovered');
          });
          item.classList.add('input-suggest__item--hovered');
        };

        var onSuggestItemSelect = () => {
          hideSuggest();

          value = res[index];
          input.value = res[index];

          loadingIcon.hidden = false;

          getSearchItems(input.value)
            .then((searchRes) => {
              if (input.value !== value) {
                return;
              }

              onSearchItemsLoaded(searchRes);
            });
        };

        item.addEventListener('mouseenter', onSuggestItemMouseEnter);
        item.addEventListener('mousedown', onSuggestItemSelect);
      });

      document.addEventListener('keydown', onDocumentKeyDown);
    });
};

var onInputBlur = () => {
  hideSuggest();
};

var onInputKeyDown = (event) => {
  if (event.keyCode !== KEY_ENTER) {
    return;
  }

  var suggestItems = Array.from(inputSuggest.children);
  if (!suggestItems.length) {
    loadSearchItems();
  }

  var selectedIndex = suggestItems.indexOf(inputSuggest.querySelector('.input-suggest__item--hovered'));

  if (selectedIndex === -1) {
    loadSearchItems();
  }
};

searchButton.addEventListener('click', loadSearchItems);
input.addEventListener('input', onInputChange);
input.addEventListener('keydown', onInputKeyDown);
input.addEventListener('blur', onInputBlur);
