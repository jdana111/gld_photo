import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { useHistory } from 'react-router-dom';
import { Spinner, Navbar, Nav } from 'react-bootstrap';
import exifr from 'exifr'
import FormData from 'form-data'

import PhotoPreview from './PhotoPreview'
import { submitPhoto } from '../api'
import { usePosition } from '../utils'

function PhotoUpload({ property, authHeader, user, program, city, onLogout }) {

    const [pictures, setPictures] = useState([]);
    const [batchCount, setBatchCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState({});
    const [debugString, setDebugString] = useState('');

    const {position, testOnChange, loadTestData, getCoordsForTime} = usePosition()

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }
        // eslint-disable-next-line
    }, [])

    const onDrop = (newPictures, dataUrls) => {
        setPictures(newPictures);
    };

    const submit = () => {
        if (!property) {
            alert("No property selected")
            return
        }

        setLoading(true)
        Promise.all(pictures.map(pic => exifr.parse(pic)))
            .then((exifDatas) => {
                const promises = []
                exifDatas.forEach((exifData, index) => {
                    const pic = pictures[index]
                    let data = new FormData();
                    data.append('file', pic, pic.name);
                    data.append('caption', captions[index] || '')
                    if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
                        const latitude = exifData.GPSLatitude[0] + (exifData.GPSLatitude[1] / 60) + (exifData.GPSLatitude[2] / 3600)
                        const longitude = exifData.GPSLongitude[0] + (exifData.GPSLongitude[1] / 60) + (exifData.GPSLongitude[2] / 3600)
                        data.append('latitude', latitude)
                        data.append('longitude', longitude)
                    } else if (exifData && exifData.CreateDate) {
                        // set phone gps here
                        const coords = getCoordsForTime(exifData.CreateDate)
                        console.log(coords)
                        data.append('latitude', undefined)
                        data.append('longitude', undefined)
                    } else {
                        data.append('latitude', undefined)
                        data.append('longitude', undefined)
                    }
                    data.append('property_id', property.id)
                    data.append('user_id', user.id)
            
                    const p = submitPhoto(data, authHeader)
                    promises.push(p)
                })
                return Promise.all(promises)
            })
            .then(results => {
                setLoading(false)
                setPictures([])
                setBatchCount(old => old + 1)
            })
            .catch(err => {
                setLoading(false)
                setDebugString(JSON.stringify(err))
                console.log("ERROR WITH GPS PARSE OR UPLOAD", err)
            })
    }

    if (!property || property === 'null') {
        return <div></div>
    }

    return (
        <div className="PhotoUpload">
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
            {property && <h4>{property.attributes.propertyName}</h4>}
            {(pictures && pictures.length > 0) && pictures.map((p, i) =>
                <div key={i}> 
                    <PhotoPreview
                        picture={p}
                        index={i}
                        key={p.name}
                        authHeader={authHeader}
                        property={property}
                        caption={captions[p.name] || ''}
                        setCaption={(newCaption) => {
                            setCaptions(old => ({
                                ...old,
                                [p.name]: newCaption
                            }))
                        }}
                        onMatch={() => {
                            setCaptions(old => {
                                const val = old[i]
                                const newCaptions = {}
                                pictures.forEach((p) => {
                                    newCaptions[p.name] = val
                                })
                                return newCaptions
                            })
                        }} />
                    <button onClick={() => {
                      exifr.parse(p).then(exifdata => {
                          if (exifdata.CreateDate) {
                            const coords = getCoordsForTime(exifdata.CreateDate)
                            setDebugString(JSON.stringify(coords))
                          }
                      })
                    }}>MATCH COORDS</button>
                </div>
            )}
            { Boolean(property) && (
                <div>
                    <ImageUploader
                        key={batchCount}
                        withIcon={true}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".jpeg"]}
                        maxFileSize={5242880}
                    />
                    <button type="button" onClick={submit} disabled={pictures.length === 0} className='btn btn-primary'>Submit</button>
                </div>
            )}
            { loading &&  (
                <div>
                    <Spinner animation="border" role="status" style={{width: '40px', height: '40px', margin: '40px'}}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )}
            <button onClick={() => console.log(pictures)}>HI THERE</button>
            <button onClick={() => testOnChange()}>ADD SHTUFF</button>
            <button onClick={() => loadTestData()}>SET DATA</button>
            <button onClick={() => {
                console.log(position)
                setDebugString(JSON.stringify(position))
            }}>LOG POSITION STACK</button>
            <div>
                DEBUG HERE
            </div>
            <div>{debugString}</div>
        </div>
    );
}

export default PhotoUpload;
