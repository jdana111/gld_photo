import React, { useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

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
    const [user, setUser] = useState(null)
    const [city, setCity] = useState(null)
    const [property, setProperty] = useState(null)
    const [program, setProgram] = useState(null)

    const history = useHistory()

    const position = usePosition()

    const grabStuff = () => {
        console.log('GRAB')
        console.log(user)
        if (!authHeader) {
            return
        }
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
            </Switch>
            <div onClick={grabStuff}/>
        </div>
    );
}

export default App;
