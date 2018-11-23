import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Dashboard from "./containers/Dashboard";
import Login from "./containers/Login";
import Header from "./components/Header";
import Menu from "./components/Menu";
import ProjectDetails from "./containers/ProjectDetails";
import About from "./containers/about";
import NoMatch from "./containers/noMatch";
import "./sass/App.css";

  class App extends React.Component {
    render() {
      const Contact = () => <h2>Contact</h2>

      return(
        <Router>
            <div>
              <Header/>
              <Menu />
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                { sessionStorage.getItem('IdToken') &&
                <Route>
                  <Route exact path="/" component={Dashboard} />
                </Route>
                }
                <Route path="/project" component={ProjectDetails} />
                {/* when none of the above match, <NoMatch> will be rendered */}
                <Route component={NoMatch} />
              </Switch>
            </div>
          </Router>
      );
    }
  }
 export default App;