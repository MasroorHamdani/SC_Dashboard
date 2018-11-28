import { TOOGLE_MENU } from '../constants/ActionTypes';

export function toolbarClicked(value) {
  return {
      type: TOOGLE_MENU,
      data : {open: !value}
  }
}