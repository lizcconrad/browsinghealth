import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Nav, NavItem, NavLink } from 'reactstrap';
import ShowMore from './ShowMore';

// GraphQL query to return a list of more specific conditions that contain the same string as the current condition
// e.g. if the current condition is "Asthma" the conditions returned by this query will include "Chronic Asthma," "Asthma Brittle," "Acute Asthma," etc.
const CONDITION_SEARCH = gql`
  query($condition: String) {
    conditionSearch(condition: $condition) {
      condition
    }
  }
`

class RelatedPane extends Component {

  // this.props.maximum = the maximum number of conditions automatically displayed in the related pane before expanding the list

  render() {

    if(this.props.CONDITION_SEARCH.loading) {
      return null;
    }

    let data;
    //variable to show how many more related conditions there are than the maximum
    let more = 0;


    if(this.props.CONDITION_SEARCH.conditionSearch.length > 0) {
      data = this.props.CONDITION_SEARCH.conditionSearch;
    }

    let listItems = [];
    let moreItems = [];
    if(data) {

      // set more to the difference between total related conditions and the maximum displayed
      more = data.length - this.props.maximum;

      // loop through the conditions that are going to be displayed by default
      // the number of iterations is the minumum between the maximum default or just the length of the data if smaller than the maximum 
      for (let i = 0; i < Math.min(data.length, this.props.maximum); i++) {

        // if the condition is the condition of the current page, don't show it in the related list
        if(data[i].condition === this.props.condition) {
          continue;
        }

        // make a list of navitems for the related conditions 
        listItems.push(
          <NavItem key={data[i].condition + i}>
            <NavLink href={"/condition/" + data[i].condition}>{data[i].condition}</NavLink>
          </NavItem>
        );
      }

      // if there's more conditions than the max
      if(more > 0) {

        // start the loops at the index of the maximum and loop through the rest of the data
        for (let i = this.props.maximum; i < data.length; i++) {

          // if the condition is the condition of the current page, don't show it in the list
          if(data[i].condition === this.props.condition) {
            continue;
          }
  
          // make a list of navitems for the extra related conditions that will be in the expanded list
          moreItems.push(
            <NavItem key={data[i].condition +i}>
              <NavLink href={"/condition/" + data[i].condition}>{data[i].condition}</NavLink>
            </NavItem>
          );
        }

      }

    }
    

    let element;
    // if there's related conditions, put the list in a Nav element
    if(listItems.length > 0) {
      element = 
      <Nav vertical>
        {listItems}
      </Nav>
    }
    // otherwise, say that there's "No conditions" 
    else {
      element = <div>No conditions</div>
    }

    // render the extra conditions in a ShowMore component
    let moreElement = <ShowMore more={moreItems}></ShowMore>


    return (
      <div>
        <h4 className="display-5">{this.props.title}</h4>
        <hr/>
        {element}

        {moreElement}

      </div>
    );
  }
}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(CONDITION_SEARCH, { name: "CONDITION_SEARCH" })
)(RelatedPane);
