import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap'

import { login } from '../api'

function LoginModal({ modalOpen, onClose, setUser, setAuthHeader }) {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault()
        const response = await login(username, password)
        setUser(response.data)
        console.log(response.headers)
        setAuthHeader(response.headers.authorization)
    }

    return (
        <Modal show={ modalOpen } onHide={ onClose }>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body>
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
            </Modal.Body>

            {/* <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer> */}
        </Modal>
    );
}

export default LoginModal;
