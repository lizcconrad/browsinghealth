import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Col, Row } from 'reactstrap';
import Page from '../common/Page';
import TabHolder from './TabHolder.js';
import InterventionDisplay from './InterventionDisplay';
import DistributionDisplay from './DistributionDisplay';
import OutcomeDisplay from './OutcomeDisplay';
import PublicationDisplay from './PublicationDisplay';
import MatchingDisplay from './MatchingDisplay';
import RelatedPane from './RelatedPane';
import '../stylesheets/conditionPage.css';


// IF THERE IS NO SCTID
// this query will be used to retrieve information (specifically the number of studies) for the given condition
//#region
const CONDITION_SINGLE = gql`
  query($condition: String) {
    conditionSingle(condition: $condition) {
      studies
    }
  }
`
//#endregion

// IF THERE IS AN SCTID
// this query will be used to retrieve information (specifically the number of studies) for conditions with the given sctid 
//#region
const CONDITIONS_SCTID = gql`
  query($sctid: String) {
    conditions_sctid(sctid: $sctid) {
      studies
    }
  }
`

// this query will be used to retrieve the number of interventions for the given condition/sctid (if an sctid if provided)
const GET_INTERVENTIONS = gql`
  query($condition: String, $sctid: String) {
    interventions(condition: $condition, sctid: $sctid) {
      count
    }
  }
`

// this query will be used to retrieve the number of outcomes for the given condition/sctid (if an sctid if provided)
const GET_OUTCOMES = gql`
  query($condition: String, $sctid: String) {
    outcomes(condition: $condition, sctid: $sctid) {
      count
    }
  }
`
//#endregion

// store a DOM element that displays the total number of studies for the given condition/sctid
const StudyCount = ( {condition, sctid} ) => {
  // if there is no sctid, run the CONDITION_SINGLE query
  if(sctid == null) {
    return <Query query={CONDITION_SINGLE} variables={{condition}}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        return (
          <p className="conditionPage-counts">Studies: {data.conditionSingle[0].studies}</p>
        );
      }}
    </Query>
  // otherwise, run the CONDITIONS_SCTID query
  } else {
    return <Query query={CONDITIONS_SCTID} variables={{sctid}}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        return (
          <p className="conditionPage-counts">Studies: {data.conditions_sctid[0].studies}</p>
        );
      }}
    </Query>
  }
};

// store a DOM element that displays the total number of interventions for the given condition/sctid
const InterventionCount = ( {condition, sctid} ) => (
  <Query query={GET_INTERVENTIONS} variables={{condition, sctid}}>
  {({ loading, error, data }) => {
    if (loading) return null;
    if (error) return `Error!: ${error}`;

    return (
      <p className="conditionPage-counts">Interventions: {data.interventions.length}</p>
    );
  }}
  </Query>
);

// store a DOM element that displays the total number of outcomes for the given condition/sctid
const OutcomeCount = ( {condition, sctid} ) => (
  <Query query={GET_OUTCOMES} variables={{condition, sctid}}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <p className="conditionPage-counts">Outcomes: {data.outcomes.length}</p>
      );
    }}
  </Query>
);


// an array of tabs that are displayed on the lefthand side of the page 
// each entry contains an id (for the DOM element of the tab), a content-id (for the DOM element of the content within the tab), and a title (displayed on the tab)
// one tab (in this case, interventions-tab) is given a default "active" propertyo of true.
// -- interventions-tab: display the table of interventions
// -- distribution-tab: display the distribution chart
// -- outcomes-tab: display the table of outcomes
// -- publications-tab: display the table of publications
// -- matching-tab: display matching conditions based on sctids
const tabs = [{id: "interventions-tab", contentId: "interventions-tab-content", title: "Interventions", active:true},
{id: "distribution-tab", contentId: "distribution-tab-content", title: "Intervention Distribution"},
{id: "outcomes-tab", contentId: "outcomes-tab-content", title:"Outcomes"}, 
{id: "publications-tab", contentId: "publications-tab-content", title:"Publications"},
{id: "matching-tab", contentId: "matching-tab-content", title:"Matching Conditions"}];

export default class ConditionPage extends Component {

  constructor(props) {
    super(props);

    this.condition = props.match.params.condition_name;
    // check for sctid and save it to the state. save as null if null.
    if(props.location.state) {
      this.sctid = props.location.state.sctid;
    } else {
      this.sctid = null;
    }
    

  }

  render() {
      return (
        <Page>
          <div className="row d-flex justify-content-between">
            <Col sm={7}>
                <h2 className="conditionPage-title">{this.condition}</h2>
                <Row className="d-flex justify-content-start">
                  <StudyCount condition={this.condition} sctid={this.sctid}/>
                  <InterventionCount condition={this.condition} sctid={this.sctid}/>
                  <OutcomeCount condition={this.condition} sctid={this.sctid}/>
                </Row>
              <TabHolder tabs={tabs}>
                <InterventionDisplay condition={this.condition} sctid={this.sctid} active="active"/>
                <DistributionDisplay condition={this.condition} sctid={this.sctid}/>
                <OutcomeDisplay condition={this.condition} sctid={this.sctid}/>
                <PublicationDisplay condition={this.condition} sctid={this.sctid}/>
                <MatchingDisplay sctid={this.sctid}/>
              </TabHolder>
            </Col>
            <Col sm={3}>
              <RelatedPane title="Related Conditions" condition={this.condition} maximum={11}/>
            </Col>
          </div>
        </Page>
      );

  }
}
