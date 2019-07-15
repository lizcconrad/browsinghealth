import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import DataTable from './DataTable';

// query to get information about the publications for a given condition
// retrieves nct_id, pmid (PubMed ID), and the citation itself
const GET_PUBLICATIONS = gql`
  query($condition: String) {
    publications(condition: $condition) {
      nct_id
      pmid
      citation
    }
  }
`


class PublicationTable extends Component {

  constructor(props) {
    super(props);

    // array of the columns in the table: PMID, Citation
    this.columns = [{
      Header: 'PMID',
      accessor: 'pmid', // String-based value accessors!
      maxWidth: 200,
    }, {
      Header: 'Citation',
      accessor: 'citation',
    }];

  }

  render() {

    if(this.props.GET_PUBLICATIONS.loading) {
      return null;
    }

    // make an array to store the data returned by the query
    let data_readOnly = [];
    if(this.props.GET_PUBLICATIONS.publications.length > 0) {
      data_readOnly = this.props.GET_PUBLICATIONS.publications;
    }

    // make an array to store the data to be displayed in the table
    // the data from the query must be mutated slightly before being in the proper form for the table
    let data = [];
    for(let i=0; i<data_readOnly.length; i++) {
      // a dictionary for the data for the table
      let obj = {};
      // if there is a pmid, build a link to the publication and store it in the "obj" dictionary
      if(data_readOnly[i].pmid != null) {
        obj.pmid = <a href={`https://www.ncbi.nlm.nih.gov/pubmed/` + data_readOnly[i].pmid} target="_blank">{data_readOnly[i].pmid}</a>;
      }
      // if there is a citation, store it in the "obj" dictionary
      if(data_readOnly[i].citation != null) {
        obj.citation = data_readOnly[i].citation;
      }
      // add the dictionary to the data for the table
      data.push(obj);
    }

    // render the table with the data
    let element;
    if(data) {
      element = <DataTable columns={this.columns} data={data} defaultPageSize={10} subComponent={false}/>
    } else {
      element = <p>NO PUBLICATIONS TO SHOW</p>
    }

    return (
      element
    )
  }

}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(GET_PUBLICATIONS, { name: "GET_PUBLICATIONS" })
)(PublicationTable);
