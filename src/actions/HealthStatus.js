import { HEALTH_STATUS} from '../constants/ActionTypes';

/**
 * Dispatched function to keep the track of toolbar status,
 * through out the website
 * which is mostly being used between header and main menu
 * @param {*} value 
 */
export function healthDataSaved(value) {
  return {
      type: HEALTH_STATUS,
      data : value
  }
}