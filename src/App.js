import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { Form, Dropdown, Button } from 'react-bootstrap'
import exifr from 'exifr'

import LoginModal from './components/LoginModal'
import PropertyFinderModal from './components/PropertyFinderModal'
import PhotoPreview from './components/PhotoPreview';

import { getCity, getPrograms } from './api'
import logo from './logo.svg';
import { usePosition } from './utils';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [pictures, setPictures] = useState([]);
  const [authHeader, setAuthHeader] = useState(null);
  const [user, setUser] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [finderModalOpen, setFinderModalOpen] = useState(false)

  const position = usePosition()

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


  const onDrop = (newPictures, dataUrls) => {
    setPictures(newPictures);
    console.log(dataUrls)
  };


  // const scanStuff = () => {
  //   console.log('start scan')
  //   exifr.parse(pictures[0]).then(r => {
  //     console.log(r)
  //   })
  //   // const buffer = exifr.thumbnail(pictures[0])
  //   const objectURL = window.URL.createObjectURL(pictures[0]);
  //   const img = document.getElementById('test')
  //   img.src = objectURL
  // }
  
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
        {/* <img src="" id="test"></img> */}
        { (pictures && pictures.length > 0) && pictures.map((p, i) => <PhotoPreview picture={p} index={i}/>)}
        {/* <div onClick={ () => scanStuff() }>MEMEMEM</div> */}
        <div>
          <ImageUploader
            withIcon={true}
            onChange={onDrop}
            imgExtension={[".jpg", ".jpeg", ".png"]}
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
