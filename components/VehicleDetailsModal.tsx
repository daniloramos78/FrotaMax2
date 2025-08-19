import React, { useState } from 'react';
import { Vehicle, Driver, MaintenanceSchedule, FuelLog, IncidentReport, Trip } from '../types';
import Modal from './Modal';
import MaintenanceForm from './MaintenanceForm';
import AvariasTab from './IncidentReportForm';
import AbastecimentoTab from './FuelLogForm';

// --- Helper Functions & Components ---
const formatDateTime = (dateString?: string) => dateString ? new Date(dateString).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-6 px-4 bg-slate-700/50 rounded-lg">
        <p className="text-slate-400">{message}</p>
    </div>
);
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
      isActive
        ? 'border-blue-500 text-white'
        : 'border-transparent text-slate-400 hover:text-white'
    }`}
  >
    {label}
  </button>
);
interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-base font-semibold text-white">{value || 'N/A'}</p>
  </div>
);

// --- TAB CONTENT COMPONENTS ---
const InfoTab: React.FC<{ vehicle: Vehicle, schedules: MaintenanceSchedule[], onAddSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => void }> = ({ vehicle, schedules, onAddSchedule }) => {
    const [showForm, setShowForm] = useState(false);

    const handleSave = (schedule: Omit<MaintenanceSchedule, 'id'>) => {
        onAddSchedule(schedule);
        setShowForm(false);
    }

    return (
        <div className="space-y-6">
            {showForm ? (
                 <MaintenanceForm vehicle={vehicle} onSave={handleSave} onCancel={() => setShowForm(false)} />
            ) : (
                <>
                <section>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Detalhes do Veículo</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                        <DetailItem label="Marca" value={vehicle.brand} />
                        <DetailItem label="Modelo" value={vehicle.model} />
                        <DetailItem label="Ano" value={vehicle.year} />
                        <DetailItem label="Placa" value={vehicle.licensePlate} />
                        <DetailItem label="Combustível" value={vehicle.fuelType} />
                        <DetailItem label="KM Atual" value={`${vehicle.mileage.toLocaleString('pt-BR')} km`} />
                        <DetailItem label="Status" value={vehicle.status} />
                        <DetailItem label="Nível Comb." value={vehicle.fuelLevel} />
                        <DetailItem label="Tipo de Veículo" value={vehicle.vehicleType} />
                    </div>
                </section>
                <section>
                     <h3 className="text-lg font-semibold text-slate-200 mb-3">CRLV do Veículo</h3>
                     <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-slate-300">Documento disponível para visualização</p>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm">Visualizar CRLV</button>
                     </div>
                </section>
                <section>
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-slate-200">Registros de Manutenção</h3>
                        <button onClick={() => setShowForm(true)} className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-xs flex items-center gap-1">
                            + Nova Manutenção
                        </button>
                    </div>
                    {schedules.length > 0 ? (
                         <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                            {schedules.map(s => (
                                <div key={s.id} className="bg-slate-700/50 p-3 rounded-lg">
                                     <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-white">{s.description}</p>
                                            <p className="text-sm text-slate-300">Oficina: {s.workshop}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-white">{s.cost ? s.cost.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</p>
                                     </div>
                                    <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-600 flex justify-between">
                                        <span>Data: {formatDateTime(s.dateTime)}</span>
                                        {s.mileage && <span>KM: {s.mileage.toLocaleString('pt-BR')}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState message="Nenhum registro de manutenção encontrado." />}
                </section>
                </>
            )}
        </div>
    );
};

const RastreamentoTab: React.FC<{ vehicle: Vehicle; trip: Trip | undefined; onToggleTripPause: (vehicleId: string) => void }> = ({ vehicle, trip, onToggleTripPause }) => {
    const gpsStatus = trip ? (trip.isPaused ? 'Pausado' : 'GPS Ativo') : 'Inativo';
    const statusColor = trip ? (trip.isPaused ? 'text-yellow-400' : 'text-green-400') : 'text-slate-400';
    const lastUpdate = vehicle.lastLocation?.timestamp || trip?.startTime;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-semibold text-slate-200">Status do Rastreamento</h3>
                 <span className={`px-3 py-1 text-sm font-bold rounded-full ${statusColor} bg-white/10`}>{gpsStatus}</span>
            </div>
            {trip && (
                 <button 
                    onClick={() => onToggleTripPause(vehicle.id)}
                    className={`w-full py-2 rounded-lg font-bold transition-colors ${trip.isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
                 >
                    {trip.isPaused ? 'Retomar GPS' : 'Pausar GPS'}
                </button>
            )}
            <div className="p-4 bg-slate-700/50 rounded-lg">
                <p className="text-slate-300">Última Atualização: <span className="font-semibold text-white">{lastUpdate ? formatDateTime(lastUpdate) : 'N/A'}</span></p>
                <div className="flex justify-between items-center mt-2">
                     <p className="text-slate-300">Endereço Aproximado: <span className="font-semibold text-white">{vehicle.lastLocation?.address || 'N/A'}</span></p>
                     <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vehicle.lastLocation?.address || '')}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm">
                        Abrir no Google Maps
                    </a>
                </div>
             </div>
        </div>
    );
};


