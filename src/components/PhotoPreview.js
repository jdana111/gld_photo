import React, { useRef, useEffect } from 'react';

import exifr from 'exifr'

const PhotoPreview = ({ picture, index }) => {

    const imageUrl = useRef()

    useEffect(() => {
        imageUrl.current = window.URL.createObjectURL(picture);
        const img = document.getElementById(picture.name)
        img.src = imageUrl.current

        return () => {
            URL.revokeObjectURL(imageUrl.current)
        }
    }, [picture.name])

    console.log('start scan')
    exifr.parse(picture).then(r => {
      console.log(r)
    })

    return (
        <p key={index}>
            { picture.name }
            <input type='text' className="form-control"/>
            <img src={ "" } className="photo-preview" id={picture.name}></img>
        </p>
    )
}

export default PhotoPreview