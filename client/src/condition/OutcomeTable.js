import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import DataTable from './DataTable';

// query to get information about the outcomes for a given condition and sctid
// retrieves count, measure, and nct_ids (unique ids provided for each clinical trial on ClinicalTrials.gov)
const GET_OUTCOMES = gql`
  query($condition: String, $sctid: String) {
    outcomes(condition: $condition, sctid: $sctid) {
      count
      measure
      nct_ids
    }
  }
`

class OutcomeTable extends Component {

  constructor(props) {
    super(props);

    // array of the columns in the table: Registered Trials, Intervention
    this.columns = [{
      Header: 'Registered Trials',
      accessor: 'count', // String-based value accessors!
      maxWidth: 200,
    }, {
      Header: 'Outcome',
      accessor: 'measure',
    }];
  }

  render() {

    
    if(this.props.GET_OUTCOMES.loading) {
      return null;
    }

    let data;
    if(this.props.GET_OUTCOMES.outcomes.length > 0) {
      data = this.props.GET_OUTCOMES.outcomes;
    }

    let element;
    if(data) {
      element = <DataTable columns={this.columns} data={data} links={data.nct_ids} defaultPageSize={10}/>
    } else {
      element = <p>NO OUTCOMES TO SHOW</p>
    }

    return (
      element
    )
  }

}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(GET_OUTCOMES, { name: "GET_OUTCOMES" })
)(OutcomeTable);
