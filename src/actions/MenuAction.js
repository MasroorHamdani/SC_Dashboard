import { TOOGLE_MENU, PROJECT_SELECTED} from '../constants/ActionTypes';

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

export function projectSelect(value) {
  return {
    type: PROJECT_SELECTED,
    data : {pid: value}
  }
}