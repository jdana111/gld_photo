import React, { useState, useEffect } from 'react';
import { Form, Dropdown, Modal, Button, ListGroup } from 'react-bootstrap'

import { getPrograms, getProperties } from '../api'

function PropertyFinderModal({ modalOpen, authHeader, onClose, onSelectProperty }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!authHeader) {
      console.warn('NOT AUTH HEADER')
      return 
    }
    getPrograms(authHeader).then(programs => {
      console.log(programs)
      setPrograms(programs)
    })
  }, [authHeader, modalOpen])
  
  const onSearch = (event) => {
    event.preventDefault()
    getProperties(authHeader, searchTerm, selectedProgram.id)
     .then(properties => {
       console.log("GOT PROPERTIES", properties)
       setProperties(properties)
     })
  }

  const onChooseProgram = (index) => {
    setSelectedProgram(programs[parseInt(index)])
  }

  return (
    <Modal show={ modalOpen } onHide={ onClose }>
        <Modal.Header closeButton>
            <Modal.Title>Find Property</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form >
            Selected Program: {selectedProgram && selectedProgram.attributes.programName}
            <Form.Group>
              <Dropdown onSelect={ onChooseProgram }>
                <Dropdown.Toggle variant="success">
                  Select Program
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  { programs.map((p, i) => (
                    <Dropdown.Item key={ p.id } eventKey={ i }>{p.attributes.programName}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group>
                <Form.Label>Search Term</Form.Label>
                <Form.Control type="text" placeholder="Search Term" value={searchTerm} onChange={ e => setSearchTerm(e.target.value) } />
                {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text> */}
            </Form.Group>
            <Form.Group>
                <Button type='submit' onClick={ onSearch }>Search</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <div>
          <ListGroup>
            { properties.map(property => (
              <ListGroup.Item key={property.id} onClick={ () => onSelectProperty(property) }>{property.attributes.propertyName}</ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Save changes</Button>
        </Modal.Footer> */}
    </Modal>
  );
}

export default PropertyFinderModal;
