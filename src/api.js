import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios'



const axiosOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    },
    baseURL: process.env.REACT_APP_API_URL,
}

const middlewareOptions = {
    preservedKeys: ['filter[search][searchString]']
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
                resolve(response)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
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

export const getProperties = (authHeader, searchString, programId) => {
    const config = {
        params: {
            'filter[search][searchString]': searchString,
            'filter[search][activeOnly]': true,
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


export const getCity = (headers) => {
    axios.get('/api/cities/1/', {headers}).then(response => {
        console.log(response)
    })
}

export const submitPhoto = (data) => {
    const config = {
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
    }
    return new Promise(function(resolve, reject) {
        getClient().post('/api/CHANGETHISURLPLEASE/', data, config)
            .then(response => {
                resolve(response.data.data)
            })
            .catch(error => {
                console.warn(error)
                reject(error)
            })
    })
}