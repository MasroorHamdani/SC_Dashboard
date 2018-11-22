import React, { Component } from 'react';
import "./../sass/Header.css";
import { NamespacesConsumer } from 'react-i18next';

class Header extends Component {
    render() {
      const user = "Masroor";
      return (
        <div className="Header">
          <NamespacesConsumer>
          {
            t => <h1>{t('Welcome-Header')} {user}</h1>
          }
          </NamespacesConsumer>
        </div>
      );
    }
  }
  export default Header;