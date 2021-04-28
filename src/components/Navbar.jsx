import React from 'react'
import { Button, ListGroup, InputGroup, FormControl, Navbar as BSNavbar, Nav } from 'react-bootstrap'

export function Navbar({ program, city, onLogout }) {


    return (
        <BSNavbar style={{ backgroundColor: program ? program.attributes.navbarBackgroundColor : 'black' }}>
            <BSNavbar.Brand href="/program" style={{ color: program ? program.attributes.navbarFontColor : 'black' }}>
                <img
                    alt=""
                    src={city.attributes.logoSmall}
                    className="d-inline-block align-top"
                />{' '}
            City of Golden blah taco
            </BSNavbar.Brand>
            <Nav className="ml-auto">
                <Nav.Item style={{ color: 'white' }} onClick={onLogout}>Logout</Nav.Item>
            </Nav>
        </BSNavbar>
    )
}