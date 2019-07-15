import React, { Component } from 'react';
import { Nav, TabContent } from 'reactstrap';
import Tab from './Tab.js';
import '../stylesheets/tabHolder.css';

export default class TabHolder extends Component {

  constructor(props) {
    super(props);

    // using the "tabs" array sent in from props, map each element to an actual Tab component and save it to this.tabs
    this.tabs = props.tabs.map((tab) =>
      <Tab key={tab.id} id={tab.id} contentId={tab.contentId} title={tab.title} active={tab.active} />
    );
  }

  render() {
    return (
      <div>
        <Nav tabs>
          {this.tabs}
        </Nav>
        <TabContent>
          {this.props.children}
        </TabContent>
      </div>
    )
  }
}
