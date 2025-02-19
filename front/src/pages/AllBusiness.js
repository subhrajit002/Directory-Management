import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

const BusinessList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [businesses, setBusinesses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: 'businessName', direction: 'asc' });

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/business/allbusiness');
                setBusinesses(response.data);
            } catch (error) {
                toast.error("Error fetching data");
            }
        };
        fetchBusinesses();
    }, []);

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
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-max bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-4">#</th>
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4 text-gray-500">No data found</td>
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
