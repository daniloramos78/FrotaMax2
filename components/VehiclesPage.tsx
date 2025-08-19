import React, { useState, useMemo } from 'react';
import { Vehicle, VehicleStatus, Driver, Trip, FuelLevel, MaintenanceSchedule, FuelLog, IncidentReport, User, UserRole } from '../types';
import Modal from './Modal';
import VehicleForm from './VehicleForm';
import VehicleActionForm from './VehicleActionForm';
import { STATUS_COLORS } from '../constants';
import VehicleList from './VehicleList';
import HandoverForm from './HandoverForm';
import VehicleDetailsModal from './VehicleDetailsModal';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const StatusCard: React.FC<{ title: string; count: number; status: VehicleStatus | 'all' }> = ({ title, count, status }) => {
    const colorInfo = status === 'all' 
      ? { bg: 'bg-blue-50', text: 'text-blue-800', iconBg: 'bg-blue-500' } 
      : STATUS_COLORS[status];

    const iconMap = {
        'all': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
        [VehicleStatus.Available]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
        [VehicleStatus.InUse]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        [VehicleStatus.Maintenance]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        [VehicleStatus.PendingHandover]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    };

    return (
        <div className={`p-4 rounded-lg shadow flex items-center gap-4 ${colorInfo.bg}`}>
            <div className={`p-3 rounded-full ${colorInfo.iconBg}`}>
                {iconMap[status]}
            </div>
            <div>
                 <p className={`text-sm font-medium ${colorInfo.text}`}>{title}</p>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
            </div>
        </div>
    );
};

interface VehiclesPageProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  schedules: MaintenanceSchedule[];
  fuelLogs: FuelLog[];
  incidentReports: IncidentReport[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onStartTrip: (vehicleId: string, tripData: Omit<Trip, 'id' | 'vehicleId' | 'startTime'>) => void;
  onEndTrip: (vehicleId: string, tripData: { endMileage: number; endFuelLevel: FuelLevel; }) => void;
  currentDriverId: string;
  onInitiateHandover: (vehicleId: string, targetDriverId: string, justification: string) => void;
  onAcceptHandover: (vehicleId: string, handoverData: { startMileage: number; startFuelLevel: FuelLevel; destination: string; purpose: string }) => void;
  onRejectHandover: (vehicleId: string) => void;
  onToggleTripPause: (vehicleId: string) => void;
  onAddSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => void;
  onAddFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  onAddIncidentReport: (report: Omit<IncidentReport, 'id'>) => void;
  currentUser: User;
}

