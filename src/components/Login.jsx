import React, { useState } from 'react';
import { Form, Button, Container, Row } from 'react-bootstrap'

import { login, getCity } from '../api'
import logo from '../blank.jpeg';

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
        <Container>
            <Row className="justify-content-md-center">
                <img src={logo} width={100} height={150} alt=""/>
            </Row>
            <Row className="justify-content-md-center">
                <h3 >Login</h3>
            </Row>
            <Row className="justify-content-md-center">
                <Form onSubmit={ handleSubmit }>
                    <Form.Group>
                        <Form.Label>Login</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" value={username} onChange={ e => setUsername(e.target.value) } />
                        {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text> */}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"  value={password} onChange={ e => setPassword(e.target.value) }/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Row>
        </Container>
    );
}

export default LoginModal;
