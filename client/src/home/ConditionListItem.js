import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { ListGroupItem } from 'reactstrap';

// Query to get an entry out of the trials database based on a condition string
// The query only returns the sctid, which is sent in the state of the Link
// When going to the condition page, if the sctid isn't null, it aggregates all conditions with the given sctids
const CONDITION_SINGLE = gql`
  query($condition: String) {
    # given the condition name
    conditionSingle(condition: $condition) {
      # return only the sctid
      sctid
    }
  }
`

class ConditionListItem extends Component {
  render() {

    // wait for query to finish running
    if(this.props.CONDITION_SINGLE.loading) { 
      return null;
    }

    // create a path that holds the sctid retrieved from the query
    let path = {
      pathname: "/condition/" + this.props.condition,
      state: {
        sctid: this.props.CONDITION_SINGLE.conditionSingle[0].sctid
      }
    };

    return (
        <ListGroupItem>
          <Link to={path}>{this.props.condition}</Link>
        </ListGroupItem>
    )
  }
}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(CONDITION_SINGLE, { name: "CONDITION_SINGLE" })
)(withRouter(ConditionListItem));
