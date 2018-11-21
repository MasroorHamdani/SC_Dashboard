import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Header from "./components/Header";
import Menu from "./components/menu";
import ProjectDetails from "./containers/projectDetails";
import About from "./containers/about";
import "./sass/App.css";

  class App extends React.Component {
    render() {
      const Contact = () => <h2>Contact</h2>

      function NoMatch({ location }) {
        return (
          <div>
            <h3>
              No match for <code>{location.pathname}</code>
            </h3>
          </div>
        );
      }
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
                  <Route exact path="/" component={Home} />
                  
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