import React from 'react';
import { Driver, DriverRole } from '../types';

interface DriverListProps {
    drivers: Driver[];
    onEdit: (driver: Driver) => void;
    onDelete: (driver: Driver) => void;
}

const RoleBadge: React.FC<{ role: DriverRole }> = ({ role }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
    let colorClasses = "";

    switch (role) {
        case DriverRole.Driver:
            colorClasses = "bg-blue-100 text-blue-800";
            break;
        case DriverRole.TractorOperator:
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
        case DriverRole.MachineOperator:
            colorClasses = "bg-purple-100 text-purple-800";
            break;
    }

    return <span className={`${baseClasses} ${colorClasses}`}>{role}</span>;
};

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const DriverList: React.FC<DriverListProps> = ({ drivers, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left">
                <thead className="border-b border-gray-200 text-sm text-gray-500">
                    <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Categoria Profissional</th>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Telefone</th>
                        <th className="p-3">CNH</th>
                        <th className="p-3">Categoria CNH</th>
                        <th className="p-3">Vencimento CNH</th>
                        <th className="p-3 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {drivers.map(driver => (
                        <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium text-gray-900">{driver.name}</td>
                            <td className="p-3"><RoleBadge role={driver.role} /></td>
                            <td className="p-3 text-gray-600">{driver.email}</td>
                            <td className="p-3 text-gray-600">{driver.phone}</td>
                            <td className="p-3 text-gray-600">{driver.cnhNumber}</td>
                            <td className="p-3 text-gray-600">{driver.cnhCategory}</td>
                            <td className="p-3 text-gray-600">{new Date(driver.cnhExpiration + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                            <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => onEdit(driver)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100" aria-label={`Editar ${driver.name}`}>
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(driver)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100" aria-label={`Excluir ${driver.name}`}>
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DriverList;