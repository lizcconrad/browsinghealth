import React, { Component } from 'react';
import { ListGroup } from 'reactstrap';
import ConditionListItem from './ConditionListItem.js';


export default class ConditionList extends Component {

  constructor(props) {
    super(props);
    // create a list of ConditionListItem components using the conditions provided by props
    this.listItems = this.props.conditions.map((condition) =>
      <ConditionListItem key={condition} condition={condition.toLowerCase()} />
    );

  }

  render() {
    return (
      <ListGroup flush={true}>
        {/* h4 using the title passed from props for the title of the list */}
        <h4 className="display-5">{this.props.title}</h4>
        {this.listItems}
      </ListGroup>
    );
  }
}
