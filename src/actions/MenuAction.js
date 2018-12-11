import { TOOGLE_MENU } from '../constants/ActionTypes';

/**
 * Dispatched function to keep the track of toolbar status,
 * through out the website
 * which is mostly being used between header and main menu
 * @param {*} value 
 */
export function toolbarClicked(value) {
  return {
      type: TOOGLE_MENU,
      data : {open: !value}
  }
}