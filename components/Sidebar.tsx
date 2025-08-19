import React from 'react';
import { UserRole } from '../types';

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const VehicleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DriverIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FrotaMaxLogo = () => (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <div className="grid grid-rows-3 grid-cols-2 gap-0.5">
          <div className="w-2 h-2 bg-orange-400" />
          <div className="w-2 h-2 bg-orange-400" />
          <div className="w-2 h-2 bg-blue-400" />
          <div className="w-2 h-2 bg-blue-400" />
          <div className="w-2 h-2 bg-blue-400 opacity-75" />
          <div className="w-2 h-2 bg-blue-400 opacity-75" />
        </div>
        <div className="w-0 h-0 
          border-t-[10px] border-t-transparent
          border-b-[10px] border-b-transparent
          border-l-[15px] border-l-teal-400 ml-1">
        </div>
      </div>
      <span className="text-3xl font-bold text-gray-800 tracking-tighter">
        Frota<span className="text-orange-500">Max</span>
      </span>
    </div>
);


interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${active ? 'bg-blue-600 text-white font-semibold shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    <div className={`${active ? 'text-white' : 'text-gray-500'}`}>{icon}</div>
    <span className="ml-4">{label}</span>
  </a>
);

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, userRole }) => {
  const canManage = userRole === UserRole.Admin || userRole === UserRole.SuperAdmin || userRole === UserRole.Manager;

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-6 flex flex-col justify-between hidden md:flex no-print border-r border-gray-200">
      <div>
        <div className="mb-12">
            <FrotaMaxLogo />
            <p className="text-lg text-gray-500 mt-3">Gestão Inteligente</p>
             <button className="mt-5 w-full text-center bg-blue-100 text-blue-700 font-bold py-2.5 px-4 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                FROTAMAX SOLUÇÕES
            </button>
        </div>
        <nav className="space-y-2">
          <NavItem icon={<DashboardIcon className="w-6 h-6" />} label="Painel" active={activePage === 'Painel'} onClick={() => setActivePage('Painel')} />
          <NavItem icon={<VehicleIcon className="w-6 h-6" />} label="Veículos" active={activePage === 'Veículos'} onClick={() => setActivePage('Veículos')} />
          {canManage && (
            <>
              <NavItem icon={<DriverIcon className="w-6 h-6" />} label="Motoristas" active={activePage === 'Motoristas'} onClick={() => setActivePage('Motoristas')} />
              <NavItem icon={<ShieldIcon className="w-6 h-6" />} label="Administrativo" active={activePage === 'Administrativo'} onClick={() => setActivePage('Administrativo')} />
              <NavItem icon={<SettingsIcon className="w-6 h-6" />} label="Configurações" active={activePage === 'Configurações'} onClick={() => setActivePage('Configurações')} />
            </>
          )}
        </nav>
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
            <img src="https://i.pravatar.cc/40?u=creator" alt="Avatar do criador" className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-gray-800">Criador do App</p>
                <p className="text-sm text-gray-500">creator@fromtamax.com</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;