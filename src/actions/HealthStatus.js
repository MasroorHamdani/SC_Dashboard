import { HEALTH_STATUS, HEALTH_LOCATION_STATUS,
  HEALTH_INITIALISE, HEALTH_STATUS_INITIALISE} from '../constants/ActionTypes';
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
      .catch(error => {
        dispatch(healthDataSaved(error))
      })
  }
}

export function projectLocationHealth(config) {
  return function (dispatch) {
      ApiService(config).then(data => {
          //on success we will dispatch a sync action with the data
          dispatch(healthLocationSaved(data.data))
      })
      .catch(error => {
        dispatch(healthLocationSaved(error))
      })
  }
}

export function healthLocationSaved(data) {
  return {
      type: HEALTH_LOCATION_STATUS,
      data
  }
}

export function initialiseHealthState() {
  return {
    type: HEALTH_INITIALISE,
    data: []
  }
}

export function initialiseHealthStatusState() {
  return {
    type: HEALTH_STATUS_INITIALISE,
    data: []
  }
}
