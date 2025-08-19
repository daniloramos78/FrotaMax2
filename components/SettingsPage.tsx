
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import Modal from './Modal';
import UserForm from './UserForm';
import UserList from './UserList';

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;


const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
  <button
    type="button"
    className={`${
      enabled ? 'bg-blue-600' : 'bg-gray-200'
    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500`}
    onClick={() => onChange(!enabled)}
  >
    <span
      className={`${
        enabled ? 'translate-x-6' : 'translate-x-1'
      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
    />
  </button>
);

interface SettingsPageProps {
    users: User[];
    onAddUser: (user: User) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
}


const SettingsPage: React.FC<SettingsPageProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
    const [companyProfile, setCompanyProfile] = useState({
        name: 'Minha Frota',
        email: 'contato@minhafrota.com',
        address: 'Rua da Tecnologia, 123, São Paulo, SP',
        phone: '(11) 5555-1234',
    });

    const [alertsConfig, setAlertsConfig] = useState({
        cnhExpirationDays: 30,
        maintenanceKm: 10000,
    });
    
    const [gpsConfig, setGpsConfig] = useState({
        enabled: true,
        autoActivate: true,
    });

    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);


    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyProfile(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAlertsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAlertsConfig(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleAddUserClick = () => {
        setEditingUser(null);
        setIsUserFormOpen(true);
    };

    const handleEditUserClick = (user: User) => {
        setEditingUser(user);
        setIsUserFormOpen(true);
    };

    const handleSaveUser = (user: User) => {
        if (editingUser) {
            onUpdateUser(user);
        } else {
            onAddUser(user);
        }
        setIsUserFormOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUserConfirm = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };


    return (
        <>
        <Modal isOpen={isUserFormOpen} onClose={() => setIsUserFormOpen(false)} title={editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}>
            <UserForm 
                onSave={handleSaveUser}
                onCancel={() => setIsUserFormOpen(false)}
                initialData={editingUser}
            />
        </Modal>

        <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Confirmar Exclusão">
            <div className="text-white">
                <p>Você tem certeza que deseja excluir o usuário <span className="font-bold">{userToDelete?.email}</span>?</p>
                <p className="text-sm text-slate-400 mt-2">Esta ação não poderá ser desfeita.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setUserToDelete(null)} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleDeleteUserConfirm} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">
                        Excluir
                    </button>
                </div>
            </div>
        </Modal>


        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
                <p className="text-gray-500 mt-1">Gerencie as configurações gerais e personalização do sistema.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna da Esquerda */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Perfil da Empresa */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Perfil da Empresa</h2>
                         <p className="text-gray-500 text-sm mb-6">Informações que serão utilizadas em relatórios e comunicações.</p>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                             <div className="flex-shrink-0">
                                <div className="h-32 w-32 bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                                    <UploadIcon />
                                    <span className="text-xs text-gray-500 mt-1 text-center">Alterar Logo</span>
                                    <span className="text-xs text-gray-400">PNG, JPG, GIF</span>
                                </div>
                            </div>
                            <div className="flex-grow w-full space-y-4">
                                <input name="name" value={companyProfile.name} onChange={handleProfileChange} placeholder="Nome da Empresa" className="w-full bg-gray-50 border border-gray-300 p-2 rounded-md" />
                                <input name="email" value={companyProfile.email} onChange={handleProfileChange} placeholder="Email de Contato" className="w-full bg-gray-50 border border-gray-300 p-2 rounded-md" />
                                <input name="address" value={companyProfile.address} onChange={handleProfileChange} placeholder="Endereço" className="w-full bg-gray-50 border border-gray-300 p-2 rounded-md" />
                                <input name="phone" value={companyProfile.phone} onChange={handleProfileChange} placeholder="Telefone de Contato" className="w-full bg-gray-50 border border-gray-300 p-2 rounded-md" />
                            </div>
                        </div>
                        <div className="text-right mt-6">
                            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Salvar Alterações</button>
                        </div>
                    </div>
                </div>

                {/* Coluna da Direita */}
                <div className="space-y-8">
                    {/* Configuração de Alertas */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuração de Alertas</h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm text-gray-700 mb-1">Alerta de Vencimento de CNH</label>
                                <input type="number" name="cnhExpirationDays" value={alertsConfig.cnhExpirationDays} onChange={handleAlertsChange} className="w-full bg-gray-50 border border-gray-300 p-2 rounded-md" />
                                <p className="text-xs text-gray-500 mt-1">Notificar quando um motorista estiver perto de vencer.</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Alerta de Manutenção por KM</label>
                                <input type="number" name="maintenanceKm" value={alertsConfig.maintenanceKm} onChange={handleAlertsChange} className="w-full bg-gray-50 border border-gray-300 p-2 rounded-md" />
                                <p className="text-xs text-gray-500 mt-1">Notificar quando um veículo se aproximar da próxima manutenção.</p>
                            </div>
                        </div>
                         <div className="text-right mt-6">
                            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm">Salvar</button>
                        </div>
                    </div>

                    {/* Configuração de GPS */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                         <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuração GPS</h3>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm text-gray-700">Rastreamento GPS</label>
                                <Toggle enabled={gpsConfig.enabled} onChange={(val) => setGpsConfig(p => ({...p, enabled: val}))}/>
                            </div>
                            <p className="text-xs text-gray-500">O rastreamento GPS será ativado automaticamente quando um motorista retirar um veículo.</p>
                             <div className="flex justify-between items-center">
                                <label className="text-sm text-gray-700">Rastreamento GPS Automático</label>
                                <Toggle enabled={gpsConfig.autoActivate} onChange={(val) => setGpsConfig(p => ({...p, autoActivate: val}))} />
                            </div>
                             <p className="text-xs text-gray-500">Ativar rastreamento GPS no início das viagens dos veículos.</p>
                         </div>
                    </div>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Faturamento */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Faturamento</h2>
                     <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                        <p className="text-gray-600">Plano Atual: <span className="font-bold text-green-600">PRO</span></p>
                        <p className="text-sm text-gray-500 mt-1">Próxima fatura em: 14/09/2025</p>
                        <button className="mt-4 w-full px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors">Gerenciar Assinatura</button>
                    </div>
                </div>
                {/* Permissões */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Permissões de Usuário</h2>
                        <button onClick={handleAddUserClick} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center gap-1">
                            <PlusIcon /> Adicionar
                        </button>
                    </div>
                     <UserList 
                        users={users}
                        onEdit={handleEditUserClick}
                        onDelete={setUserToDelete}
                    />
                </div>
             </div>
             <div className="text-center text-sm text-gray-500 pt-4">
                FrotaMax v1.0.0
             </div>
        </div>
        </>
    );
};

export default SettingsPage;
