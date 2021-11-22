import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios'



const axiosOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    },
    baseURL: process.env.REACT_APP_API_URL,
}

const middlewareOptions = {
    preservedKeys: ['filter[search][searchString]', 'filter[search][activeOnly]']
}

const getClient = () => applyCaseMiddleware(axios.create(axiosOptions), middlewareOptions)

export const login = (loginName, password) => {
    const data = {
        user: {
            loginName,
            password
        }
    }
    return new Promise(function(resolve, reject) {
        getClient().post('/api/login/', data)
            .then(response => {
                resolve([true, response])
            })
            .catch(error => {
                console.warn(error)
                resolve([false, error])
            })
    })
}

export const getPrograms = (authHeader) => {
    return new Promise(function(resolve, reject) {
        getClient().get('/api/programs/', { headers: { 'Authorization': authHeader } })
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}

export const getCity = (authHeader, cityId) => {
    return new Promise(function(resolve, reject) {
        getClient().get(`/api/cities/${cityId}/`, { headers: { 'Authorization': authHeader } })
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}

export const getUser = (authHeader, userId) => {
    return new Promise(function(resolve, reject) {
        getClient().get(`/api/users/${userId}/`, { headers: { 'Authorization': authHeader } })
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}

export const getProperties = (authHeader, searchString, programId, activeOnly) => {
    const config = {
        params: {
            'filter[search][searchString]': searchString,
            'filter[search][activeOnly]': activeOnly,
            'filter[search][programId]': programId
        },
        headers: {
            'Authorization': authHeader
        }
    }
    return new Promise(function(resolve, reject) {
        getClient().get('/api/properties/', config)
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}

export const getPropertyAssets = (authHeader, propertyId) => {
    const config = {
        headers: {
            'Authorization': authHeader
        }
    }
    return new Promise(function(resolve, reject) {
        getClient().get(`/api/properties/${propertyId}/assets/`, config)
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}


export const submitPhoto = (data, authHeader) => {
    const config = {
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'Authorization': authHeader
        }
    }
    return new Promise(function(resolve, reject) {
        getClient().post('/api/photos/', data, config)
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}