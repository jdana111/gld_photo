import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ListGroup, InputGroup, FormControl } from 'react-bootstrap'

import { getProperties } from '../api'

function PropertySelector({ authHeader, setProperty, program }) {

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
        <div>
            <h3>Select Property</h3>
            <InputGroup className="mb-3">
                <FormControl type="text" placeholder="Search Term" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                <InputGroup.Append>
                    <Button type='submit' onClick={onSearch} variant="outline-secondary">Search</Button>
                    <Button variant="outline-secondary" onClick={onReset}>Reset</Button>
                    <Button variant={activeOnly ? "primary" : "outline-secondary"} onClick={() => setActiveOnly(old => !old)}>Active Only</Button>
                </InputGroup.Append>
            </InputGroup>
            <div>
                <ListGroup>
                    {properties.map(property => (
                        <ListGroup.Item key={property.id} onClick={() => setProperty(property)}>{property.attributes.propertyName}</ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
}

export default PropertySelector;
