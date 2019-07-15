import React, { Component } from 'react';
import { Col } from 'reactstrap';
import CustomTabContent from './CustomTabContent';
import SelectForm from './SelectForm';
import InterventionTable from './InterventionTable';

// an array of the different types of interventions based on ClinicalTrials data
const options = ["Overall", "Behavioral", "Biological", "Combination Product", "Device", "Diagnostic Test",
"Dietary Supplement", "Drug", "Genetic", "Other", "Procedure", "Radiation"];

export default class InterventionDisplay extends Component {

  constructor(props) {
    super(props);

    // set the initial displayed type to "overall"
    this.state = {
      type: "overall"
    };
  }

  // set the state to the new selected type with the dropdown menu is changed
  handleChange = (event) => {
    this.setState({type: event.target.value.toLowerCase()});
  }


  render() {
    return (
      // send the CustomTabContent component the "id" to go with the contentId from the array of tabs in ConditionPage.js
      <CustomTabContent id="interventions-tab-content" active="active">
        <Col sm={5}>
          <SelectForm options={options} id="interventions-select" title="Intervention Type" handleChange={this.handleChange}/>
        </Col>
        <InterventionTable condition={this.props.condition} sctid={this.props.sctid} intervention_type={this.state.type}/>
      </CustomTabContent>
    )
  }


}