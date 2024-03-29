import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ListGroup, InputGroup, FormControl } from 'react-bootstrap'

import { Navbar } from '../components/Navbar'
import { getProperties } from '../api'
import { useMediaQuery } from '../utils'

function PropertySelector({ authHeader, setProperty, program, city, onLogout }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [properties, setProperties] = useState([]);
    const [activeOnly, setActiveOnly] = useState(true);

    const isBig = useMediaQuery('(min-width: 500px)');

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }
        // eslint-disable-next-line
    }, [])
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

    const buttonText = activeOnly ? "Active Only" : "Active & Retired";

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
                            <Button className={`btn btn-outline-secondary ev-search-button ${activeOnly ? "" : "green"}`} variant="outline-secondary" onClick={() => setActiveOnly(old => !old)} >{buttonText}</Button>
                        </InputGroup.Append>
                    </InputGroup>
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
                    <Button className={`btn btn-outline-secondary ev-search-button ${activeOnly ? "" : "green"}`} variant="outline-secondary" onClick={() => setActiveOnly(old => !old)} >{buttonText}</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="ev-base-container">
            <Navbar city={city} program={program} onLogout={onLogout} />
            <div className="container ev-page-container">
                <h3 className="pt-2 ev-title">Select {program ? program.attributes.propertyAlias : 'property'}</h3>
                {form}
            </div>
            {Boolean(properties.length) && (
                <div className="container ev-search-container">
                    <div className="card ev-card-primary">
                        <div className="ev-banner-title-search" style={{ backgroundColor: program ? program.attributes.navbarBackgroundColor : 'white' }}>
                            Showing Results for "{searchTerm}"
                        </div>
                        <ListGroup className="ev-clickable ev-program-list">
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
