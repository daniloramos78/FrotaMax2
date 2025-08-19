import React, { useState, useMemo } from 'react';
import { Driver, DriverRole } from '../types';
import DriverList from './DriverList';
import Modal from './Modal';
import DriverForm from './DriverForm';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

interface DriversPageProps {
  drivers: Driver[];
  onAddDriver: (driver: Driver) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: string) => void;
}

const DriversPage: React.FC<DriversPageProps> = ({ drivers, onAddDriver, onUpdateDriver, onDeleteDriver }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<DriverRole | 'all'>('all');

    const handleSaveDriver = (driver: Driver) => {
        if (editingDriver) {
            onUpdateDriver(driver);
        } else {
            onAddDriver(driver);
        }
        setIsFormOpen(false);
        setEditingDriver(null);
    };
    
    const handleAddClick = () => {
        setEditingDriver(null);
        setIsFormOpen(true);
    };
    
    const handleEditClick = (driver: Driver) => {
        setEditingDriver(driver);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (driver: Driver) => {
        setDriverToDelete(driver);
    };

    const handleDeleteConfirm = () => {
        if (driverToDelete) {
            onDeleteDriver(driverToDelete.id);
            setDriverToDelete(null);
        }
    };

    const filteredDrivers = useMemo(() => {
        return drivers
            .filter(driver => 
                roleFilter === 'all' || driver.role === roleFilter
            )
            .filter(driver => {
                const search = searchTerm.toLowerCase();
                return (
                    driver.name.toLowerCase().includes(search) ||
                    driver.email.toLowerCase().includes(search)
                );
            });
    }, [drivers, searchTerm, roleFilter]);

    return (
        <>
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingDriver ? "Editar Motorista" : "Cadastrar Novo Motorista"}>
                <DriverForm 
                    onSave={handleSaveDriver}
                    onCancel={() => setIsFormOpen(false)}
                    initialData={editingDriver}
                />
            </Modal>

            <Modal isOpen={!!driverToDelete} onClose={() => setDriverToDelete(null)} title="Confirmar Exclusão">
                <div className="text-white">
                    <p>Você tem certeza que deseja excluir o motorista <span className="font-bold">{driverToDelete?.name}</span>?</p>
                    <p className="text-sm text-slate-400 mt-2">Esta ação não poderá ser desfeita.</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setDriverToDelete(null)} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleDeleteConfirm} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">
                            Excluir
                        </button>
                    </div>
                </div>
            </Modal>
        
            <div className="space-y-6">
                <header className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Motoristas</h1>
                        <p className="text-gray-500 mt-1">Busque, filtre e gerencie motoristas, tratoristas e operadores.</p>
                    </div>
                    <button 
                        onClick={handleAddClick}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                        <PlusIcon />
                        Cadastrar Motorista
                    </button>
                </header>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center mb-4">
                        <div className="relative flex-grow w-full sm:w-auto sm:max-w-xs">
                            <input
                                type="text"
                                placeholder="Procurar por nome, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                        </div>
                        <div className="flex-grow w-full sm:w-auto sm:flex-grow-0">
                             <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as DriverRole | 'all')}
                                className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full"
                             >
                                <option value="all">Todas as Categorias</option>
                                {Object.values(DriverRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DriverList 
                        drivers={filteredDrivers} 
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>
        </>
    );
};

export default DriversPage;