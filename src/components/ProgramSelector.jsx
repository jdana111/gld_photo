import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap'

import { getPrograms } from '../api'

const ALLOWED_PROGRAM_IDS = [1, 2, 3, 4]

function ProgramSelector({ authHeader, setProgram, city }) {
    const [programs, setPrograms] = useState([]);

    const history = useHistory()

    useEffect(() => {
        if (!authHeader) {
            history.replace('login')
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!authHeader) {
            console.warn('NOT AUTH HEADER')
            return
        }
        getPrograms(authHeader).then(programs => {
            setPrograms(programs.filter(p => ALLOWED_PROGRAM_IDS.includes(parseInt(p.id))))
        })
    }, [authHeader])

    return (
        <div className="body">
            <div className="container mt-5">
                <h5 className="ev-title-login">Environmental Services</h5>
                <h5 className="ev-title-login-line2">Photo App</h5>
            </div>
            {city && <img className="ev-image-center ev-image-program-select" src={city.attributes.logoMain} alt="City logo" />}
            <div className="justify-content-center d-flex">
                <div className="col-9 col-sm-7 col-md-6">
                    <br>
                    </br>
                    <ListGroup className="ev-list-program-select ev-clickable ev-light-table">
                        {programs.map((p, i) => (
                            <ListGroup.Item key={p.id} onClick={() => setProgram(p)}>{p.attributes.programName}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </div >
    );
}

export default ProgramSelector;
