import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import '../stylesheets/selectForm.css';

export default class SelectForm extends Component {

  constructor(props) {
    super(props);

    // this.id = props.id;
    // this.title = props.title;
    // this.handleChange = props.handleChange;
    // this.showInterventions = props.showInterventions;

    // map the options from props into DOM <option> elements for the dropdown menu
    this.options = props.options.map((option) =>
      <option key={option} value={option}>{option}</option>
    );
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for={this.props.id}>{this.props.title}</Label>
            <Input type="select" name="select" id={this.props.id} onChange={this.props.handleChange}>
            {this.options}
            </Input>
        </FormGroup>
      </Form>

    )
  }
}
