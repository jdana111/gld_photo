import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import Login from './components/Login'
import ProgramSelector from './components/ProgramSelector'
import PropertySelector from './components/PropertySelector'
import PhotoUpload from './components/PhotoUpload'

import { getCity, getUser } from './api'
import { usePosition } from './utils';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './Styling/Login.scss';
import './Styling/FormElement.scss';
import './Styling/Foundation.scss';
import './Styling/ProgramSelect.scss';
import './Styling/SearchTool.scss';
import './Styling/Banner.scss';

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
                // const program = localStorage.getItem('program')
                // if (program) {
                //     console.log(program)
                //     setProgram(program)
                // }
                // const property = localStorage.getItem('property')
                // if (property) {
                //     console.log(property)
                //     setProperty(property)
                // }
                const localToken = localStorage.getItem('authToken')
                const userId = localStorage.getItem('userId')
                if (localToken && userId) {
                    setLoading(true)
                    const city = await getCity(localToken, 1)
                    const user = await getUser(localToken, userId)
                    setCity(city)
                    setUser(user)
                    setAuthHeader(localToken)
                    setLoading(false)
                    return
                } else {
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
            }
        }

        init()

        return () => {
            localStorage.setItem('program', program)
            localStorage.setItem('property', property)
        }
        // eslint-disable-next-line
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

    const logout = () => {
        setUser(null)
        setCity(null)
        setProgram(null)
        setProperty(null)
        setAuthHeader(null)
        localStorage.setItem('authToken', null)
        history.push('/login')
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
        return <p onClick={() => console.log(loading)}>loading</p>
    } else {
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
                        <PropertySelector authHeader={authHeader} setProperty={onSelectProperty} program={program} city={city} onLogout={logout}/>
                    </Route>
                    <Route path="/upload" >
                        <PhotoUpload authHeader={authHeader} property={property} user={user} program={program} city={city} onLogout={logout}/>
                    </Route>
                    <Redirect to="/login"/>
                </Switch>
                <div onClick={grabStuff}/>
            </div>
        );
    }
}

export default App;
