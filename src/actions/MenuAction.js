import { TOOGLE_MENU, PROJECT_SELECTED, PROJECT_LIST} from '../constants/ActionTypes';

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
    data : value//{pid: value}
  }
}

export function projectList(value) {
  return {
    type: PROJECT_LIST,
    data: value
  }
}