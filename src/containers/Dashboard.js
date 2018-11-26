import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import "../sass/App.css";
import ProjectDataComponent from "../components/ProjectData";
import { API_URLS, X_API_KEY, REACT_URLS } from "../constants/Constant";
import { getApiConfig } from '../services/ApiCofig';
import {dashboardData} from '../actions/DashboardAction';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {},
      open: true,
    }
  }
  
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClick() {
    this.props.history.push(REACT_URLS['PROJECT_DETAILS'])
  }

  componentDidMount(){
    const endPoint = API_URLS['DASHBOARD'],
          config = getApiConfig(endPoint, X_API_KEY, 'GET');
    this.props.onDashbaord(config);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.state);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography variant="h4" gutterBottom component="h2">
            Projects
          </Typography>
          <Typography component="div" className={classes.chartContainer}>
          <ProjectDataComponent data={this.props.state} onClick={this.handleClick.bind(this)}/>
          </Typography>
        </main>
      </div>
    );
  }
}
function getMappedData (state) {
  if (state.DashboardReducer.data) {
    const mapped_data = [],
          response_data = state.DashboardReducer.data;
    if(response_data["Item"]) {
      const projects = response_data["Item"]["Projects"]
      for (var key in projects) {
        projects[key]['key']=key;
        mapped_data.push(projects[key])
      }
    }
    return mapped_data;
  }
}

function mapStateToProps(state) {
  return {
      state : getMappedData(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onDashbaord: (config) => {
          //will dispatch the async action
          dispatch(dashboardData(config))
      }
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));