import React, { Component } from 'react';
import CustomTabContent from './CustomTabContent';
import TypeChart from './TypeChart';

export default class DistributionDisplay extends Component {

  render() {
    return (
      <CustomTabContent id="distribution-tab-content">
        <TypeChart condition={this.props.condition} />
      </CustomTabContent>
    )
  }
  
}