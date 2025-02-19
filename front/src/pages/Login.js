import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";


const Login = () => {
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("email_verification_token");
    }, []);
    const [value, setValues] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [errors] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/login",
                value,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const token = response.data.accessToken;
            if (token) {
                // Check if token exists
                localStorage.setItem("token", token);
                setIsLoggedIn(true);
                navigate("/");
            }
            else {
                Swal.fire("Login failed, no token returned", "", "error");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Swal.fire("All Fields Are Required", "", "info");
            } else if (error.response && error.response.status === 401) {
                Swal.fire("User not found", "", "error");
            } else {
                Swal.fire("invalid credentials", "", "info");
            }
        }
    };

    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                <form
                    onSubmit={handleSubmit}
                    className="xl:ml-20 mx-auto lg:w-[24rem] w-full sm:p-10 p-4 rounded-2xl shadow-lg hover:shadow-xl mt-5 font-Montserrat"
                >
                    <h1 className="text-2xl font-bold text-black my-4 text-center">
                        Sign in to your account
                    </h1>

                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="exampleInputEmail1">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            id="exampleInputEmail1"
                            placeholder="Enter email"
                            onChange={handleInput}
                        />
                        {errors.email && (
                            <span className="text-danger"> {errors.email} </span>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            id="password"
                            placeholder="Enter Password"
                            onChange={handleInput}
                        />
                        {errors.password && (
                            <span className="text-danger">{errors.password}</span>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Sign up
                        </button>
                    </div>

                    <div className="text-sm text-center mt-5">
                        <Link to="/signup" className="font-medium text-gray-600 hover:text-gray-500">
                            Don't have an account? Sign up
                        </Link>
                        <div>
                            <Link to="/" className="font-small pt-2 text-indigo-200 hover:text-indigo-300">
                                HOME PAGE
                            </Link>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Login;
