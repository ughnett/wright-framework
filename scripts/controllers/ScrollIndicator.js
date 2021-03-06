import jump from 'jump.js';
import { Tweak } from '@squarespace/core';

const tweaks = [
  'indicator',
  'indicator-icon',
  'indicator-font',
  'indicator-color'
].map((tweak) => 'tweak-index-page-scroll-' + tweak);

/**
 * Handles clicking on the "scroll indicator" - the arrow or line for the first
 * page of the index that tells the user to scroll.
 */
function ScrollIndicator(element) {
  let showTimeout;
  let hideTimeout;
  let bottomEdge = element.getBoundingClientRect().bottom;

  /**
   * Scroll handler. Cutoff is either the bottom edge of the element or the
   * viewport height, whichever is greater. If cutoff is bottom edge, we set a
   * timeout to hide the element so the user can see it for a little bit before
   * scrolling past it.
   */
  const handleScroll = () => {
    if (bottomEdge > window.innerHeight) {
      if (window.pageYOffset + window.innerHeight < bottomEdge) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
        element.classList.remove('hidden');
      } else if (!hideTimeout) {
        hideTimeout = setTimeout(() => {
          element.classList.add('hidden');
        }, 500);
      }
      return;
    }

    clearTimeout(hideTimeout);
    hideTimeout = null;
    element.classList.toggle('hidden', window.pageYOffset > 0);
  };

  const handleClick = () => {
    jump(element.getBoundingClientRect().bottom, {
      duration: 500
    });
  };

  const handleResize = () => {
    bottomEdge = window.pageYOffset + element.getBoundingClientRect().bottom;
  };

  const bindListeners = () => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    element.addEventListener('click', handleClick);

    Tweak.watch((tweak) => {
      if (tweaks.indexOf(tweak.name) >= 0) {
        element.classList.remove('hidden');
      }
    });
  };

  const destroy = () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    element.removeEventListener('click', handleClick);
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    showTimeout = null;
    hideTimeout = null;
  };

  bindListeners();

  showTimeout = setTimeout(() => {
    element.classList.remove('hidden');
  }, 1000);

  return {
    destroy
  };
}


export default ScrollIndicator;