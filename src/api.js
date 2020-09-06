import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios'

const axiosOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
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
        getClient().post('http://localhost:3000/api/login/', data)
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
        getClient().get('http://localhost:3000/api/programs/', { headers: { 'Authorization': authHeader } })
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
        getClient().get('http://localhost:3000/api/properties/', config)
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
    axios.get('http://localhost:3000/api/cities/1/', {headers}).then(response => {
        console.log(response)
    })
}