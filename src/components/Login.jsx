import { Form } from './Form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUser } from 'store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const loginClick = (email, password) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                console.log(user);
                dispatch(setUser({
                    email: user.email,
                    id: user.uid,
                    token: user.accessToken,
                }));
                navigate('/');
            })
            .catch(() => alert('Incorrect Email or Password!'))
    }

    return (
        <Form
            title="login"
            click={loginClick}
        />
    )
}

export { Login }