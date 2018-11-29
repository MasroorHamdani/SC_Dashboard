import React, { Component } from 'react';
import { NamespacesConsumer } from 'react-i18next';
import '../sass/Footer.scss';

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