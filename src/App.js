import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Dashboard from "./containers/dashboard/Dashboard";
import Login from "./containers/Login";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Logout from "./containers/Logout";
import ProjectDetails from "./containers/ProjectDetail";
import ProjectInstallationDetails from "./containers/projectInstallationDetails/ProjectInstallationDetails";
import ProjectTeamDetails from "./containers/projectTeamDetails/ProjectTeamDetails";
import About from "./containers/About";
import NoMatch from "./containers/nomatch/NoMatch";
import ButtonAppBar from "./components/commonHeader/CommonHeader";
import AuthReset from "./containers/AuthReset";
import {CssBaseline, withStyles, MuiThemeProvider} from '@material-ui/core';
import PropTypes from 'prop-types';
import "./sass/App.scss";
import theme from './SiteTheme';
import UserProfile from "./containers/UserProfile";
import DataAnalysis from "./containers/dataAnalysis/DataAnalysis";

const styles = theme => ({

});
  class App extends React.Component {
    render() {
      const Contact = () => <h2>Contact</h2>
        return(
          <MuiThemeProvider theme={theme}>
            <Router>
              <div className="common-container">
                { !localStorage.getItem('idToken') ?
                  (<div>
                    <CssBaseline />
                    <ButtonAppBar/>
                    <Switch>
                      <Route path="/login" component={Login} />
                      <Route path="/auth-reset" component={AuthReset} />
                      <Route path="/about" component={About} />
                      <Route path="/contact" component={Contact} />
                      {/* when none of the above match, <NoMatch> will be rendered */}
                      <Route component={NoMatch} />
                    </Switch>
                    <Footer/>
                  </div>)
                  :
                  (<div className="container">
                    <CssBaseline />
                    <Header/>
                    <Menu />
                    <Switch>
                      <Route exact path="/" component={Dashboard} />
                      <Route path="/project/:pid/installations/:insid?" component={ProjectInstallationDetails} />
                      <Route path="/project/:pid/team/:insid?" component={ProjectTeamDetails} />
                      <Route path="/project/:pid?" component={ProjectDetails} />
                      <Route path="/profile/:userid?" component={UserProfile} />
                      <Route path="/data" component={DataAnalysis} />
                      <Route path="/logout" component={Logout} />
                      <Route component={NoMatch} />
                    </Switch>
                    <Footer/>
                  </div>)
                }
              </div> 
            </Router>
          </MuiThemeProvider>
        )
    }
  }
  App.propTypes = {
    classes: PropTypes.object.isRequired,
  };
 export default withStyles(styles)(App);