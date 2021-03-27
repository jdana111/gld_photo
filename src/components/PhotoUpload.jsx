import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import exifr from 'exifr'
import FormData from 'form-data'

import PhotoPreview from './PhotoPreview'
import { submitPhoto } from '../api'
import { usePosition } from '../utils'

function PhotoUpload({ property, authHeader }) {

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
                        data.append('latitude', exifData.GPSLatitude)
                        data.append('longitude', exifData.GPSLongitude)
                    } else if (exifData.CreateDate) {
                        // set phone gps here
                        const coords = getCoordsForTime(exifData.CreateDate)
                        console.log(coords)
                        data.append('latitude', undefined)
                        data.append('longitude', undefined)
                    }
                    data.append('property_id', property.id)
            
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
                setDebugString(err)
                console.log("ERROR WITH GPS PARSE OR UPLOAD", err)
            })
    }

    if (!property || property === 'null') {
        return <div></div>
    }

    return (
        <div className="PhotoUpload">
            {property && <h4>{property.attributes.propertyName}</h4>}
            {(pictures && pictures.length > 0) && pictures.map((p, i) =>
                <div key={i}> 
                    <PhotoPreview
                        picture={p}
                        index={i}
                        key={i}
                        authHeader={authHeader}
                        property={property}
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
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
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
