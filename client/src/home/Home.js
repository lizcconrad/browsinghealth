import React, { Component } from 'react';
import Page from '../common/Page';
import ConditionList from './ConditionList';
import SearchBar from './SearchBar';
import '../stylesheets/home.css'

export default class Home extends Component {
  render() {
    return (
      <Page>
        <div className="row">
          <SearchBar />
        </div>
        <div className="row d-flex justify-content-around">
          <div className="col-10">
            <ConditionList title="Quick Access" conditions={this.props.conditions} />
          </div>
        </div>
      </Page>
    )
  }
}
