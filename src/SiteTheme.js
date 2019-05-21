import { createMuiTheme } from '@material-ui/core/styles';
import {pink, red} from '@material-ui/core/colors';

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createMuiTheme({
  palette: {
    primary: {
      highlighter: localStorage.getItem('highlighter') ? localStorage.getItem('highlighter') : '#b7d1b4', //'#fbdfb7', //
      lighter: localStorage.getItem('lighter') ? localStorage.getItem('lighter') : '#a9c8a4', //'#f3ce97',// 
      light: localStorage.getItem('light') ? localStorage.getItem('light') : '#8db788', //'#f9ad3c'
      main: localStorage.getItem('main') ? localStorage.getItem('main') : '#68a554' //indigo, '#f75010'
    },
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    useNextVariants: true,
  },
});

export default theme;
