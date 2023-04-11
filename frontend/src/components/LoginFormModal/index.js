import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors([data.errors.credential]);
                }
            );
    }
    //     e.preventDefault();
    //     setErrors([]);
    //     const result = await dispatch(sessionActions.login({ credential, password }));
    //     if (result) {
    //         setErrors(result);
    //     } else {
    //         closeModal();
    //     };
    // };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <ul className="login-error">
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        placeholder="Username or Email"
                    />
                </label>
                <label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                </label>
                <button className={`login-button${credential.length < 4 || password.length < 6 ? " login-button-disabled" : ""}`} type="submit" disabled={!credential || !password}>Log In</button>
                <button className="demo-button" type="submit">Demo User</button>
            </form>
        </>
    );
}

export default LoginFormModal;
