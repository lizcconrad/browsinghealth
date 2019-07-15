import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import DataTable from './DataTable';

// GraphQL query to get the entries from the conditions collection with matching sctids to the current condition
const GET_CONDITIONS = gql`
  query($sctid: String) {
    conditions(sctid: $sctid) {
      condition
      studies
      nct_ids
    }
  }
`


class MatchingTable extends Component {

  constructor(props) {
    super(props);

    this.columns = [{
      Header: 'Studies',
      accessor: 'studies', // String-based value accessors!
      maxWidth: 200,
    }, {
      Header: 'Condition',
      accessor: 'condition',
    }];

  }

  render() {    
    if(this.props.GET_CONDITIONS.loading) {
      return null;
    }

    let data;
    if(this.props.GET_CONDITIONS.conditions.length > 0) {
      data = this.props.GET_CONDITIONS.conditions;
    }

    let element;
    element = <DataTable columns={this.columns} data={data} links={data.nct_ids} defaultPageSize={10}/>

    return (
      element
    )
  }

}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(GET_CONDITIONS, { name: "GET_CONDITIONS" })
)(MatchingTable);
