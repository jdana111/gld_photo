import { useState, useEffect } from 'react';
import exifr from 'exifr'

export const usePosition = () => {
    const [position, setPosition] = useState([]);
    const [error, setError] = useState(null);

    const onChange = ({ coords, time }) => {
        setPosition(old => [...old, {
            latitude: coords.latitude,
            longitude: coords.longitude,
            time: time || new Date()
        }]);
    };

    const loadTestData = () => {
        const data = []
        const numDays = 7
        const nowDate = (new Date()).getDate()
        let day = nowDate - numDays
        let hours = 0
        let latitude, longitude, dt
        while (true) {
            latitude = hours
            longitude = day
            dt = new Date()
            dt.setDate(day)
            dt.setHours(hours)
            data.push({
                coords: {
                    latitude, longitude
                },
                time: dt
            })
            if (day === nowDate) {
                break
            } if (hours < 23) {
                hours += 1
            } else {
                hours = 0
                day += 1
            }
        }
        setPosition(data)
    }

    const testOnChange = () => {
        onChange({
            coords: {
                latitude: Math.random() * 80,
                longitude: Math.random() * 170
            }
        })
    }

    const onError = (error) => {
        setError(error.message);
    };

    const getMostRecentPosition = () => {
        if (position.length) {
            const final = position.slice(-1)[0]
            return final
        } else {
            return null
        }
    }

    const getCoordsForTime = (dt) => {
        let bestDelta = 100000000000000000000000000000000000000000000000
        let bestDeltaCoords = null
        position.forEach(pos => {
            console.log(Math.abs(dt - pos.time))
            if (Math.abs(dt - pos.time) < bestDelta) {
                bestDelta = Math.abs(dt - pos.time)
                bestDeltaCoords = pos
            }
        })
        return bestDeltaCoords
    }

    const getCoordsForPic = async (pic) => {
        return exifr.parse(pic)
            .then((exifData) => {
                let coords = null
                if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
                    const latitude = exifData.GPSLatitude[0] + (exifData.GPSLatitude[1] / 60) + (exifData.GPSLatitude[2] / 3600)
                    const longitude = exifData.GPSLongitude[0] + (exifData.GPSLongitude[1] / 60) + (exifData.GPSLongitude[2] / 3600)
                    coords = { latitude, longitude }
                } else if (exifData && (exifData.CreateDate || exifData.DateTimeOriginal || exifData.ModifyDate) && getCoordsForTime(exifData.CreateDate || exifData.DateTimeOriginal || exifData.ModifyDate)) {
                    const d = exifData.CreateDate || exifData.DateTimeOriginal || exifData.ModifyDate
                    coords = getCoordsForTime(d)
                } else if (pic.lastModified && position.length) {
                    const d = new Date(pic.lastModified)
                    coords = getCoordsForTime(d)
                } else if (getMostRecentPosition()) {
                    coords = getMostRecentPosition()
                } else {
                    coords = {
                        latitude: undefined,
                        longitude: undefined
                    }
                }
                return coords
            })
            .catch(err => {
                console.log(err)
                const errStack = {}
                Object.getOwnPropertyNames(err).forEach(function (key) {
                    errStack[key] = err[key];
                });
            })
    }

    useEffect(() => {
        const geo = navigator.geolocation;
        if (!geo) {
            setError('Geolocation is not supported');
            return;
        }
        geo.getCurrentPosition((pos) => {
            setPosition([pos])
        })
        const watcher = geo.watchPosition(onChange, onError);
        return () => geo.clearWatch(watcher);
    }, []);

    return { position, error, testOnChange, loadTestData, getCoordsForTime, getMostRecentPosition, getCoordsForPic };
}

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => {
            setMatches(media.matches);
        };
        media.addListener(listener);
        return () => media.removeListener(listener);
    }, [matches, query]);

    return matches;
}
