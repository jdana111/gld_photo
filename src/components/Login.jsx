import React, { useState } from 'react';
import { Form, Button, Container, Row } from 'react-bootstrap'

import { login, getCity } from '../api'
import logo from '../e-icon-large.png';

const CHANGE_THIS_CITY_ID = 1

function LoginModal({ setUser, setAuthHeader, onLogin, setCity }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await login(username, password)
            const city = await getCity(response.headers.authorization, CHANGE_THIS_CITY_ID)
            localStorage.setItem('authToken', response.headers.authorization)
            setCity(city)
            setUser(response.data)
            setAuthHeader(response.headers.authorization)
            onLogin(true)
        } catch (error) {
            onLogin(false)
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
                        <h5 className="ev-title-login">Environmental Services Login</h5>
                    </Row>
                    <div class="card-body">
                        <Form className="ev-form-login" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label className="ev-label-form">Login</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} className="ev-input" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="ev-label-form" >Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            </Form.Group>
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
