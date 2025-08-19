import React from 'react';
import { User, UserRole } from '../types';

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
    let colorClasses = "";

    switch (role) {
        case UserRole.SuperAdmin:
            colorClasses = "bg-red-100 text-red-800";
            break;
        case UserRole.Admin:
            colorClasses = "bg-purple-100 text-purple-800";
            break;
        case UserRole.Manager:
            colorClasses = "bg-yellow-100 text-yellow-800";
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

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="text-gray-500">
                    <tr>
                        <th className="p-2 font-medium">Usuário</th>
                        <th className="p-2 font-medium">Permissão</th>
                        <th className="p-2 font-medium text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map(user => {
                        const isSuperAdmin = user.role === UserRole.SuperAdmin;
                        return (
                            <tr key={user.id}>
                                <td className="p-2 text-gray-700">{user.email}</td>
                                <td className="p-2"><RoleBadge role={user.role} /></td>
                                <td className="p-2">
                                     <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => onEdit(user)} 
                                            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                                            aria-label={`Editar ${user.email}`}
                                            disabled={isSuperAdmin}
                                            title={isSuperAdmin ? 'Super Admin não pode ser editado' : 'Editar usuário'}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(user)} 
                                            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                                            aria-label={`Excluir ${user.email}`}
                                            disabled={isSuperAdmin}
                                            title={isSuperAdmin ? 'Super Admin não pode ser excluído' : 'Excluir usuário'}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
