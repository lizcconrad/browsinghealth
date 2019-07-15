import React, { Component } from 'react';
import CustomTabContent from './CustomTabContent';
import PublicationTable from './PublicationTable';


export default class PublicationDisplay extends Component {

  render() {

    return (
      // send the CustomTabContent component the "id" to go with the contentId from the array of tabs in ConditionPage.js
      <CustomTabContent id="publications-tab-content">
        <PublicationTable condition={this.props.condition} defaultPageSize={10}/>
      </CustomTabContent>
    )
  }

}
