import React, {Component} from "react";
import { connect } from "react-redux";
import { Link, NavLink} from "react-router-dom";
import { NamespacesConsumer } from 'react-i18next';
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import {ToggleClick}  from '../../actions/MenuAction';
import { mainListItems, secondaryListItems } from '../../containers/listItems';
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

  render() {
    const { classes } = this.props;
    return (

  // <NamespacesConsumer>
  //         {
  //           t => <ul>
  //           <li>
  //             <NavLink to="/" activeClassName="App-link-selected">{t('Home')}</NavLink>
  //           </li>
  //           <li>
  //             <Link to="/Login">{t('Login')}</Link>
  //           </li>
  //           <li>
  //             <Link to="/contact">{('Contact')}</Link>
  //           </li>
  //           <li>
  //             <Link to="/about">{('About')}</Link>
  //           </li>
  //         </ul>
  //         }
  //       </NamespacesConsumer>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}>
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
      state
  }
}
function mapDispatchToProps(dispatch) {
  return {
      onToolbarClick: (value) => {
          //will dispatch the async action
          dispatch(ToggleClick(value))
      }
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Menu));