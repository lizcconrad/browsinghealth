import React, { Component } from 'react';
import CustomTabContent from './CustomTabContent';
import OutcomeTable from './OutcomeTable';

export default class OutcomeDisplay extends Component {

  render() {

    let table = <OutcomeTable condition={this.props.condition} sctid={this.props.sctid} defaultPageSize={10}/>

    return (
      // send the CustomTabContent component the "id" to go with the contentId from the array of tabs in ConditionPage.js
      <CustomTabContent id="outcomes-tab-content">
        {table}
      </CustomTabContent>
    )
  }


}
