import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ListGroup, InputGroup, FormControl, Navbar, Nav } from 'react-bootstrap'

import { getProperties } from '../api'
import { useMediaQuery } from '../utils'

function PropertySelector({ authHeader, setProperty, program, city, onLogout }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [properties, setProperties] = useState([]);
    const [activeOnly, setActiveOnly] = useState(false);

    const isBig = useMediaQuery('(min-width: 500px)');

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


    

    let form
    if (isBig) {
        form = (
            <div className="row px-3">
                <div className="card-body ev-card-search card">
                    <InputGroup>
                        <FormControl className="form-control ev-search-input" type="text" placeholder="Search Term" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <InputGroup.Append>
                            <Button className="btn btn-outline-secondary ev-search-button" type='submit' onClick={onSearch} variant="outline-secondary">Search</Button>
                            <Button className="btn btn-outline-secondary ev-search-button" variant="outline-secondary" onClick={onReset}>Reset</Button>
                            <Button className="btn btn-outline-secondary ev-search-button" variant={activeOnly ? "primary" : "outline-secondary"} onClick={() => setActiveOnly(old => !old)}>Active Only</Button>
                            {/* <span>
                        { activeOnly ? (
                             <Button class="btn btn-outline-secondary ev-search-button">Show Inactive</Button>
                        ) : (
                            <Button class="btn btn-outline-secondary ev-search-button" style={{ color: program ? program.attributes.navbarBackgroundColor : 'black' }}>Active & Inactive</Button>
                        )}
                        </span> */}
                        </InputGroup.Append>
                    </InputGroup>
                    <div>
                    </div>
                </div>
            </div>
        )
    } else {
        form = (
            <div className="row px-3">
                <div className="card-body ev-card-search card">
                        <FormControl className="form-control ev-search-input" type="text" placeholder="Search Term" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <Button className="btn btn-outline-secondary ev-search-button-sm" type='submit' onClick={onSearch} variant="outline-secondary">Search</Button>
                            <Button className="btn btn-outline-secondary ev-search-button-sm" variant="outline-secondary" onClick={onReset}>Reset</Button>
                            <Button className="btn btn-outline-secondary ev-search-button-sm" variant={activeOnly ? "primary" : "outline-secondary"} onClick={() => setActiveOnly(old => !old)}>Active Only</Button>

                    <div>
                    </div>
                </div>
            </div>
        )
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
                    <span style={{ color: program ? program.attributes.navbarFontColor : 'black' }} class="d-block d-sm-none">
                        {program ? program.attributes.programName : ''}
                    </span>
                    <span class="d-none d-sm-block fn-lg ev-nav-font">
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

                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Item className="ev-nav-font" onClick={onLogout}>Logout</Nav.Item>
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
                <h3 className="py-2 ev-title">Select Property</h3>
            </div>
            <div className="container">
                {form}
            </div>
            {Boolean(properties.length) && (
                <div className="container ev-search-container">
                    <div className="card ev-card-primary">
                        <div className="ev-banner-title-search" style={{backgroundColor: program ? program.attributes.navbarBackgroundColor : 'white' }}>
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
