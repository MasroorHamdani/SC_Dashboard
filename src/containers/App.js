import React from "react";
import { BrowserRouter as Router, Route, Switch, Link,
  NavLink, Redirect,
  withRouter } from "react-router-dom";
import Home from "./Home";
import Login from "./../components/Login";
import Header from "./../components/Header";
import "./../sass/App.css";

const App = () => (
  <Router>
    <div>
      <Header/>
      <Header_Section />
      <Switch>
        {/* <PrivateRoute exact path="/" component={Home} /> */}
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        {/* when none of the above match, <NoMatch> will be rendered */}
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

function NoMatch({ location }) {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
const Contact = () => <h2>Contact</h2>
const About = () => <h2>About</h2>

const Header_Section = () => (
  <ul>
    <li>
      <NavLink to="/" activeClassName="App-link-selected">Home</NavLink>
    </li>
    <li>
      <Link to="/Login">Login</Link>
    </li>
    <li>
      <Link to="/contact">contact</Link>
    </li>
    <li>
      <Link to="/about">About</Link>
    </li>
  </ul>
);

export default App;