import React, { Component } from 'react';
import '../stylesheets/navbar.css';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';


export default class CustomNavbar extends Component {
  render() {
    return (
      <Navbar dark fixed="true" expand="md">
        <NavbarBrand href="/">BrowsingHealth</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink href="#">Intervention Stats</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Outcomes Stats</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}
