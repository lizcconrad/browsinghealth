import React, { Component } from 'react';
import { ListGroup } from 'reactstrap';
import ListItem from './ListItem.js';

export default class List extends Component {

  constructor(props) {
    super(props);

    this.listItems = this.props.links.map((link) =>
      <ListItem key={link} value={link} />
    );

  }

  render() {
    return (
      <ListGroup flush={true}>
        {this.listItems}
      </ListGroup>
    );
  }
}
