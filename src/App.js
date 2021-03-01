import React, { useState } from 'react';
import ImageUploader from "react-images-upload";
import { Button } from 'react-bootstrap'
import exifr from 'exifr'
import FormData from 'form-data'

import LoginModal from './components/LoginModal'
import PropertyFinderModal from './components/PropertyFinderModal'
import PhotoPreview from './components/PhotoPreview';

import { getCity, submitPhoto } from './api'
// import logo from './logo.svg';
import { usePosition } from './utils';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const [pictures, setPictures] = useState([]);
    const [authHeader, setAuthHeader] = useState(null);
    const [user, setUser] = useState(null)
    const [selectedProperty, setSelectedProperty] = useState(null)
    const [finderModalOpen, setFinderModalOpen] = useState(false)
    const [captions, setCaptions] = useState({})

    const position = usePosition()

    const grabStuff = () => {
        console.log('GRAB')
        if (!authHeader) {
            return
        }
        console.log(position)
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

    const submit = () => {
        if (!selectedProperty) {
            alert("No property selected")
            return
        }

        pictures.forEach((pic, index) => {
            exifr.parse(pic).then(exifdata => {
                let latitude, longitude
                if (exifdata && exifdata.GPSLongitude && exifdata.GPSLatitude) {
                    latitude = exifdata.GPSLatitude[0] + (exifdata.GPSLatitude[1] / 60) + (exifdata.GPSLatitude[2] / 3600)
                    longitude = exifdata.GPSLongitude[0] + (exifdata.GPSLongitude[1] / 60) + (exifdata.GPSLongitude[2] / 3600)

                }
                let data = new FormData();
                data.append('file', pic, pic.name);
                data.append('caption', captions[index] || '')
                data.append('latitude', latitude)
                data.append('longitude', longitude)
                data.append('property_id', selectedProperty.id)

                submitPhoto(data, authHeader)
            })
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                <p onClick={() => grabStuff()}>
                    Golden Upload Photo
                </p>
                {selectedProperty &&
                    <p>
                        Selected property is = {selectedProperty.attributes.propertyName}
                    </p>
                }
                {(pictures && pictures.length > 0) && pictures.map((p, i) =>
                    <PhotoPreview
                        picture={p}
                        index={i}
                        key={i}
                        authHeader={authHeader}
                        property={selectedProperty}
                        caption={captions[i] || ''}
                        setCaption={(newCaption) => {
                            setCaptions(old => ({
                                ...old,
                                [i]: newCaption
                            }))
                        }}
                        onMatch={() => {
                            setCaptions(old => {
                                const val = old[i]
                                const newCaptions = {}
                                pictures.forEach((p, index) => {
                                    newCaptions[index] = val
                                })
                                return newCaptions
                            })
                        }} />
                )}
                { Boolean(selectedProperty) && (
                    <div>
                        <ImageUploader
                            withIcon={true}
                            onChange={onDrop}
                            imgExtension={[".jpg", ".jpeg", ".png"]}
                            maxFileSize={5242880}
                        />
                        <button type="button" onClick={submit} className="btn btn-primary">Submit</button>
                    </div>
                )}
                <div>
                    <Button onClick={onOpenFinder}>Find Property</Button>
                </div>
            </header>
            <PropertyFinderModal modalOpen={finderModalOpen} onClose={() => setFinderModalOpen(false)} authHeader={authHeader} onSelectProperty={onChooseProprety} />
            <LoginModal modalOpen={!Boolean(user)} onClose={() => setUser(null)} setUser={setUser} setAuthHeader={setAuthHeader} />
        </div>
    );
}

export default App;
