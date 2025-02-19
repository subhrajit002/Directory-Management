import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useEffect, useState } from "react";
import { CgProfile } from 'react-icons/cg';
import { Link, NavLink, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from 'axios';

const navigation = [
    { name: 'All Business', href: '/', current: false },
    { name: 'My Business', href: '/mybusiness', current: false }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example({ jwt }) {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();


    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleLogout = () => {
        localStorage.removeItem("jwt");
        navigate("/signin");
    };

    useEffect(() => {
        const getUserById = async () => {
            if (!jwt) return;
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                console.log("navbar response", response.data)
                if (response) {
                    setUser(response.data);
                }
            } catch (error) {
                setUser(null);
                console.log("internal navbar server error", error);
            }
        };
        getUserById();
    }, [jwt]);

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                 
                    <div className="flex items-center justify-start">
                        <div className="text-white font-bold text-lg">
                            <NavLink to='/'>
                                Directory Management
                            </NavLink>
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:space-x-4">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'rounded-md px-3 py-2 text-sm font-medium',
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="relative flex items-center w-[7.5rem] h-[3.125rem] gap-4 rounded-full justify-center py-3 hover:scale-105 transition duration-300 ">
                        {user ? (
                            <Avatar
                                onClick={handleAvatarClick}
                                sx={{ cursor: "pointer", backgroundColor: "#6500B0" }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        ) : (
                            <Link to="/signin">
                                <CgProfile size={30} color="white" />
                            </Link>
                        )}

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
