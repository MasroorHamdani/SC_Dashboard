import React from "react";
import { Link, NavLink} from "react-router-dom";

const Menu = () => (
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

export default Menu;