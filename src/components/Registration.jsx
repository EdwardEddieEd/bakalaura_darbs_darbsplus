import { useDispatch } from 'react-redux';
import { Form } from './Form';
import { setUser } from 'store/slices/userSlice';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";

import React from 'react'

const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registrationClick = (email, password, role = 'user') => {
        const auth = getAuth();
        const db = getDatabase();

        createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                set(ref(db, 'users/' + user.uid), {
                    email: user.email,
                    role: role,
                })
                    .then(() => {
                        console.log("User role has been saved");
                        dispatch(setUser({
                            email: user.email,
                            id: user.uid,
                            token: user.accessToken,
                        }));
                        navigate('/login');
                    })
                    .catch(console.error)
            })
            .catch(console.error)
    }

    return (
        <Form
            title='registration'
            click={registrationClick}
        />
    )
}

export { Registration }