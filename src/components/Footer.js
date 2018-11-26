import React, { Component } from 'react';
import { NamespacesConsumer } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import '../sass/Footer.css';

class Footer extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <NamespacesConsumer>
          {
           t=> <footer className="app-footer">
              <span>
                {t('footer-note')}
              </span>
          </footer>
          }
        </NamespacesConsumer>
        

      );
    }
  }
  
  
  export default Footer;