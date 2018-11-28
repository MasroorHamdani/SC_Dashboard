import React, {Component} from "react";
import { connect } from "react-redux";
import {Drawer, List, Divider, IconButton, withStyles} from '@material-ui/core';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {toolbarClicked}  from '../../actions/MenuAction';
import { mainListItems, secondaryListItems } from '../../containers/ListItems';
import styles from "./MenuStyle";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    }
  }

  handleDrawerClose = () => {
    // this.setState({ open: true });
    this.props.onToolbarClick(this.state.open)
  };
  componentDidUpdate(prevProps, prevState) {
    if(this.props.menuToggleData.MenuActionReducer &&
      this.props.menuToggleData.MenuActionReducer !== prevProps. menuToggleData.MenuActionReducer) {
        this.setState({open:this.props.menuToggleData.MenuActionReducer.data.open})
      }
  }

  render() {
    const { classes } = this.props;
    return (
        <Drawer
          variant="permanent"
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
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
    );
  }
};
function mapStateToProps(state) {
  return {
    menuToggleData: state
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