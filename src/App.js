import React from "react";
import { Route, Switch, Redirect, withRouter} from "react-router-dom";
import Dashboard from "./containers/dashboard/Dashboard";
import Login from "./containers/Login";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Logout from "./containers/Logout";
import ProjectDetails from "./containers/projectDetails/ProjectDetail";
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
import Report from "./containers/Report";
import AlertDetails from "./containers/AlertDetails";
import DispenserDetails from "./containers/DispenserDetails";
import ReportView from "./containers/ReportView";
import Health from "./containers/Health";
import HealthStatus from "./containers/HealthStatus";

const styles = theme => ({

});
  class App extends React.Component {
    componentWillMount() {
      localStorage.setItem('previousPath', window.location.pathname)
    }
    render() {
      const Contact = () => <h2>Contact</h2>
        return(
          <MuiThemeProvider theme={theme}>
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
                    <Header {...this.props}  params={this.props.match.params}/>
                    <Menu/>
                    <Switch>
                      <Route exact path="/" component={Dashboard} />
                      <Route path="/project/:pid/installations/:insid?" component={ProjectInstallationDetails} />
                      <Route path="/project/:pid/team/:uid?" component={ProjectTeamDetails} />
                      <Route path="/project/:pid?" component={ProjectDetails} />
                      <Route path="/profile/:userid?" component={UserProfile} />
                      <Route path="/alert/project/:pid?" component={AlertDetails} />
                      <Route path="/dispenser/project/:pid?" component={DispenserDetails} />
                      <Route path="/data/project/:pid" component={DataAnalysis} />
                      <Route exact path="/report" component={Report} />
                      <Route path="/report/project/:pid?" component={ReportView} />
                      <Route path="/health/project/:pid/:insid" component={HealthStatus}/>
                      <Route exact path="/health/project/:pid" component={Health}/>
                      <Route path="/logout" component={Logout} />
                      <Redirect from="/login" to="/"/>
                      <Route component={NoMatch} />
                    </Switch>
                    <Footer/>
                  </div>)
                }
              </div> 
          </MuiThemeProvider>
        )
    }
  }
  App.propTypes = {
    classes: PropTypes.object.isRequired,
  };
// export default withStyles(styles)(App);
const AppComponent = withStyles(styles)(App);
export default withRouter(AppComponent)