// --- MAIN MODAL COMPONENT ---
interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  drivers: Driver[];
  trips: Trip[];
  currentDriverId: string;
  schedules: MaintenanceSchedule[];
  fuelLogs: FuelLog[];
  incidentReports: IncidentReport[];
  onAddSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => void;
  onAddFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  onAddIncidentReport: (report: Omit<IncidentReport, 'id'>) => void;
  onToggleTripPause: (vehicleId: string) => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = (props) => {
  const { 
      isOpen, onClose, vehicle, drivers, trips, currentDriverId,
      schedules, fuelLogs, incidentReports, onAddSchedule, 
      onAddFuelLog, onAddIncidentReport, onToggleTripPause 
  } = props;
  const [activeTab, setActiveTab] = useState<'info' | 'incidents' | 'fuel' | 'tracking'>('info');

  if (!vehicle) return null;

  const vehicleSchedules = schedules.filter(s => s.vehicleId === vehicle.id).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  const vehicleFuelLogs = fuelLogs.filter(f => f.vehicleId === vehicle.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const vehicleIncidents = incidentReports.filter(i => i.vehicleId === vehicle.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const activeTrip = trips.find(t => t.vehicleId === vehicle.id && !t.endTime);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}`}>
      <div className="text-white">
        <div className="border-b border-slate-700 mb-6">
            <div className="flex space-x-2 -mb-px">
                <TabButton label="Informações" isActive={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                <TabButton label="Avarias" isActive={activeTab === 'incidents'} onClick={() => setActiveTab('incidents')} />
                <TabButton label="Abastecimento" isActive={activeTab === 'fuel'} onClick={() => setActiveTab('fuel')} />
                <TabButton label="Rastreamento" isActive={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} />
            </div>
        </div>

        <div>
            {activeTab === 'info' && <InfoTab vehicle={vehicle} schedules={vehicleSchedules} onAddSchedule={onAddSchedule} />}
            {activeTab === 'incidents' && <AvariasTab vehicle={vehicle} incidents={vehicleIncidents} drivers={drivers} onAddIncidentReport={onAddIncidentReport} />}
            {activeTab === 'fuel' && <AbastecimentoTab vehicle={vehicle} drivers={drivers} fuelLogs={vehicleFuelLogs} onAddFuelLog={onAddFuelLog} currentDriverId={currentDriverId} />}
            {activeTab === 'tracking' && <RastreamentoTab vehicle={vehicle} trip={activeTrip} onToggleTripPause={onToggleTripPause} />}
        </div>
      </div>
    </Modal>
  );
};

export default VehicleDetailsModal;