import React from "react";
import { Link, NavLink} from "react-router-dom";
import { NamespacesConsumer } from 'react-i18next';

const Menu = () => (
  <NamespacesConsumer>
          {
            // t => <h1>{t('Welcome to React')}</h1>
            t => <ul>
            <li>
              <NavLink to="/" activeClassName="App-link-selected">{t('Home')}</NavLink>
            </li>
            <li>
              <Link to="/Login">{t('Login')}</Link>
            </li>
            <li>
              <Link to="/contact">{('Contact')}</Link>
            </li>
            <li>
              <Link to="/about">{('About')}</Link>
            </li>
          </ul>
          }
        </NamespacesConsumer>
);

export default Menu;