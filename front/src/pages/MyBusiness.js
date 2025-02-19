import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const BusinessList = () => {
    const jwt = localStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState('');
    const [businesses, setBusinesses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'businessName', direction: 'asc' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const allBusinesses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/business/userbusiness', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                console.log("user business", response.data)

                if (response.data.businesses && Array.isArray(response.data.businesses)) {
                    setBusinesses(response.data.businesses);
                } else {
                    console.log("Businesses array is missing or invalid:", response.data);
                    setBusinesses([]);
                }
            } catch (error) {
                console.log("Error while fetching data:", error);
                setBusinesses([]);
            }
        };

        if (jwt) {
            allBusinesses();
        } else {
            console.log("No JWT found. Please login.");
            setBusinesses([]);
        }
    }, [jwt]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedBusinesses = [...businesses].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredBusinesses = sortedBusinesses.filter(business =>
        business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredBusinesses.slice(indexOfFirstRecord, indexOfLastRecord);

    const [businessData, setBusinessData] = useState({
        businessName: '',
        category: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        website: '',
        rating: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!jwt) {
            Swal.fire("Need to Login", "", "error");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/business/createbusiness`,
                businessData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            window.location.reload();

        } catch (error) {
            console.error("Error adding business:", error);
            Swal.fire("Error adding business", error.response?.data?.message || "Something went wrong", "error");
        }
    };

    const handleDelete = async (businessId) => {
        if (!jwt) {
            Swal.fire("Need to Login", "", "error");
            return;
        }
        console.log("delete id", businessId)

        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await axios.delete(`http://localhost:8000/api/business/deletebusiness`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                data: { businessId }
            });

            if (response.status === 200) {
                Swal.fire("Deleted!", "Your business has been deleted.", "success");
                setBusinesses(businesses.filter(business => business.businessId !== businessId));
            }
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error("Error deleting business:", error);
            Swal.fire("Error", "Could not delete business.", "error");
        }
    };

    return (
        <div className='p-4 bg-gray-100 min-h-screen'>
            <h1 className="text-3xl font-bold mb-6 text-center">Business Listings</h1>
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Search business..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center" onClick={() => setIsModalOpen(true)} >
                    <FaPlus className="mr-2" /> Add New Business
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl relative">
                        <button className="absolute top-2 right-2 text-gray-600" onClick={() => setIsModalOpen(false)}>
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Add New Business</h2>
                        <p className="mb-4">Enter details for the new business.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                    <input type="text" name="businessName" id="businessName" value={businessData.businessName} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" name="category" id="category" value={businessData.category} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <textarea name="streetAddress" id="streetAddress" rows="2" value={businessData.streetAddress} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" id="city" value={businessData.city} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input type="text" name="state" id="state" value={businessData.state} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                    <input type="text" name="zipCode" id="zipCode" value={businessData.zipCode} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="number" name="phoneNumber" id="phoneNumber" value={businessData.phoneNumber} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Website</label>
                                    <input type="text" name="website" id="website" value={businessData.website} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                                    <input type="number" name="rating" id="rating" value={businessData.rating} onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white p-2 rounded-md">Save</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-max bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-4">#</th> {/* Sr. No */}
                            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('businessName')}>
                                Business Name {sortConfig.key === 'businessName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('category')}>
                                Category {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="py-3 px-4">Address</th>
                            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('city')}>
                                City {sortConfig.key === 'city' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('state')}>
                                State {sortConfig.key === 'state' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('zipCode')}>
                                Zip Code {sortConfig.key === 'zipCode' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="py-3 px-4">Phone</th>
                            <th className="py-3 px-4">Website</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((car, index) => (
                                <tr key={car._id} className="border-b">
                                    <td className="py-2 px-4">{indexOfFirstRecord + index + 1}</td>
                                    <td className="py-2 px-4">{car.businessName}</td>
                                    <td className="py-2 px-4">{car.category}</td>
                                    <td className="py-2 px-4">{car.streetAddress}</td>
                                    <td className="py-2 px-4">{car.city}</td>
                                    <td className="py-2 px-4">{car.state}</td>
                                    <td className="py-2 px-4">{car.zipCode}</td>
                                    <td className="py-2 px-4">{car.phoneNumber}</td>
                                    <td className="py-2 px-4">{car.website}</td>
                                    <td className="py-2 px-4">{car.rating}</td>
                                    <td className="py-2 px-4 flex space-x-3">
                                        <Tooltip title="Edit">
                                            <Link to={`/business/edit/${car._id}`} className="text-yellow-500">
                                                <FaEdit />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <button onClick={() => handleDelete(car._id)} className="text-red-600">
                                                <FaTrash />
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4 text-gray-500">Login to check data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-1 bg-gray-300 rounded-md"
                >
                    Previous
                </button>
                <span>Page {currentPage} </span>
                <button
                    disabled={indexOfLastRecord >= filteredBusinesses.length}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1 bg-gray-300 rounded-md"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BusinessList;
