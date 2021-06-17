import React, { useState, useEffect } from 'react';
import exifr from 'exifr'
import { FaClone } from 'react-icons/fa'
import { Dropdown, Form } from 'react-bootstrap'
import { useMediaQuery } from '../utils'

const PhotoPreview = ({ picture, index, phoneGps, caption, setCaption, onMatch, setChoice, onMatchAsset, program, assets, assetChoiceId }) => {

    const [coords, setCoords] = useState([])
    const [mailing, setMailing] = useState(true)
    const isBig = useMediaQuery('(min-width: 500px)');

    useEffect(() => {
        const imageUrl = window.URL.createObjectURL(picture);
        const img = document.getElementById(index)
        img.src = imageUrl
        return () => {
            URL.revokeObjectURL(imageUrl)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picture.name])

    useEffect(() => {
        exifr.parse(picture).then(exifdata => {
            if (exifdata && exifdata.GPSLongitude && exifdata.GPSLatitude) {
                const latitude = exifdata.GPSLatitude[0] + (exifdata.GPSLatitude[1] / 60) + (exifdata.GPSLatitude[2] / 3600)
                const longitude = exifdata.GPSLongitude[0] + (exifdata.GPSLongitude[1] / 60) + (exifdata.GPSLongitude[2] / 3600)
                setCoords([latitude.toFixed(3), longitude.toFixed(3)])
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const assetChoice = assets.find(a => a.id === assetChoiceId)
    const assetDisplayText = assetChoice ? assetChoice.attributes.assetTypeName : program.attributes.assetAlias

    return (
        <div className="ev-photo-preview-container">
            <img src={""} alt="" className="ev-photo-preview mb-1 mt-3" id={index}></img>
            <div> {picture.name} </div>
            <div className="ev-latlong" >latitude: {coords[0]}, longitude: {coords[1]}</div>
            <div className="container mt-3" style={{ display: 'flex', 'flexDirection': 'column' }}>
                <div className="input-group">
                    <input type='text' className="form-control ev-input mb-2" placeholder="Details" onChange={e => setCaption(e.target.value)} value={caption} />
                    <div className="ev-icons ev-clickable pl-2" onClick={onMatch}>
                        <FaClone />
                    </div>
                    {/* <button type="button" onClick={ onMatch } className="btn ev-button">Duplicate Caption</button> */}
                </div>
                { !isBig && (
                    <div className="input-group mb-2">
                            <Form.Check type="checkbox" value={mailing} id="checkbox" label="Include in Next Mailing" className="mailingCheck"  onClick={e => setMailing(v => !v)}/>
                    </div>
                )}
                <div className="input-group d-flex">
                    { isBig && (
                        <Form.Check type="checkbox" value={mailing} id="checkbox" label="Include in Next Mailing" className="mailingCheck" onClick={e => setMailing(v => !v)}/>
                    )}
                    <Dropdown className="assetDD" onSelect={(eventKey) => {
                        setChoice(eventKey)
                    }}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            { assetDisplayText }
                        </Dropdown.Toggle>
                        <div className="ev-icons ev-clickable pl-2" onClick={onMatchAsset}>
                            <FaClone />
                        </div>
                        <Dropdown.Menu>
                            { assets.map(a => (
                                <Dropdown.Item key={a.id} eventKey={a.id}>{a.attributes.assetTypeName}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                
            </div>
        </div>
    )
}

export default PhotoPreview