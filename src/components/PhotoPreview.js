import React, { useState, useEffect } from 'react';
import FormData from 'form-data'
import exifr from 'exifr'

import { submitPhoto } from '../api'

const PhotoPreview = ({ picture, index, phoneGps, authHeader }) => {

    const [coords, setCoords] = useState([])
    const [caption, setCaption] = useState("")

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
                setCoords([latitude, longitude])
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const submit = () => {
        let data = new FormData();
        data.append('file', picture, picture.name);
        data.append('caption', caption)
        data.append('latitude', coords[0])
        data.append('longitude', coords[1])

        submitPhoto(data, authHeader)
    }
 
    return (
        <div key={index}>
            { picture.name }
            <input type='text' className="form-control" onChange={ e => setCaption(e.target.value) }/>
            <img src={ "" } alt="" className="photo-preview" id={picture.name}></img>
            <div>latitude: {coords[0]}</div>
            <div>longitude: {coords[1]}</div>
            <button type="button" onClick={ submit } className="btn btn-primary">Submit</button>
        </div>
    )
}

export default PhotoPreview