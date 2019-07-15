import React, { Component } from 'react';

export default class CustomTabContent extends Component {
  render() {
    return (
      <div id={this.props.id} className={"tab-pane fade show " + this.props.active} role="tabpanel">
        { this.props.children }
      </div>
    )
  }
}
