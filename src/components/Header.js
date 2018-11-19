import React, { Component } from 'react';
import "./../sass/Header.css";

class Header extends Component {
    render() {
        const user = "Masroor";
        const headerContent = <div className="Header">
            <h2>Welcome {user}</h2>
          </div>;
      return (
        <div className="Header">
          {headerContent}
        </div>
      );
    }
  }
  
  export default Header;