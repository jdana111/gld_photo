import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { useHistory } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import exifr from 'exifr'
import FormData from 'form-data'

import PhotoPreview from '../components/PhotoPreview'
import { Navbar } from '../components/Navbar'
import { submitPhoto, getPropertyAssets } from '../api'
import { usePosition } from '../utils'

function PhotoUpload({ property, authHeader, user, program, city, onLogout }) {

    const [pictures, setPictures] = useState([]);
    const [batchCount, setBatchCount] = useState(0);
    const [loading, setLoading] = useState(false);
    // const [debug, setDebug] = useState(false);
    const [captions, setCaptions] = useState({});
    const [pictureCoords, setCoords] = useState({});
    const [assetChoices, setAssetChoices] = useState({});
    const [mailingChoices, setMailingChoices] = useState({});
    const [debugString, setDebugString] = useState('');
    const [assets, setAssets] = useState([]);

    // eslint-disable-next-line
    const { getCoordsForTime, getMostRecentPosition, position, getCoordsForPic } = usePosition()

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }
        if (!property) {
            return
        }
        getPropertyAssets(authHeader, property.id).then(assets => [
            setAssets(assets)
        ])

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authHeader, history])


    const onDrop = (newPictures, dataUrls) => {
        setPictures(newPictures);
        const newChoices = newPictures.reduce((acc, p, i) => {
            acc[`${p.name}${i}`] = true
            return acc
        }, {})
        Promise.all(newPictures.map(getCoordsForPic))
            .then((coordsArray) => {
                const temp = {...pictureCoords}
                coordsArray.forEach((coords, i) => {
                    const pic = newPictures[i]
                    temp[`${pic.name}${i}`] = coords
                })
                setCoords(temp)
            })
        setMailingChoices(newChoices)
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
                    data.append('caption', captions[`${pic.name}${index}`] || '')
                    data.append('asset', assetChoices[`${pic.name}${index}`] || '')
                    data.append('mailing', mailingChoices[`${pic.name}${index}`] || '')
                    
                    const c = pictureCoords[`${pic.name}${index}`]
                    data.append('latitude', c.latitude)
                    data.append('longitude', c.longitude)
                    
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
                setAssetChoices({})
                setMailingChoices({})
                setLoading(false)
                setPictures([])
                setBatchCount(old => old + 1)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
                const errStack = {}
                Object.getOwnPropertyNames(err).forEach(function (key) {
                    errStack[key] = err[key];
                });


                setDebugString("ERROR: " + JSON.stringify(errStack))
            })
    }

    if (!property || property === 'null') {
        return <div></div>
    }

    return (
        <div className="ev-base-container">
            <Navbar program={program} onLogout={onLogout} />
            <div className="container ev-page-container">
                {property && <h3 className="pt-2 ev-title">{property.attributes.propertyName}</h3>}
                {(pictures && pictures.length > 0) && pictures.map((p, i) =>
                    <PhotoPreview
                        picture={p}
                        index={`${p.name}${i}`}
                        key={`${p.name}${i}`}
                        authHeader={authHeader}
                        property={property}
                        program={program}
                        assets={assets}
                        caption={captions[`${p.name}${i}`] || ''}
                        mailing={mailingChoices[`${p.name}${i}`] || ''}
                        assetChoiceId={assetChoices[`${p.name}${i}`] || ''}
                        picCoords={pictureCoords[`${p.name}${i}`] || ''}
                        setCaption={(newCaption) => {
                            setCaptions(old => ({
                                ...old,
                                [`${p.name}${i}`]: newCaption
                            }))
                        }}
                        setChoice={(choice) => {
                            setAssetChoices(old => ({
                                ...old,
                                [`${p.name}${i}`]: choice
                            }))
                        }}
                        setMailing={(choice) => {
                            setMailingChoices(old => ({
                                ...old,
                                [`${p.name}${i}`]: choice
                            }))
                        }}
                        onMatch={() => {
                            setCaptions(old => {
                                const val = old[`${p.name}${i}`]
                                const newCaptions = {}
                                pictures.forEach((p2, i2) => {
                                    newCaptions[`${p2.name}${i2}`] = val
                                })
                                return newCaptions
                            })
                        }}
                        onMatchAsset={() => {
                            setAssetChoices(old => {
                                const val = old[`${p.name}${i}`]
                                const newChoices = {}
                                pictures.forEach((p2, i2) => {
                                    newChoices[`${p2.name}${i2}`] = val
                                })
                                return newChoices
                            })
                        }} />
                )}
                {loading && (
                    <div className="ev-loader">
                        <Spinner animation="border" role="status" style={{ width: '40px', height: '40px', margin: '40px' }}>
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                )}
                {Boolean(property) && (
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
                {/* {debug && ( */}
                    <>
                        <button onClick={() => {
                            console.log(position)
                            setDebugString(JSON.stringify(position))
                        }}>LOG POSITION STACK</button>
                        <button onClick={() => {
                            console.log(getMostRecentPosition())
                            setDebugString(position.length + " " + position.lastIndex + " " + getMostRecentPosition())
                        }}>LOG most recent</button>
                    </>
                {/* )} */}
                <div>{debugString}</div>
            </div>
        </div>
    );
}

export default PhotoUpload;
