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

    const onSearch = (event) => {
        event.preventDefault()
        getProperties(authHeader, searchTerm, program.id, activeOnly)
            .then(properties => setProperties(properties))
    }

    const onReset = () => {
        setSearchTerm('')
        setActiveOnly(false)
    }

    return (
        <div className="ev-base-container">
            <Navbar style={{backgroundColor: program? program.attributes.navbarBackgroundColor : 'black'}}>
                <Navbar.Brand href="/program" style={{color: program? program.attributes.navbarFontColor : 'black'}}>
                <img
                    alt=""
                    src={city.attributes.logoSmall}
                    className="d-inline-block align-top"
                />{' '}
                City of Golden blah blah blah
                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Item style={{color: 'white'}} onClick={onLogout}>Logout</Nav.Item>
                </Nav>
            </Navbar>
            <div className="container">
                <h3 className="ev-title">Select Property</h3>
            </div>
            <div className="container">
                <div className="row">
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
                Results
      
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
