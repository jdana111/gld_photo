import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { useHistory } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import exifr from 'exifr'
import FormData from 'form-data'

import PhotoPreview from '../components/PhotoPreview'
import { Navbar } from '../components/Navbar'
import { submitPhoto } from '../api'
import { usePosition } from '../utils'

function PhotoUpload({ property, authHeader, user, program, city, onLogout }) {

    const [pictures, setPictures] = useState([]);
    const [batchCount, setBatchCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState({});
    const [debugString, setDebugString] = useState('');

    // eslint-disable-next-line
    const { getCoordsForTime, getMostRecentPosition, position } = usePosition()

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }

        const element = document.querySelector('.chooseFileButton')
        if (element) {
            element.style.borderRadius = '0';
            element.style.color = '#6c757d';
            element.style.backgroundColor = 'transparent';
            element.style.borderColor = '#6c757d';
            element.style.borderWidth = '1px';
            element.style.borderStyle = 'solid';
            element.style.fontFamily = 'Arial';
            element.style.fontSize = '16px';
        }
    }, [authHeader, history])


    const onDrop = (newPictures, dataUrls) => {
        console.log(newPictures)
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
                    data.append('caption', captions[pic.name] || '')
                    if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
                        const latitude = exifData.GPSLatitude[0] + (exifData.GPSLatitude[1] / 60) + (exifData.GPSLatitude[2] / 3600)
                        const longitude = exifData.GPSLongitude[0] + (exifData.GPSLongitude[1] / 60) + (exifData.GPSLongitude[2] / 3600)
                        data.append('latitude', latitude)
                        data.append('longitude', longitude)
                    } else if (exifData && (exifData.CreateDate || exifData.DateTimeOriginal || exifData.ModifyDate) && getCoordsForTime(exifData.CreateDate || exifData.DateTimeOriginal || exifData.ModifyDate)) {
                        const d = exifData.CreateDate || exifData.DateTimeOriginal || exifData.ModifyDate
                        const coords = getCoordsForTime(d)
                        console.log(`Exif date: ${d} Assigning coords:${JSON.stringify(coords)}\nCreateDate: ${exifData.CreateDate}\nDateTimeOriginal: ${exifData.DateTimeOriginal}\nModifyDate: ${exifData.ModifyDate}`)
                        setDebugString(`Exif date: ${d} Assigning coords:${JSON.stringify(coords)}\nCreateDate: ${exifData.CreateDate}\nDateTimeOriginal: ${exifData.DateTimeOriginal}\nModifyDate: ${exifData.ModifyDate}`)
                        data.append('latitude', coords.latitude)
                        data.append('longitude', coords.longitude)
                    } else if (pic.lastModified) {
                        const d = new Date(pic.lastModified)
                        const coords = getCoordsForTime(d)
                        setDebugString(`File date: ${d} Assigning coords:${JSON.stringify(coords)}`)
                        data.append('latitude', coords.latitude)
                        data.append('longitude', coords.longitude)
                    } else if (getMostRecentPosition()) {
                        const coords = getMostRecentPosition()
                        setDebugString(`Assigning coords:${JSON.stringify(coords)}\n exifdata ${JSON.stringify(exifData)}`)
                        data.append('latitude', coords.latitude)
                        data.append('longitude', coords.longitude)
                    } else {
                        setDebugString(`Could not find coordinates for photo: ${pic.name} \n exifdata ${JSON.stringify(exifData)}`)
                        data.append('latitude', undefined)
                        data.append('longitude', undefined)
                    }
                    data.append('property_id', property.id)
                    data.append('user_id', user.id)

                    // console.log(data)
                    // setDebugString(JSON.stringify(data.values()))

                    const p = submitPhoto(data, authHeader)
                    promises.push(p)
                })
                return Promise.all(promises)
            })
            .then(results => {
                setCaptions({})
                setLoading(false)
                setPictures([])
                setBatchCount(old => old + 1)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
                setDebugString("ERROR: "+JSON.stringify(err))
            })
    }

    if (!property || property === 'null') {
        return <div></div>
    }

    return (
        <div className="ev-base-container">
            <Navbar program={program} onLogout={onLogout}/>
            <div className="container ev-page-container">
            {property && <h3 className="pt-2 ev-title">{property.attributes.propertyName}</h3>}
                {(pictures && pictures.length > 0) && pictures.map((p, i) =>
                    <PhotoPreview
                        picture={p}
                        index={`${p.name}${i}`}
                        key={`${p.name}${i}`}
                        authHeader={authHeader}
                        property={property}
                        caption={captions[p.name] || ''}
                        setCaption={(newCaption) => {
                            setCaptions(old => ({
                                ...old,
                                [`${p.name}${i}`]: newCaption
                            }))
                        }}
                        onMatch={() => {
                            setCaptions(old => {
                                const val = old[p.name]
                                const newCaptions = {}
                                pictures.forEach((p) => {
                                    newCaptions[`${p.name}${i}`] = val
                                })
                                return newCaptions
                            })
                        }} />
                )}
                { loading && (
                    <div className="ev-loader">
                        <Spinner animation="border" role="status" style={{ width: '40px', height: '40px', margin: '40px' }}>
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                )}
                { Boolean(property) && (
                    <div>
                        <ImageUploader
                            key={batchCount}
                            withIcon={true} 
                            onChange={onDrop}
                            imgExtension={[".jpg", ".jpeg"]}
                            maxFileSize={5242880 * 3}
                            label="Max file size: 15mb, accepted: jpg"
                            buttonClassName="btn ev-button"
                        />
                        <Button type="button" onClick={submit} disabled={pictures.length === 0} className="ev-button btn mt-3">Submit</Button>
                    </div>
                )}
                {/* <button onClick={() => console.log(pictures)}>HI THERE</button>
                <button onClick={() => testOnChange()}>ADD SHTUFF</button>
                <button onClick={() => loadTestData()}>SET DATA</button>
                <div>
                DEBUG HERE
            </div> */}
                {/* <button onClick={() => {
                    console.log(position)
                    setDebugString(JSON.stringify(position))
                }}>LOG POSITION STACK</button>
                <button onClick={() => {
                    console.log(getMostRecentPosition())
                    setDebugString(position.length + " " + position.lastIndex + " " + getMostRecentPosition())
                }}>LOG most recent</button> */}
                <div>{debugString}</div>
            </div>
        </div>
    );
}

export default PhotoUpload;