const VehiclesPage: React.FC<VehiclesPageProps> = (props) => {
    const { 
        vehicles, drivers, trips, schedules, fuelLogs, incidentReports, 
        onAddVehicle, onUpdateVehicle, onDeleteVehicle,
        onStartTrip, onEndTrip, currentDriverId, 
        onInitiateHandover, onAcceptHandover, onRejectHandover, onToggleTripPause, 
        onAddSchedule, onAddFuelLog, onAddIncidentReport, currentUser
    } = props;
    
    const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
    const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [vehicleForHandover, setVehicleForHandover] = useState<Vehicle | null>(null);
    const [actionType, setActionType] = useState<'Retirar' | 'Entregar' | 'AcceptHandover' | null>(null);
    const [vehicleForDetails, setVehicleForDetails] = useState<Vehicle | null>(null);

    const currentDriver = drivers.find(d => d.id === currentDriverId);
    const canManage = currentUser.role !== UserRole.Driver;

    const handleActionClick = (vehicleId: string, type: 'Retirar' | 'Entregar' | 'AcceptHandover') => {
        if (expandedActionId === vehicleId) {
            setExpandedActionId(null);
            setActionType(null);
        } else {
            setExpandedActionId(vehicleId);
            setActionType(type);
        }
    };

    const handleActionSubmit = (vehicleId: string, data: any) => {
        if (actionType === 'Retirar' && currentDriver) {
             const tripData: Omit<Trip, 'id' | 'vehicleId' | 'startTime'> = {
                driverId: currentDriver.id,
                startMileage: data.mileage,
                startFuelLevel: data.fuelLevel,
                destination: data.destination,
                purpose: data.purpose,
                origin: 'Garagem'
            };
            onStartTrip(vehicleId, tripData);
        } else if (actionType === 'Entregar') {
            onEndTrip(vehicleId, { endMileage: data.mileage, endFuelLevel: data.fuelLevel });
        } else if (actionType === 'AcceptHandover') {
            onAcceptHandover(vehicleId, { 
              startMileage: data.mileage, 
              startFuelLevel: data.fuelLevel, 
              destination: data.destination, 
              purpose: data.purpose 
            });
        }
        setExpandedActionId(null);
        setActionType(null);
    };

    const handleSaveVehicle = (vehicle: Vehicle) => {
        if(editingVehicle) {
            onUpdateVehicle(vehicle);
        } else {
            onAddVehicle(vehicle);
        }
        setIsVehicleFormOpen(false);
        setEditingVehicle(null);
    }
    
    const handleAddClick = () => {
        setEditingVehicle(null);
        setIsVehicleFormOpen(true);
    };

    const handleEditClick = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsVehicleFormOpen(true);
    };

    const handleDeleteClick = (vehicle: Vehicle) => {
        setDeletingVehicle(vehicle);
    };

    const handleDeleteConfirm = () => {
        if(deletingVehicle) {
            onDeleteVehicle(deletingVehicle.id);
            setDeletingVehicle(null);
        }
    };

    const handleHandoverSubmit = (targetDriverId: string, justification: string) => {
        if (vehicleForHandover) {
            onInitiateHandover(vehicleForHandover.id, targetDriverId, justification);
        }
        setVehicleForHandover(null);
    };
    
    const handleViewDetails = (vehicle: Vehicle) => {
        setVehicleForDetails(vehicle);
    };

    const filteredVehicles = useMemo(() => {
        return vehicles
            .filter(vehicle => statusFilter === 'all' || vehicle.status === statusFilter)
            .filter(vehicle => {
                const search = searchTerm.toLowerCase();
                return (
                    vehicle.model.toLowerCase().includes(search) ||
                    vehicle.brand.toLowerCase().includes(search) ||
                    vehicle.licensePlate.toLowerCase().includes(search)
                );
            });
    }, [vehicles, searchTerm, statusFilter]);
    
    const statusCounts = useMemo(() => ({
        all: vehicles.length,
        [VehicleStatus.Available]: vehicles.filter(v => v.status === VehicleStatus.Available).length,
        [VehicleStatus.InUse]: vehicles.filter(v => v.status === VehicleStatus.InUse).length,
        [VehicleStatus.Maintenance]: vehicles.filter(v => v.status === VehicleStatus.Maintenance).length,
    }), [vehicles]);

    if (!currentDriver) {
        return <div className="text-center p-8">Erro: Motorista logado não encontrado.</div>;
    }

    return (
        <>
            <Modal isOpen={isVehicleFormOpen} onClose={() => setIsVehicleFormOpen(false)} title={editingVehicle ? "Editar Veículo" : "Cadastrar Novo Veículo"}>
                <VehicleForm 
                    onSave={handleSaveVehicle} 
                    onCancel={() => {setIsVehicleFormOpen(false); setEditingVehicle(null);}} 
                    initialData={editingVehicle}
                />
            </Modal>

            <Modal isOpen={!!deletingVehicle} onClose={() => setDeletingVehicle(null)} title="Confirmar Exclusão">
                <div className="text-white">
                    <p>Você tem certeza que deseja excluir o veículo <span className="font-bold">{deletingVehicle?.brand} {deletingVehicle?.model} ({deletingVehicle?.licensePlate})</span>?</p>
                    <p className="text-sm text-slate-400 mt-2">Esta ação não poderá ser desfeita.</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setDeletingVehicle(null)} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleDeleteConfirm} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">
                            Excluir
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!vehicleForHandover} onClose={() => setVehicleForHandover(null)} title={`Repassar Veículo ${vehicleForHandover?.licensePlate}`}>
                <HandoverForm 
                    drivers={drivers}
                    currentDriverId={currentDriverId}
                    onSubmit={handleHandoverSubmit}
                    onCancel={() => setVehicleForHandover(null)}
                />
            </Modal>
            
            <VehicleDetailsModal
                isOpen={!!vehicleForDetails}
                onClose={() => setVehicleForDetails(null)}
                vehicle={vehicleForDetails}
                drivers={drivers}
                trips={trips}
                currentDriverId={currentDriverId}
                schedules={schedules}
                fuelLogs={fuelLogs}
                incidentReports={incidentReports}
                onAddSchedule={onAddSchedule}
                onAddFuelLog={onAddFuelLog}
                onAddIncidentReport={onAddIncidentReport}
                onToggleTripPause={onToggleTripPause}
            />
        
            <div className="space-y-6">
                <header className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Veículos</h1>
                        <p className="text-gray-500 mt-1">Gerencie os veículos da sua frota</p>
                    </div>
                    {canManage && (
                        <button onClick={handleAddClick} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                            <PlusIcon /> Novo Veículo
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatusCard title="Total de Veículos" count={statusCounts.all} status="all" />
                    <StatusCard title="Disponíveis" count={statusCounts[VehicleStatus.Available]} status={VehicleStatus.Available} />
                    <StatusCard title="Em Uso" count={statusCounts[VehicleStatus.InUse]} status={VehicleStatus.InUse} />
                    <StatusCard title="Em Manutenção" count={statusCounts[VehicleStatus.Maintenance]} status={VehicleStatus.Maintenance} />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-wrap gap-4 justify-between">
                         <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Buscar por placa, modelo ou marca..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                Todos ({statusCounts.all})
                            </button>
                            <button onClick={() => setStatusFilter(VehicleStatus.Available)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${statusFilter === VehicleStatus.Available ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                Disponível ({statusCounts[VehicleStatus.Available]})
                            </button>
                            <button onClick={() => setStatusFilter(VehicleStatus.InUse)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${statusFilter === VehicleStatus.InUse ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                Em Uso ({statusCounts[VehicleStatus.InUse]})
                            </button>
                            {statusCounts[VehicleStatus.Maintenance] > 0 && (
                                <button onClick={() => setStatusFilter(VehicleStatus.Maintenance)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${statusFilter === VehicleStatus.Maintenance ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    Manutenção ({statusCounts[VehicleStatus.Maintenance]})
                                </button>
                            )}
                        </div>
                    </div>
                   
                    <VehicleList 
                        vehicles={filteredVehicles}
                        drivers={drivers}
                        trips={trips}
                        currentDriverId={currentDriverId}
                        onAction={handleActionClick}
                        expandedActionId={expandedActionId}
                        onActionSubmit={handleActionSubmit}
                        currentDriver={currentDriver}
                        actionType={actionType}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        onRepassarClick={setVehicleForHandover}
                        onRejectHandover={onRejectHandover}
                        onToggleTripPause={onToggleTripPause}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        canManage={canManage}
                    />
                </div>
            </div>
        </>
    );
};

export default VehiclesPage;