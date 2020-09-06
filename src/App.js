import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { Form, Dropdown, Button } from 'react-bootstrap'

import LoginModal from './components/LoginModal'
import PropertyFinderModal from './components/PropertyFinderModal'

import { getCity, getPrograms } from './api'
import logo from './logo.svg';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [pictures, setPictures] = useState([]);
  const [authHeader, setAuthHeader] = useState(null);
  const [user, setUser] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [finderModalOpen, setFinderModalOpen] = useState(false)

  const grabStuff = () => {
    console.log('GRAB')
    if (!authHeader) {
      return
    }
    getCity({ 'Authorization': authHeader })
  }

  const onChooseProprety = (property, event) => {
    setSelectedProperty(property)
  }

  const onOpenFinder = () => {
    setFinderModalOpen(true)
  }

  const onDrop = picture => {
    setPictures([...pictures, picture]);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <p onClick={ () => grabStuff() }>
          Golden Upload Photo
        </p>
        { selectedProperty && 
          <p>
            Selected property is = { selectedProperty.attributes.propertyName }
          </p>
        }
        <div>
          <ImageUploader
            withIcon={true}
            onChange={onDrop}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
          />
        </div>
        <div>
          <Button onClick={ onOpenFinder }>Find Property</Button>
        </div>
      </header>
      <PropertyFinderModal modalOpen={ finderModalOpen } onClose={ () => setFinderModalOpen(false) } authHeader={authHeader} onSelectProperty={ onChooseProprety }/>
      <LoginModal modalOpen={ !Boolean(user) } onClose={ () => setUser(null) } setUser={ setUser } setAuthHeader={ setAuthHeader }/>
    </div>
  );
}

export default App;
