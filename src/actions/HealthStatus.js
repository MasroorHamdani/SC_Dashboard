import { HEALTH_STATUS, HEALTH_LOCATION_STATUS} from '../constants/ActionTypes';
import ApiService from '../services/ApiService';

/**
 * Dispatched function to keep the track of Health status data,
 * @param {*} data 
 */
export function healthDataSaved(data) {
  return {
      type: HEALTH_STATUS,
      data
  }
}

export function projectHealth(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(healthDataSaved(data.data))
      })
  }
}

export function projectLocationHealth(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(healthLocationSaved(data.data))
      })
  }
}

export function healthLocationSaved(data) {
  return {
      type: HEALTH_LOCATION_STATUS,
      data
  }
}