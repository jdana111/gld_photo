import React from 'react'
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap'
import { FaSignOutAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export function Navbar({ program, onLogout, onDebugClick }) {

    return (
        <BSNavbar style={{ backgroundColor: program ? program.attributes.navbarBackgroundColor : 'black' }}>
            <Container>
                <div className="navbar-container">
                    <Link to="/program">
                        <BSNavbar.Brand className="ev-navbar-brand fn-lg d-flex align-items-center ember-view">
                            <span style={{ color: program ? program.attributes.navbarFontColor : 'black' }} className="d-block d-sm-none">
                                {program ? program.attributes.programName : ''}
                            </span>
                            <span className="d-none d-sm-block fn-lg ev-nav-font">
                                City of Golden
                                <strong style={{ color: program ? program.attributes.navbarFontColor : 'black' }}>
                                    <span> </span>
                                    {program ? program.attributes.programName : ''}
                                </strong>
                                <br />
                                <span className="font-fine ev-nav-font">
                                    Environmental Services
                                </span>
                            </span>
                        </BSNavbar.Brand>
                    </Link>
                    <Nav className="ml-auto ev-navbar-nav">
                        <Nav.Item className="ev-nav-font space" onClick={() => onDebugClick && onDebugClick() }>
                        </Nav.Item>
                        <Nav.Item className="ev-nav-font" onClick={onLogout}>
                            <div className="ev-icons-nav">
                                <FaSignOutAlt />
                            </div>
                            <span className="d-none d-sm-block ml-2">
                                Logout
                            </span>
                        </Nav.Item>
                    </Nav>
                </div>
            </Container>
        </BSNavbar>
    )
}