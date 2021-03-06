import React, { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap'

import { login, getCity } from '../api'
import logo from '../e-icon-large.png';

const CHANGE_THIS_CITY_ID = 1

function LoginModal({ setUser, setAuthHeader, onLogin, setCity }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault()
        const [success, response] = await login(username, password)
        if (!success) {
            const errVal = response.response ? response.response.data : undefined
            if (!errVal) {
                setErr("Something went wrong.")
            } else if (typeof errVal === 'object') {
                setErr(response.response.data.error)
            } else if (typeof errVal === 'string') {
                setErr(response.response.data)
            }
        } else {
            const city = await getCity(response.headers.authorization, CHANGE_THIS_CITY_ID)
            localStorage.setItem('authToken', response.headers.authorization)
            localStorage.setItem('userId', response.data.id)
            setCity(city)
            setUser(response.data)
            setAuthHeader(response.headers.authorization)
            onLogin(true, response.headers.authorization)
        }
    }

    return (
        <div className="row justify-content-center">
            <div className="col-10 col-sm-7 col-md-6 col-lg-4 col-xl-3">
                <div className="card ev-card-login">
                    <Row>
                        <img className="ev-image-center ev-image-login" src={logo} alt="" />
                    </Row>
                    <Row>
                    <h5 className="ev-title-login px-2">Environmental Services Photo / Geolocation App</h5>
                    </Row>
                    <div className="card-body">
                        <Form className="ev-form-login" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label className="ev-label-form">Login</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} className="ev-input" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="ev-label-form" >Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            </Form.Group>
                            { err }
                            <Button className="ev-button ev-button-login btn" variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
