import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditBusiness = () => {
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

    const jwt = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (jwt) {
            try {
                const response = await axios.put(
                    `http://localhost:8000/api/business/updatebusiness/${id}`,
                    businessData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                if (response.status === 200) {
                    Swal.fire("Business updated successfully", "", "success");
                    navigate('/mybusiness');
                }
            } catch (error) {
                if (error.response) {
                    Swal.fire(
                        "Error updating business",
                        error.response.data.message || "An error occurred",
                        "error"
                    );
                }
            }
        } else {
            Swal.fire("Need to Login", "", "error")
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit business details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Enter the details for the business
                </p>
            </div>
            <div className="border-t border-gray-200">
                <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="businessName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Business Name
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                id="businessName"
                                value={businessData.businessName}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                value={businessData.category}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            />
                        </div>
                        <div className="col-span-6">
                            <label
                                htmlFor="streetAddress"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Street Address
                            </label>
                            <textarea
                                name="streetAddress"
                                id="streetAddress"
                                rows={3}
                                value={businessData.streetAddress}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            ></textarea>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-700"
                            >
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={businessData.city}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="state"
                                className="block text-sm font-medium text-gray-700"
                            >
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                id="state"
                                value={businessData.state}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="zipCode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Pin Code
                            </label>
                            <input
                                type="number"
                                name="zipCode"
                                id="zipCode"
                                value={businessData.zipCode}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="zipCode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Rating
                            </label>
                            <input
                                type="number"
                                name="rating"
                                id="rating"
                                value={businessData.rating}
                                onChange={handleInputChange}
                                className="px-2 py-1 mt-1 focus:ring-[#DF6951] focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Edit Business
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBusiness;
