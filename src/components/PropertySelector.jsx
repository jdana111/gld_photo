import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ListGroup, InputGroup, FormControl, Navbar, Nav } from 'react-bootstrap'

import { getProperties } from '../api'

function PropertySelector({ authHeader, setProperty, program, city, onLogout }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [properties, setProperties] = useState([]);
    const [activeOnly, setActiveOnly] = useState(false);

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }
        // eslint-disable-next-line
    }, [])
    console.log(program)
    const onSearch = (event) => {
        event.preventDefault()
        if (!program) return;
        getProperties(authHeader, searchTerm, program.id, activeOnly)
            .then(properties => setProperties(properties))
    }

    const onReset = () => {
        setSearchTerm('')
        setActiveOnly(false)
    }

    return (
        <div className="ev-base-container">
            <Navbar style={{ backgroundColor: program ? program.attributes.navbarBackgroundColor : 'black' }}>
                <Navbar.Brand className="ev-navbar-brand fn-lg d-flex align-items-center ember-view" href="/program">
                    {/* <img
                        alt=""
                        src={city.attributes.logoSmall}
                        className="d-inline-block align-top"
                    /> */}
                    <span class="hidden-md-up">
                        {program ? program.attributes.programName : ''}
                    </span>
                    <span class="d-none d-md-block fn-lg">
                        City of Golden
                        <strong style={{ color: program ? program.attributes.navbarFontColor : 'black' }}>
                            <span> 

                            {program ? program.attributes.programName : ''}
                            </span>
                        </strong>
                        <br />
                         <span className="font-fine">
                            Environmental Services
                         </span>
                    </span>

                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Item style={{ color: 'white' }} onClick={onLogout}>Logout</Nav.Item>
                </Nav>
            </Navbar>


            {/* <div className="d-flex">
                <Navbar bg="dark" expand="lg">
                    <Navbar.Brand href="#home">
                        {city && <img src={city.attributes.logoMain} alt="City logo" />}
                        <span class="d-none d-md-block fn-lg"
                        // {{program-colors 'nsd'}}
                        >
                            City of Golden
                            <br />
                            <span class="project-name font-fine">
                                Environmental Services
                         </span>
                        </span>
                    </Navbar.Brand>
                    <Nav className="ev-navbar-menu-items">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                    </Nav>
                </Navbar> */}

            <div className="container">
                <h3 className="ev-title">Select Property</h3>
            </div>
            <div className="container">
                <div className="row px-3">
                    <div className="card-body ev-card-search card">
                        <InputGroup className="imput-group">
                            <FormControl className="form-control ev-search-input" type="text" placeholder="Search Term" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <InputGroup.Append>
                                <Button className="btn btn-outline-secondary ev-search-button" type='submit' onClick={onSearch} variant="outline-secondary">Search</Button>
                                <Button className="btn btn-outline-secondary ev-search-button" variant="outline-secondary" onClick={onReset}>Reset</Button>
                                <Button className="btn btn-outline-secondary ev-search-button" variant={activeOnly ? "primary" : "outline-secondary"} onClick={() => setActiveOnly(old => !old)}>Active Only</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
            {Boolean(properties.length) && (
                <div className="container ev-search-container">
                    <div className="card ev-card-primary">
                        <div class="ev-banner-title-search">
                            Showing Results for "{searchTerm}" 
                        </div>
                        <ListGroup className="ev-clickable">
                            {properties.map(property => (
                                <ListGroup.Item key={property.id} onClick={() => setProperty(property)}>{property.attributes.propertyName}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertySelector;
