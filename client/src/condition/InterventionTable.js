import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import DataTable from './DataTable';

// query to get information about the interventions for a given condition, sctid, and intervention_type
// retrieves count, intervention_name, and nct_ids (unique ids provided for each clinical trial on ClinicalTrials.gov)
const GET_INTERVENTIONS = gql`
  query($condition: String, $sctid: String, $intervention_type: String) {
    interventions(condition: $condition, sctid: $sctid, intervention_type: $intervention_type) {
      count
      intervention_name
      nct_ids
    }
  }
`

class InterventionTable extends Component {

  constructor(props) {
    super(props);

    // array of the columns in the table: Registered Trials, Intervention
    this.columns = [{
      Header: 'Registered Trials',
      accessor: 'count', // String-based value accessors!
      maxWidth: 200,
    }, {
      Header: 'Intervention',
      accessor: 'intervention_name',
    }];

    // this.state = {
    //   data: [],
    // };
  }

  render() {
    
    if(this.props.GET_INTERVENTIONS.loading) {
      return null;
    }

    // save the data from the GraphQL query to the data variable
    let data;
    if(this.props.GET_INTERVENTIONS.interventions.length > 0) {
      data = this.props.GET_INTERVENTIONS.interventions;
    }

    // render the table with the data obtained from the query
    let element;
    if(data) {
      element = <DataTable columns={this.columns} data={data} links={data.nct_ids} defaultPageSize={10}/>
    } else {
      element = <p>NO INTERVENTIONS OF THIS TYPE</p>
    }

    return (
      element
    )
  }

}

export default compose(
  graphql(GET_INTERVENTIONS, { name: "GET_INTERVENTIONS" })
)(InterventionTable);
