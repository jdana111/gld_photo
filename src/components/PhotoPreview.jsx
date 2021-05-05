import React, { useState, useEffect } from 'react';
import exifr from 'exifr'
import { FaClone } from 'react-icons/fa'

const PhotoPreview = ({ picture, index, phoneGps, caption, setCaption, onMatch }) => {

    const [coords, setCoords] = useState([])
    // const [caption, setCaption] = useState("")

    useEffect(() => {
        const imageUrl = window.URL.createObjectURL(picture);
        const img = document.getElementById(picture.name)
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
 
    return (
        <div key={index}>
            <img src={ "" } alt="" className="ev-photo-preview pb-3 pt-1" id={picture.name}></img>
            <div> { picture.name } </div>
            <div>latitude: {coords[0]}, longitude: {coords[1]}</div>
            <div className="container pt-3" style={{display: 'flex'}}>
                <div className="input-group">
            <input type='text' className="form-control ev-input" onChange={ e => setCaption(e.target.value) } value={caption}/>
            <div className="ev-icons ev-clickable" onClick={ onMatch }>
            <FaClone/>
            </div>
            {/* <button type="button" onClick={ onMatch } className="btn ev-button">Duplicate Caption</button> */}
            </div>
            </div>
        </div>
    )
}

export default PhotoPreview