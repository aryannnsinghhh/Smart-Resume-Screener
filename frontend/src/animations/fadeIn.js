/**
 * fadeIn.js
 * Reusable fade-in animation using Anime.js
 * 
 * Note: Anime.js v4 uses a different module structure.
 * We import the entire module and use it directly.
 */
import * as animeModule from "animejs";

// Extract the anime function from the module
const anime = animeModule.default || animeModule;

/**
 * Fade in animation with slide up effect
 * @param {string|HTMLElement} target - CSS selector or DOM element
 * @param {number} delay - Animation delay in milliseconds
 */
export const fadeIn = (target, delay = 0) => {
  // Guard clause: Return early if target is invalid
  if (!target) {
    console.warn('fadeIn: No target provided');
    return;
  }
  
  // Fallback: Make element visible immediately if anime fails
  try {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
      element.style.opacity = '1';
    }
  } catch (e) {
    console.warn('fadeIn: Fallback visibility failed', e);
  }
  
  // Guard clause: Check if anime is available
  if (typeof anime !== 'function') {
    console.error('fadeIn: Anime.js is not properly loaded');
    return;
  }
  
  try {
    anime({
      targets: target,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay,
      easing: "easeOutQuad",
    });
  } catch (error) {
    console.error('fadeIn animation error:', error);
  }
};

/**
 * Stagger fade in for multiple elements
 * @param {string} selector - CSS selector for multiple elements
 * @param {number} staggerDelay - Delay between each element
 */
export const staggerFadeIn = (selector, staggerDelay = 100) => {
  // Guard clause: Return early if selector is invalid
  if (!selector) {
    console.warn('staggerFadeIn: No selector provided');
    return;
  }
  
  // Fallback: Make elements visible immediately if anime fails
  try {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.opacity = '1';
    });
  } catch (e) {
    console.warn('staggerFadeIn: Fallback visibility failed', e);
  }
  
  // Guard clause: Check if anime is available
  if (typeof anime !== 'function') {
    console.error('staggerFadeIn: Anime.js is not properly loaded');
    return;
  }
  
  try {
    anime({
      targets: selector,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: anime.stagger ? anime.stagger(staggerDelay) : staggerDelay,
      easing: "easeOutExpo",
    });
  } catch (error) {
    console.error('staggerFadeIn animation error:', error);
  }
};

/**
 * Scale and fade in animation
 * @param {string|HTMLElement} target - CSS selector or DOM element
 * @param {number} delay - Animation delay in milliseconds
 */
export const scaleIn = (target, delay = 0) => {
  // Guard clause: Return early if target is invalid
  if (!target) {
    console.warn('scaleIn: No target provided');
    return;
  }
  
  // Fallback: Make element visible immediately if anime fails
  try {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
      element.style.opacity = '1';
    }
  } catch (e) {
    console.warn('scaleIn: Fallback visibility failed', e);
  }
  
  // Guard clause: Check if anime is available
  if (typeof anime !== 'function') {
    console.error('scaleIn: Anime.js is not properly loaded');
    return;
  }
  
  try {
    anime({
      targets: target,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 600,
      delay,
      easing: "easeOutBack",
    });
  } catch (error) {
    console.error('scaleIn animation error:', error);
  }
};

/**
 * Helper function to safely access nested properties
 * Prevents "Cannot read properties of undefined" errors
 * 
 * @param {Object} obj - The object to access
 * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} The value at the path or defaultValue
 * 
 * @example
 * const name = safeGet(user, 'profile.name', 'Anonymous');
 */
export const safeGet = (obj, path, defaultValue = undefined) => {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result == null) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.warn(`safeGet: Error accessing path "${path}"`, error);
    return defaultValue;
  }
};
