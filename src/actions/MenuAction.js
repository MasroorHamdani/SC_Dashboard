import { TOOGLE_MENU } from '../constants/ActionTypes';

function toolbarClicked(data) {
  return {
      type: TOOGLE_MENU,
      data
  }
}

export function ToggleClick(value) {
  return function (dispatch) {
          dispatch(toolbarClicked({
            open: !value,
          }))
  }
}