import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { ListGroupItem } from 'reactstrap';

// GraphQL query to get the brief_title of a particular trial given its nct_id
const FULL_TRIAL = gql`
  query($nct_id: String) {
    full_trial(nct_id: $nct_id) {
      brief_title
    }
  }
`

class ListItem extends Component {

  constructor(props) {
    super(props);

    // build the link to clinicaltrials.gov
    this.link = "https://clinicaltrials.gov/ct2/show/" + this.props.value + "?rank=1";
  }

  render() {

    if(this.props.FULL_TRIAL.loading) {
      return null;
    }

    return (
      <ListGroupItem>
        <a href={this.link} target="_blank">{this.props.FULL_TRIAL.full_trial[0].brief_title}</a>
      </ListGroupItem>
    )
  }
}

// export the graphql query with a name and options
// the name and options are saved to props if needed
// in this case the "value" is accessed for building the link to clinicaltrials.gov
export default compose(
  graphql(FULL_TRIAL, { 
    name: "FULL_TRIAL",
    options: ({ value }) => ({ variables: { nct_id: value } }),
  })
)(ListItem);
