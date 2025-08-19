import React from 'react';
import { MOCK_ALERTS } from '../constants';
import { Vehicle, VehicleStatus } from '../types';
import StatCard from './StatCard';
import VehicleStatusChart from './VehicleStatusChart';
import AlertsList from './AlertsList';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

interface DashboardProps {
    vehicles: Vehicle[];
}

const Dashboard: React.FC<DashboardProps> = ({ vehicles }) => {
    const totalVehicles = vehicles.length;
    const inUse = vehicles.filter(v => v.status === VehicleStatus.InUse).length;
    const available = vehicles.filter(v => v.status === VehicleStatus.Available).length;
    const maintenance = vehicles.filter(v => v.status === VehicleStatus.Maintenance).length;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Painel</h1>
                    <p className="text-gray-500 mt-1">Bem-vindo de volta, aqui está o status da sua frota.</p>
                </div>
                 <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Procurar..."
                            className="bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-48 md:w-64 shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                    <button className="relative p-3 rounded-full bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 border border-gray-200 shadow-sm">
                        <BellIcon/>
                        {MOCK_ALERTS.length > 0 && (
                             <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Veículos" value={totalVehicles.toString()} />
                <StatCard title="Em Uso" value={inUse.toString()} color="text-orange-500"/>
                <StatCard title="Disponíveis" value={available.toString()} color="text-emerald-500"/>
                <StatCard title="Em Manutenção" value={maintenance.toString()} color="text-red-500"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Status da Frota</h3>
                    <VehicleStatusChart vehicles={vehicles} />
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Alertas Recentes</h3>
                    <AlertsList alerts={MOCK_ALERTS} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;