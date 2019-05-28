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
// import About from "./containers/About";
import NoMatch from "./containers/nomatch/NoMatch";
import ButtonAppBar from "./components/commonHeader/CommonHeader";
import AuthReset from "./containers/AuthReset";
import {CssBaseline, MuiThemeProvider} from '@material-ui/core';
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
import PageLoader from "./components/pageLoader/PageLoader";

import axios from 'axios';
import {API_END_POINT, API_URLS, THEME} from "./constants/Constant";

class App extends React.Component {
    constructor(props) {

      super(props);
      this.state = {
        holdComponents: true
      }
    }
    componentWillMount() {
      localStorage.setItem('previousPath', window.location.pathname);
      const self = this;
      let addressArray = window.location.pathname.split('/'),
        mainIndex = addressArray.indexOf('optimus'),
        partnerid = (addressArray[mainIndex + 1] !== 'profile' &&
        addressArray[mainIndex + 1] !== 'project' &&
        addressArray[mainIndex + 1] !== 'alert' &&
        addressArray[mainIndex + 1] !== 'dispenser' &&
        addressArray[mainIndex + 1] !== 'data' &&
        addressArray[mainIndex + 1] !== 'report' &&
        addressArray[mainIndex + 1] !== 'health' &&
        addressArray[mainIndex + 1] !== 'login' &&
        addressArray[mainIndex + 1] !== 'logout') ? addressArray[mainIndex + 1] : '';
        
        const urlEndPoint = `${API_END_POINT}${API_URLS['PARTNER']}${partnerid ? partnerid.toUpperCase() : 'default'}${API_URLS['THEME']}`;
        axios({
            method:'GET',
            url: urlEndPoint,
            headers: {'Content-Type':'application/json'}
        })
        .then(function(data) {
            if(data && data.data) {
                localStorage.setItem('main', data.data[0].Details.main);
                localStorage.setItem('footer', data.data[0].Details.footerText);
                localStorage.setItem('highlighter', data.data[0].Details.highlighter);
                localStorage.setItem('light', data.data[0].Details.light);
                localStorage.setItem('lighter', data.data[0].Details.lighter);
                localStorage.setItem('logo', data.data[0].Details.logo);
                localStorage.setItem('partnerid', partnerid);
                theme.palette.primary={
                  highlighter: localStorage.getItem('highlighter') ? localStorage.getItem('highlighter') : theme.palette.primary.highlighter,
                  lighter: localStorage.getItem('lighter') ? localStorage.getItem('lighter') : theme.palette.primary.lighter,
                  light: localStorage.getItem('light') ? localStorage.getItem('light') : theme.palette.primary.light,
                  main: localStorage.getItem('main') ? localStorage.getItem('main') : theme.palette.primary.main
                }
                self.setState({holdComponents: false});
            } else if (data && data.data === null) {
                localStorage.setItem('main', THEME.main);
                localStorage.setItem('highlighter', THEME.highlighter);
                localStorage.setItem('light', THEME.light);
                localStorage.setItem('lighter', THEME.lighter);
                localStorage.setItem('partnerid', partnerid);
                theme.palette.primary={
                  highlighter: THEME.highlighter,
                  lighter: THEME.lighter,
                  light: THEME.light,
                  main: THEME.main
                }
                self.setState({holdComponents: false});
            }
        })
        .catch((err) => {
            console.log(`Error Captured: ${err}`);
            self.setState({holdComponents: false})
        });
    }
    render() {
      // const Contact = () => <h2>Contact</h2>
        return(
          <MuiThemeProvider theme={theme}>
              <div className="common-container">
                {this.state.holdComponents ?
                  <PageLoader/>
                : !localStorage.getItem('idToken') ?
                  (<div>
                    <CssBaseline />
                    <ButtonAppBar/>
                    <Switch>
                      <Route path="/:partnerid?/login" component={Login} />
                      <Route path="/:partnerid?/auth-reset" component={AuthReset} />
                      {/* <Route path="/about" component={About} />
                      <Route path="/contact" component={Contact} /> */}
                      {/* when none of the above match, <NoMatch> will be rendered */}
                      <Route path="/:partnerid?/*" component={NoMatch} />
                    </Switch>
                    <Footer/>
                  </div>)
                  :
                  (<div className="container">
                    <CssBaseline />
                    <Header {...this.props}  params={this.props.match.params}/>
                    <Menu {...this.props}/>
                    <Switch>
                      <Route path="/:partnerid?/profile/:userid?" component={UserProfile} />
                      <Route path="/:partnerid?/alert/project/:pid?" component={AlertDetails} />
                      <Route path="/:partnerid?/dispenser/project/:pid?" component={DispenserDetails} />
                      <Route path="/:partnerid?/data/project/:pid" component={DataAnalysis} />
                      <Route exact path="/:partnerid?/report/configure/project/:pid?" component={Report} />
                      <Route path="/:partnerid?/report/project/:pid?" component={ReportView} />
                      <Route path="/:partnerid?/health/project/:pid/:insid" component={HealthStatus}/>
                      <Route exact path="/:partnerid?/health/project/:pid" component={Health}/>
                      <Route path="/:partnerid?/project/:pid/installations/:insid?" component={ProjectInstallationDetails} />
                      <Route path="/:partnerid?/project/:pid/team/:uid?" component={ProjectTeamDetails} />
                      <Route path="/:partnerid?/project/:pid?" component={ProjectDetails} />
                      <Route path="/:partnerid?/logout" component={Logout} />
                      <Route exact path="/:partnerid?/" component={Dashboard} />
                      <Redirect from="/:partnerid?/login" to="/:partnerid?/"/>
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
export default withRouter(App)