import { Form } from './Form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUser } from 'store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from "firebase/database";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginClick = (email, password) => {
        const auth = getAuth();
        const db = getDatabase();

        signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                get(ref(db, 'users/' + user.uid))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            console.log(user);
                            dispatch(setUser({
                                email: user.email,
                                id: user.uid,
                                token: user.accessToken,
                                role: userData.role,
                            }));
                            navigate('/');
                        } else {
                            alert('User role not found');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        alert('Failed to fetch user role');
                    });

            })
            .catch(() => alert('Incorrect Email or Password!'));
    };

    return (
        <Form
            title="login"
            click={loginClick}
        />
    )
}

export { Login }