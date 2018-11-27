import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Dashboard from "./containers/dashboard/Dashboard";
import Login from "./containers/Login";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import Menu from "./components/menu/Menu";
import ProjectDetails from "./containers/ProjectDetail";
import About from "./containers/about";
import NoMatch from "./containers/noMatch";
import "./sass/App.css";

  class App extends React.Component {
    render() {
      const Contact = () => <h2>Contact</h2>

      return(
        <Router>
            <div className="container">
              <Header/>
              <Menu />
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                {/* { sessionStorage.getItem('IdToken') &&
                <Route> */}
                  <Route exact path="/" component={Dashboard} />
                {/* </Route>
                } */}
                <Route path="/project" component={ProjectDetails} />
                {/* when none of the above match, <NoMatch> will be rendered */}
                <Route component={NoMatch} />
              </Switch>
              <Footer/>
            </div>
          </Router>
      );
    }
  }
 export default App;