import React, { useEffect, useRef } from 'react';
import { Vehicle, VehicleStatus, Driver, Trip } from '../types';
import { STATUS_COLORS } from '../constants';
import VehicleActionForm from './VehicleActionForm';

const StatusBadge: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  const colorInfo = STATUS_COLORS[status];
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorInfo.badgeBg} ${colorInfo.text}`}>
      {status}
    </span>
  );
};

const VehicleInfoItem: React.FC<{ icon: React.ReactNode; label: string | number }> = ({ icon, label }) => (
  <div className="flex items-center text-sm text-gray-500">
    {icon}
    <span className="ml-2">{label}</span>
  </div>
);

const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1h3a1 1 0 01.894.553l1.83 4.116A2 2 0 0116 10v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 01-.724-1.331L1.447 4.553A1 1 0 012.34 3h3V2a1 1 0 011-1h3zm-1 3H6.72l-1.332 3H10V5zm2 0v3h4.612l-1.332-3H12zM5 11a1 1 0 110-2h10a1 1 0 110 2H5z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const SpeedometerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const FuelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v-4m4 4v-4m4 4v-4M4 18h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1z" /></svg>;

interface VehicleListProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  currentDriverId: string;
  onAction: (vehicleId: string, actionType: 'Retirar' | 'Entregar' | 'AcceptHandover') => void;
  expandedActionId: string | null;
  onActionSubmit: (vehicleId: string, data: any) => void;
  currentDriver: Driver;
  actionType: 'Retirar' | 'Entregar' | 'AcceptHandover' | null;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onRepassarClick: (vehicle: Vehicle) => void;
  onRejectHandover: (vehicleId: string) => void;
  onToggleTripPause: (vehicleId: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  canManage: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
    vehicles, drivers, trips, currentDriverId, onAction, expandedActionId, 
    onActionSubmit, currentDriver, actionType, openMenuId, setOpenMenuId, 
    onRepassarClick, onRejectHandover, onToggleTripPause, onViewDetails, onEdit, onDelete,
    canManage
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('button[data-menu-button]')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpenMenuId]);

  const getDriverName = (driverId: string | null | undefined) => {
    if (!driverId) return 'N/A';
    return drivers.find(d => d.id === driverId)?.name || 'Desconhecido';
  };

  return (
    <div className="space-y-4 mt-4">
      {vehicles.map(vehicle => {
        const isMine = vehicle.currentDriverId === currentDriverId;
        const isPendingForMe = vehicle.status === VehicleStatus.PendingHandover && vehicle.handoverToDriverId === currentDriverId;
        const isPendingByMe = vehicle.status === VehicleStatus.PendingHandover && vehicle.currentDriverId === currentDriverId;
        
        const handleMenuClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id);
        }
        
        const driverInfoText = () => {
          switch (vehicle.status) {
            case VehicleStatus.InUse:
              return getDriverName(vehicle.currentDriverId);
            case VehicleStatus.PendingHandover:
              return `De: ${getDriverName(vehicle.currentDriverId)} Para: ${getDriverName(vehicle.handoverToDriverId)}`;
            default:
              return 'Nenhum motorista atribuído';
          }
        };

        return (
          <div key={vehicle.id} className="bg-white rounded-lg shadow p-4 transition-shadow hover:shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-1 flex justify-center"><CarIcon /></div>
              <div className="md:col-span-3">
                <p className="font-bold text-gray-800">{vehicle.brand.toUpperCase()} {vehicle.model.toUpperCase()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded">{vehicle.licensePlate}</span>
                  <StatusBadge status={vehicle.status} />
                  {vehicle.gpsStatus === 'Ativo' && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">GPS ATIVO</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <UserIcon /> {driverInfoText()}
                </p>
              </div>
              <div className="md:col-span-5 grid grid-cols-3 gap-4">
                <VehicleInfoItem icon={<CalendarIcon />} label={vehicle.year} />
                <VehicleInfoItem icon={<SpeedometerIcon />} label={`${vehicle.mileage.toLocaleString('pt-BR')} km`} />
                <VehicleInfoItem icon={<FuelIcon />} label={vehicle.fuelType} />
              </div>
              <div className="md:col-span-3 flex items-center justify-end gap-2">
                {vehicle.status === VehicleStatus.Available && (
                  <button onClick={() => onAction(vehicle.id, 'Retirar')} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Retirar
                  </button>
                )}
                {vehicle.status === VehicleStatus.InUse && isMine && (
                   <button onClick={() => onAction(vehicle.id, 'Entregar')} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                    Entregar
                  </button>
                )}
                 {vehicle.status === VehicleStatus.InUse && !isMine && (
                   <p className="text-sm text-gray-500 text-right">Em uso por {getDriverName(vehicle.currentDriverId)}</p>
                )}
                {isPendingForMe && (
                    <div className="flex gap-2">
                        <button onClick={() => onAction(vehicle.id, 'AcceptHandover')} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
                            Aceitar
                        </button>
                        <button onClick={() => onRejectHandover(vehicle.id)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                            Recusar
                        </button>
                    </div>
                )}
                 {isPendingByMe && (
                   <p className="text-sm text-indigo-600 text-right">Aguardando aceite de {getDriverName(vehicle.handoverToDriverId)}</p>
                )}
                
                <div className="relative">
                  <button data-menu-button onClick={handleMenuClick} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                  </button>
                  {openMenuId === vehicle.id && (
                     <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                        <ul className="py-1">
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onViewDetails(vehicle); setOpenMenuId(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Detalhes</a>
                            </li>

                            {isMine && vehicle.status === VehicleStatus.InUse && (
                                <>
                                    <li className="border-t border-gray-100 my-1"></li>
                                    <li>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onRepassarClick(vehicle); setOpenMenuId(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Repassar Veículo
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onToggleTripPause(vehicle.id); setOpenMenuId(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            {trips.find(t => t.vehicleId === vehicle.id && !t.endTime)?.isPaused ? 'Retomar Viagem' : 'Pausar Viagem'}
                                        </a>
                                    </li>
                                </>
                            )}
                            
                            {canManage && (
                              <>
                                <li className="border-t border-gray-100 my-1"></li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onEdit(vehicle); setOpenMenuId(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar Veículo</a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onDelete(vehicle); setOpenMenuId(null); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">Excluir Veículo</a>
                                </li>
                              </>
                            )}
                        </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {expandedActionId === vehicle.id && actionType && (
                <VehicleActionForm
                    actionType={actionType}
                    vehicle={vehicle}
                    currentDriver={currentDriver}
                    onSubmit={(data) => onActionSubmit(vehicle.id, data)}
                    onCancel={() => onAction(vehicle.id, actionType)}
                />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VehicleList;