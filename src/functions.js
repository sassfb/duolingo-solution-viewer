import { fromPairs, get, noop, trim } from 'lodash';
import moize from 'moize';
import { it } from 'param.macro';
import Cookies from 'js-cookie';
import TextDiff from 'diff';

import {
  ACTION_RESULT_SUCCESS,
  MESSAGE_TYPE_ACTION_REQUEST,
  MESSAGE_TYPE_ACTION_RESULT,
  DEFAULT_LOCALE,
  EXTENSION_CODE,
  IMAGE_CDN_DEFAULT_BASE_URL,
  MENU_ICON_SELECTOR,
  SENTENCE_ICON_CLASS_NAMES,
  SOLUTION_ICON_URL_META_NAME,
} from './constants';

/**
 * The counter underlying the generation of unique element IDs.
 *
 * @type {number}
 */
let uniqueIdCounter = 1;

/**
 * @param {string} prefix The prefix to prepend to the generated ID.
 * @returns {string} A unique/unused element ID.
 */
export function getUniqueElementId(prefix) {
  let elementId;

  do {
    elementId = prefix + uniqueIdCounter++;
  } while (document.getElementById(elementId));

  return elementId;
}

/**
 * @param {Element} element The element to toggle.
 */
export function toggleElement(element) {
  if (element instanceof Element) {
    if (element.style.display === 'none') {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  }
}

/**
 * @param {Event} event The UI event to completely discard.
 */
export function discardEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * @returns {boolean} Whether the currently focused element is an input.
 */
export function isInputFocused() {
  return !document.activeElement
    ? false
    : ([ 'input', 'select', 'textarea' ].indexOf(document.activeElement.tagName.toLowerCase()) >= 0);
}

/**
 * @param {Promise} promise A promise to run solely for its effects, ignoring its result.
 */
export function runPromiseForEffects(promise) {
  promise.then(noop).catch(noop);
}

/**
 * Sends an action request to the content script.
 *
 * @param {string} action The action key.
 * @param {*} value The action payload.
 * @returns {Promise} A promise for the result of the action.
 */
export async function sendActionRequestToContentScript(action, value) {
  return new Promise((resolve, reject) => {
    const resultListener = event => {
      if (
        (event.source === window)
        && event.data
        && (MESSAGE_TYPE_ACTION_RESULT === event.data.type)
        && (action === event.data.action)
      ) {
        if (event.data.result === ACTION_RESULT_SUCCESS) {
          resolve(event.data.value || null);
        } else {
          reject();
        }

        event.stopPropagation();
        window.removeEventListener('message', resultListener);
      }
    };

    window.addEventListener('message', resultListener);

    window.postMessage({
      type: MESSAGE_TYPE_ACTION_REQUEST,
      action,
      value,
    }, '*');
  });
}

/**
 * @function
 * @param {string[]} classNames A set of class names.
 * @param {string[]} styleNames The names of the styles whose values should be returned.
 * @returns {object} A subset of the computed style values applied by the given set of class names.
 */
export const getStylesByClassNames = moize(
  (classNames, styleNames) => {
    const element = document.createElement('div');

    element.style.display = 'none';
    classNames.forEach(className => element.classList.add(className));
    document.body.appendChild(element);

    const computedStyle = getComputedStyle(element);
    const styles = fromPairs(styleNames.map(name => [ name, computedStyle.getPropertyValue(name) || '' ]));

    element.remove();

    return styles;
  }
);

/**
 * @function
 * @returns {string} The base URL of the image CDN.
 */
export const getImageCdnBaseUrl = moize(
  () => {
    const menuIcon = document.querySelector(MENU_ICON_SELECTOR);
    return `${new URL(menuIcon && menuIcon.src || IMAGE_CDN_DEFAULT_BASE_URL).origin}/`;
  }
);

/**
 * @function
 * @returns {string|null} The CSS URL of the solution icon, if it can be determined.
 */
export const getSolutionIconCssUrl = moize(
  () => {
    const solutionIconMeta = document.querySelector(`meta[name="${SOLUTION_ICON_URL_META_NAME}"]`);
    const solutionIconUrl = (solutionIconMeta && solutionIconMeta.getAttribute('content') || '').trim();

    return (solutionIconUrl && `url(${solutionIconUrl})`)
      || getStylesByClassNames(SENTENCE_ICON_CLASS_NAMES, [ 'background-image' ])['background-image']
      || null;
  }
);

/**
 * @returns {string} The tag of the current language used for the UI.
 */
export function getUiLocale() {
  return String(get(window || {}, [ 'duo', 'uiLanguage' ]) || '').trim()
    || String(Cookies.get('ui_language') || '').trim()
    || DEFAULT_LOCALE;
}

/**
 * The iframe element used to access working logging functions.
 *
 * @type {HTMLIFrameElement|null}
 */
let loggingIframe = null;

/**
 * @param {*} error The extension-related error to log to the console.
 * @param {?string} prefix A prefix to prepend to the error.
 */
export function logError(error, prefix) {
  if (process.env.NODE_ENV === 'development') {
    if (!loggingIframe || !loggingIframe.isConnected) {
      loggingIframe = document.createElement('iframe');
      loggingIframe.style.display = 'none';
      document.body.appendChild(loggingIframe);
    }

    loggingIframe.contentWindow.console.error(`[${EXTENSION_CODE}] ${prefix || ''}`, error);
  }
}

/**
 * @param {Function} compare A comparison function.
 * @returns {Function} The inverse of the given comparison function.
 */
export function invertComparison(compare) {
  return (x, y) => {
    const result = compare(x, y);
    return (result < 0) ? 1 : ((result > 0) ? -1 : 0);
  };
}

/**
 * @typedef {object} DiffToken
 * @property {string} value The value of the token.
 * @property {number} count The length of the token.
 * @property {boolean} added Whether the token was added in the right string.
 * @property {boolean} removed Whether the token was removed in the right string.
 */

/**
 * @param {string} x A string.
 * @param {string} y Another string.
 * @returns {DiffToken[]|null}
 * A list of tokens representing the similarities and differences between the two given strings (ignoring insignificant
 * punctuation and spaces), or null if they are equivalent.
 */
export function diffStrings(x, y) {
  const INSIGNIFICANT_CHARS = '.,;:?¿!¡()" \t\n\r\xA0';

  const diffTokens = TextDiff.diffChars(
    // diffChars is right-biased in that it will rather keep characters from the second string.
    // We want to keep characters from the base string instead.
    trim(y.normalize(), INSIGNIFICANT_CHARS),
    trim(x.normalize(), INSIGNIFICANT_CHARS),
    {
      comparator: (left, right) =>
        left.toLowerCase() === right.toLowerCase()
        || INSIGNIFICANT_CHARS.includes(left) && INSIGNIFICANT_CHARS.includes(right)
    }
  );

  if (!diffTokens.some(!!it.added || !!it.removed)) {
    return null;
  }

  return diffTokens.map(token => ({
    ...token,
    added: !!token.removed,
    removed: !!token.added,
  }));
}
