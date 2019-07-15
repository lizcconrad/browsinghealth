import React, { Component } from 'react';
import { Collapse, Nav, Row } from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { ic_chevron_right } from 'react-icons-kit/md/ic_chevron_right';
import { ic_expand_more } from 'react-icons-kit/md/ic_expand_more';
import '../stylesheets/showMore.css';


export default class ShowMore extends Component {

  constructor(props) {
    super(props);

    // set the initial state so that the menu is not toggled and the icon is the right facing chevron
    this.state = { 
      collapse: false,
      icon: ic_chevron_right
    };

  }

  // function of what to do when the "Show More" menu is toggled
  toggle = () => {
    // swap the state
    this.setState({ collapse: !this.state.collapse });

    // swap the icon between right chevron and expanded chevron
    if(this.state.icon === ic_chevron_right) {
      this.setState({ icon: ic_expand_more });
    } else {
      this.setState({ icon: ic_chevron_right });
    }

  }

  render() {

    let moreElement;
    if(this.props.more.length > 0) {
      moreElement = 
        <div>
          <div>        
            <div onClick={this.toggle} className="show-more-button">
              <Row>
                <Icon icon={this.state.icon} />
                Show more ({this.props.more.length})
              </Row>
            </div>
          </div>
          <Collapse isOpen={this.state.collapse}>
            <Nav vertical>
              {this.props.more}
            </Nav>
          </Collapse>
        </div>
    } else {
      moreElement = null;
    }


    return (
      moreElement
    );
  }
}