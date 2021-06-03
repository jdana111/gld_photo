import { useState, useEffect } from 'react';

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
      const final = position.slice(-1)
      return final
    } else {
      return null
    }
  }

  const getCoordsForTime = (dt) => {
    let bestDelta = 10000000000
    let bestDeltaCoords = null
    position.forEach(pos => {
      if (Math.abs(dt - pos.time) < bestDelta) {
        bestDelta = Math.abs(dt - pos.time)
        bestDeltaCoords = pos
      }
    })
    return bestDeltaCoords
  }

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);

  return { position, error, testOnChange, loadTestData, getCoordsForTime, getMostRecentPosition };
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
