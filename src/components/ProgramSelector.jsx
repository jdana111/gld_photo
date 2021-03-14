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

    console.log(city)

    return (
        <div>
            { city && <img src={city.attributes.logoMain} alt="City logo"/> }
            <h3>
                Select Program
            </h3>
            <ListGroup>
                {programs.map((p, i) => (
                    <ListGroup.Item key={p.id} onClick={() => setProgram(p)}>{p.attributes.programName}</ListGroup.Item>
                ))}
            </ListGroup>
        </div >
    );
}

export default ProgramSelector;
