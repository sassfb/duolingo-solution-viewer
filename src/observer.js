import { sendEventNotificationToContentScript } from './ipc';
import { isObject, logError } from './functions';
import { EVENT_TYPE_SESSION_LOADED, EVENT_TYPE_SOUND_PLAYED } from './constants';

// This module must be kept as short as possible, we need it to be evaluated as soon as possible.

/**
 * A RegExp for the URL that is used by Duolingo to start a new practice session.
 *
 * @type {RegExp}
 */
const NEW_SESSION_URL_REGEXP = /\/[\d]{4}-[\d]{2}-[\d]{2}\/sessions/g;


/**
 * @type {Function}
 */
const originalXhrOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
  if (url.match(NEW_SESSION_URL_REGEXP)) {
    this.addEventListener('load', () => {
      try {
        const data = isObject(this.response)
          ? this.response
          : JSON.parse(this.responseText);

        if (isObject(data)) {
          sendEventNotificationToContentScript(EVENT_TYPE_SESSION_LOADED, data);
        }
      } catch (error) {
        logError(error, 'Could not handle the new session data: ');
      }
    });
  }

  return originalXhrOpen.call(this, method, url, async, user, password);
};


/**
 * @type {Function}
 */
let lastHowlPrototype = null;

setInterval(() => {
  if (window.Howl && (lastHowlPrototype !== window.Howl.prototype)) {
    lastHowlPrototype = window.Howl.prototype;
    const originalHowlPlay = window.Howl.prototype.play;

    window.Howl.prototype.play = function (id) {
      try {
        if (!id) {
          const soundSrc = String(this._src || this._parent && this._parent._src || '').trim();

          if ('' !== soundSrc) {
            sendEventNotificationToContentScript(EVENT_TYPE_SOUND_PLAYED, soundSrc);
          }
        }
      } catch (error) {
        logError(error, 'Could not handle the played sound: ');
      }

      return originalHowlPlay.call(this, id);
    };
  }
}, 50);
