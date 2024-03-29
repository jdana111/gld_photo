import React, { useEffect } from 'react';
import { FaClone } from 'react-icons/fa'
import { Dropdown } from 'react-bootstrap'
import { useMediaQuery } from '../utils'

const PhotoPreview = ({ picture, index, phoneGps, caption, setCaption, onMatch, setChoice, onMatchAsset, program, assets, assetChoiceId, setMailing, mailing, picCoords }) => {

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

    const assetChoice = assets.find(a => a.id === assetChoiceId)
    const assetDisplayText = assetChoice ? assetChoice.attributes.assetTypeName : program.attributes.assetAlias

    const cb = (
        <div onClick={() => setMailing(!mailing)} className="mr-3">
            <input className="form-check-input mailingCheck" type="checkbox" checked={mailing} id={index} readOnly/>
            <label className="form-check-label" htmlFor={index}>
                Include in Next Mailing
            </label>
        </div>
    )

    return (
        <div className="ev-photo-preview-container">
            <img src={""} alt="" className="ev-photo-preview mb-1 mt-3" id={index}></img>
            <div> {picture.name} </div>
            <div className="ev-latlong" >latitude: {picCoords.latitude}, longitude: {picCoords.longitude}</div>
            <div className="container mt-3" style={{ display: 'flex', 'flexDirection': 'column' }}>
                <div className="input-group">
                    <input type='text' className="form-control ev-input mb-2" placeholder="Caption" onChange={e => setCaption(e.target.value)} value={caption} />
                    <div className="ev-icons ev-clickable pl-2" onClick={onMatch}>
                        <FaClone />
                    </div>
                </div>
                { !isBig && cb }
                <div className="input-group d-flex">
                    { isBig && cb }
                    <Dropdown className="assetDD" onSelect={(eventKey) => {
                        setChoice(eventKey)
                    }}>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            { assetDisplayText }
                        </Dropdown.Toggle>
                        <div className="ev-icons ev-clickable pl-2" onClick={onMatchAsset}>
                            <FaClone />
                        </div>
                        <Dropdown.Menu>
                            { assets.map(a => (
                                <Dropdown.Item key={a.id} eventKey={a.id}>{a.attributes.assetTypeName + (a.attributes.location ? " (" + a.attributes.location + ")": "") }</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                
            </div>
        </div>
    )
}

export default PhotoPreview