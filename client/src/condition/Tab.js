import React, { Component } from 'react';
import { NavItem } from 'reactstrap';

export default class Tab extends Component {
  render() {

    // this.props.id = id for the tab
    // this.props.contentId = id for the content in the tab
    // this.props.title = title for the tab
    // this.props.active = whether the tab is active, set to be default false at the bottom

    var tab;
    if(this.props.active) {
      tab = <a href={"#" + this.props.contentId} className="nav-link active" id={this.props.id} data-toggle="tab" role="tab">{this.props.title}</a>;
    } else {
      tab = <a href={"#" + this.props.contentId} className="nav-link" id={this.props.id} data-toggle="tab" role="tab">{this.props.title}</a>
    }

    return (
        <NavItem>
          {tab}
        </NavItem>   
    )
  }
}

Tab.defaultProps = {
  active: false
}
