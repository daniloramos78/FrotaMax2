import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = 'text-gray-800' }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );
};

export default StatCard;