import React, {Component} from "react";
import { connect } from "react-redux";
import {isEqual} from "lodash";
import {Drawer, List, Divider, IconButton, withStyles, Typography} from '@material-ui/core';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {toolbarClicked}  from '../../actions/MenuAction';
import {secondaryListItems } from '../../containers/ListItems';
import styles from "./MenuStyle";
import ListItems from "./ListItems";
import {menuList, mainMenuList} from "./MenuList";
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    }
  }

  handleDrawerClose = () => {
    this.props.onToolbarClick(this.state.open)
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.props.menuToggleData &&
      !isEqual(this.props.menuToggleData, prevProps.menuToggleData)) {
        this.setState({open:this.props.menuToggleData.open})
    }
    if(this.props.projectSelected &&
      !isEqual(this.props.projectSelected, prevProps.projectSelected)) {
        this.setState({pid: this.props.projectSelected.pid});
    }
  }

  render() {
    const { classes } = this.props;
    return (
        <Drawer
          variant="permanent"
          // color="default"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={!this.state.open}>
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItems menuList={mainMenuList(this.state.pid)} /></List>
          <Divider />
          {/* <List>{secondaryListItems}</List> */}
          <Typography className={classes.version}>Version 0.01</Typography>
        </Drawer>
    );
  }
};
function mapStateToProps(state) {
  return {
    menuToggleData: state.MenuActionReducer.data,
    projectSelected : state.projectSelectReducer.data
  }
}
function mapDispatchToProps(dispatch) {
  return {
      onToolbarClick: (value) => {
          //will dispatch the async action
          dispatch(toolbarClicked(value))
      }
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Menu));