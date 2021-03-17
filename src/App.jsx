import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import Login from './components/Login'
import ProgramSelector from './components/ProgramSelector'
import PropertySelector from './components/PropertySelector'
import PhotoUpload from './components/PhotoUpload'

import { getCity } from './api'
import { usePosition } from './utils';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const [authHeader, setAuthHeader] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)
    const [city, setCity] = useState(null)
    const [property, setProperty] = useState(null)
    const [program, setProgram] = useState(null)

    const history = useHistory()

    const position = usePosition()

    useEffect(() => {
        const init = async () => {
            try {
                const localToken = localStorage.getItem('authToken')
                if (localToken) {
                    setLoading(true)
                    const city = await getCity(localToken, 1)
                    setCity(city)
                    setAuthHeader(localToken)
                    setLoading(false)
                    return
                }
            } catch (error) {
                
            }
        }

        init()
    }, [])

    const grabStuff = () => {
        if (!authHeader) {
            return
        }
        console.log(user)
        console.log(position)
        getCity({ 'Authorization': authHeader })
    }

    const onLogin = (success) => {
        if (success) {
            history.push('/program')
        } else {
            console.warn("CANT LOGIN")
        }
    }

    const onSelectProgram = (program) => {
        setProgram(program)
        history.push('/property')
    }

    const onSelectProperty = (property) => {
        setProperty(property)
        history.push('/upload')
    }

    if (loading) {
        return <p>loading</p>
    }
    return (
        <div className="App">
            <Switch>
                <Route path="/login" component={Login}>
                    <Login setUser={setUser} setAuthHeader={setAuthHeader} onLogin={onLogin} setCity={setCity}/>
                </Route>
                <Route path="/program">
                    <ProgramSelector authHeader={authHeader} setProgram={onSelectProgram} city={city}/>
                </Route>
                <Route path="/property" >
                    <PropertySelector authHeader={authHeader} setProperty={onSelectProperty} program={program}/>
                </Route>
                <Route path="/upload" >
                    <PhotoUpload authHeader={authHeader} property={property}/>
                </Route>
                <Redirect to="/login"/>
            </Switch>
            <div onClick={grabStuff}/>
        </div>
    );
}

export default App;
