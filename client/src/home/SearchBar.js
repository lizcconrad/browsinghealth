import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { InputGroup, Button, InputGroupAddon } from 'reactstrap';
import '../stylesheets/searchBar.css';

// GraphQL query that is used to return all conditions that contain the given substring
const CONDITION_SEARCH = gql`
  query($condition: String) {
    conditionSearch(condition: $condition) {
      condition
    }
  }
`


class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  // when a condition from the shown list is clicked, create a path with that information and save it in the state
  handleOnClick = () => {
    const link = "/condition/" + this.state.condition;

    this.setState({link: link});
    this.setState({redirect: true});
  }

  render() {

    // if the state contains redirect information, redirect to the new page
    if (this.state.redirect) {
      return <Redirect push to={this.state.link} />;
    }

    return (
      // use an ApollogConsumer component to access the client for AsyncTypeahead
      <ApolloConsumer>
        {client => (
          <InputGroup className="d-flex justify-content-center">
            <AsyncTypeahead
              {...this.state}
              className="col-8"
              minLength={3}
              onSearch={async(query) => {
                    this.setState({isLoading: true});

                    // call the CONDITION_SEARCH query with what's currently in the searchbox
                    client.query({
                      query: CONDITION_SEARCH,
                      variables: { condition: query }
                    }).then(result => {
                      let options = [];
                      for (var i = 0; i < result.data.conditionSearch.length; i++) {
                        // push an option onto the list for each condition returned from the query
                        options.push(result.data.conditionSearch[i].condition);
                      }
                      this.setState({
                        isLoading: false,
                        options: options,
                        condition: query
                      });
                    });

                  }}
              onChange={(text) => {this.setState({condition: text})}}
              placeholder="Search for a condition..."
              renderMenuItemChildren={(option, props) => (
                <div>{option}</div>
              )}
            />
            <InputGroupAddon addonType="append">
              <Button type="submit" onClick={this.handleOnClick}>
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup>
        )}
      </ApolloConsumer>
    )
  }
}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(CONDITION_SEARCH, { name: "CONDITION_SEARCH" })
)(SearchBar);
