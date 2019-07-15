import React, { Component } from 'react';
import CustomTabContent from './CustomTabContent';
import MatchingTable from './MatchingTable';


export default class MatchingDisplay extends Component {

  render() {

    let table;
    if(this.props.sctid == null) {
      table = <p>No matching conditions</p>
    } else {
      table = <MatchingTable sctid={this.props.sctid} defaultPageSize={10} />
    }

    return (
      <CustomTabContent id="matching-tab-content">
        {table}
      </CustomTabContent>
    )
  }

}
