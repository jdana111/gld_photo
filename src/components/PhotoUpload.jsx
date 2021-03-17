import React, { useState, useEffect } from 'react';
import ImageUploader from "react-images-upload";
import { useHistory } from 'react-router-dom';
import exifr from 'exifr'
import FormData from 'form-data'

import PhotoPreview from './PhotoPreview'
import { submitPhoto } from '../api'

function PhotoUpload({ property, authHeader }) {

    const [pictures, setPictures] = useState([]);
    const [captions, setCaptions] = useState({})

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }
        // eslint-disable-next-line
    }, [])


    const onDrop = (newPictures, dataUrls) => {
        setPictures(newPictures);
        console.log(dataUrls)
    };

    const submit = () => {
        if (!property) {
            alert("No property selected")
            return
        }

        pictures.forEach((pic, index) => {
            console.log('pre parse', pic)
            exifr.gps(pic).then(exifdata => {
               
                let data = new FormData();
                data.append('file', pic, pic.name);
                data.append('caption', captions[index] || '')
                data.append('latitude', exifdata.latitude)
                data.append('longitude', exifdata.longitude)
                data.append('property_id', property.id)

                submitPhoto(data, authHeader)
            }).catch((err) => {
                console.log("ERROR WITH GPS PARSE", err)
            })
        })
    }

    return (
        <div className="PhotoUpload">
            {property && <h4>{property.attributes.propertyName}</h4>}
            {(pictures && pictures.length > 0) && pictures.map((p, i) =>
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
            )}
            { Boolean(property) && (
                <div>
                    <ImageUploader
                        withIcon={true}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".jpeg"]}
                        maxFileSize={5242880}
                    />
                    <button type="button" onClick={submit} className="btn btn-primary">Submit</button>
                </div>
            )}
            <div onClick={() => console.log(pictures)}>HI THERE</div>
        </div>
    );
}

export default PhotoUpload;
