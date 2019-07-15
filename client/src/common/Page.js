import React, { Component } from 'react';
import '../stylesheets/page.css'
import CustomNavbar from './CustomNavbar.js';

export default class Page extends Component {
  render() {
    return (
      <div>
        <header>
          <CustomNavbar />
        </header>

        <main role="main">
          <div className="page-container">
            {this.props.children}
          </div>
        </main>
      </div>

    )
  }
}
