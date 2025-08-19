import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VehiclesPage from './components/VehiclesPage';
import DriversPage from './components/DriversPage';
import SettingsPage from './components/SettingsPage';
import AdminPage from './components/AdminPage';
import { Vehicle, Driver, Message, MaintenanceSchedule, Trip, FuelLog, VehicleStatus, User, FuelLevel, IncidentReport, UserRole } from './types';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_MESSAGES, MOCK_SCHEDULES, MOCK_TRIPS, MOCK_FUEL_LOGS, CURRENT_LOGGED_IN_DRIVER_ID, MOCK_USERS, MOCK_INCIDENT_REPORTS, CURRENT_USER_ID } from './constants';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Painel');
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(MOCK_SCHEDULES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(MOCK_FUEL_LOGS);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(MOCK_INCIDENT_REPORTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  const [currentUser] = useState<User | undefined>(MOCK_USERS.find(u => u.id === CURRENT_USER_ID));


  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const handleStartTrip = (vehicleId: string, tripData: Omit<Trip, 'id' | 'vehicleId' | 'startTime'>) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId 
      ? { ...v, status: VehicleStatus.InUse, currentDriverId: tripData.driverId, mileage: tripData.startMileage, fuelLevel: tripData.startFuelLevel } 
      : v
    ));
    const newTrip: Trip = {
      id: `TRIP-${Date.now()}`,
      vehicleId,
      startTime: new Date().toISOString(),
      ...tripData,
      isPaused: false,
    };
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleEndTrip = (vehicleId: string, tripData: { endMileage: number; endFuelLevel: any; }) => {
    setVehicles(prev => prev.map(v => 
        v.id === vehicleId 
        ? { ...v, status: VehicleStatus.Available, currentDriverId: null, mileage: tripData.endMileage, fuelLevel: tripData.endFuelLevel } 
        : v
    ));
    setTrips(prev => prev.map(t =>
      (t.vehicleId === vehicleId && !t.endTime)
      ? { ...t, endTime: new Date().toISOString(), endMileage: tripData.endMileage, endFuelLevel: tripData.endFuelLevel }
      : t
    ));
  };
  
  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [newDriver, ...prev]);
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };
  
  const handleAddMessage = (newMessage: Message) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleAddSchedule = (newSchedule: MaintenanceSchedule) => {
    setSchedules(prev => [newSchedule, ...prev].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
  };
  
  const handleAddFuelLog = (newLog: Omit<FuelLog, 'id'>) => {
    const logWithId: FuelLog = { ...newLog, id: `FUEL-${Date.now()}` };
    setFuelLogs(prev => [logWithId, ...prev]);
    // Atualiza a quilometragem do veículo
    setVehicles(prev => prev.map(v => 
      v.id === newLog.vehicleId && newLog.mileage > v.mileage
      ? { ...v, mileage: newLog.mileage }
      : v
    ));
  };
  
  const handleAddIncidentReport = (newReport: Omit<IncidentReport, 'id'>) => {
    const reportWithId: IncidentReport = { ...newReport, id: `INC-${Date.now()}` };
    setIncidentReports(prev => [reportWithId, ...prev]);
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleInitiateHandover = (vehicleId: string, targetDriverId: string, justification: string) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId
      ? { ...v, status: VehicleStatus.PendingHandover, handoverToDriverId: targetDriverId, handoverJustification: justification }
      : v
    ));
  };

  const handleAcceptHandover = (vehicleId: string, handoverData: { startMileage: number; startFuelLevel: FuelLevel; destination: string; purpose: string }) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle || !vehicle.handoverToDriverId) return;

    const newDriverId = vehicle.handoverToDriverId;

    // 1. End previous trip
    setTrips(prev => prev.map(t =>
      (t.vehicleId === vehicleId && !t.endTime)
      ? { ...t, endTime: new Date().toISOString(), endMileage: handoverData.startMileage }
      : t
    ));

    // 2. Start new trip
    const newTrip: Trip = {
      id: `TRIP-${Date.now()}`,
      vehicleId,
      startTime: new Date().toISOString(),
      driverId: newDriverId,
      origin: vehicle.location,
      ...handoverData,
      isPaused: false,
    };
    setTrips(prev => [newTrip, ...prev]);

    // 3. Update vehicle
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId 
      ? { 
          ...v, 
          status: VehicleStatus.InUse, 
          currentDriverId: newDriverId, 
          mileage: handoverData.startMileage, 
          fuelLevel: handoverData.startFuelLevel,
          handoverToDriverId: null,
          handoverJustification: null,
        } 
      : v
    ));
  };
  
  const handleRejectHandover = (vehicleId: string) => {
    setVehicles(prev => prev.map(v =>
      v.id === vehicleId
      ? { ...v, status: VehicleStatus.InUse, handoverToDriverId: null, handoverJustification: null }
      : v
    ));
  };

  const handleToggleTripPause = (vehicleId: string) => {
    setTrips(prev => prev.map(t =>
      (t.vehicleId === vehicleId && !t.endTime)
      ? { ...t, isPaused: !t.isPaused }
      : t
    ));
  };


  if (!currentUser) {
    return <div className="flex h-screen items-center justify-center">Erro: Usuário logado não encontrado.</div>
  }

  const renderContent = () => {
    switch (activePage) {
      case 'Painel':
        return <Dashboard vehicles={vehicles} />;
      case 'Veículos':
        return <VehiclesPage 
                  vehicles={vehicles} 
                  drivers={drivers}
                  trips={trips}
                  schedules={schedules}
                  fuelLogs={fuelLogs}
                  incidentReports={incidentReports}
                  onAddVehicle={handleAddVehicle}
                  onUpdateVehicle={handleUpdateVehicle}
                  onDeleteVehicle={handleDeleteVehicle}
                  onStartTrip={handleStartTrip}
                  onEndTrip={handleEndTrip}
                  currentDriverId={CURRENT_LOGGED_IN_DRIVER_ID}
                  onInitiateHandover={handleInitiateHandover}
                  onAcceptHandover={handleAcceptHandover}
                  onRejectHandover={handleRejectHandover}
                  onToggleTripPause={handleToggleTripPause}
                  onAddSchedule={handleAddSchedule}
                  onAddFuelLog={handleAddFuelLog}
                  onAddIncidentReport={handleAddIncidentReport}
                  currentUser={currentUser}
                />;
      case 'Motoristas':
        return <DriversPage 
                  drivers={drivers} 
                  onAddDriver={handleAddDriver} 
                  onUpdateDriver={handleUpdateDriver}
                  onDeleteDriver={handleDeleteDriver}
                />;
      case 'Administrativo':
        return <AdminPage 
          messages={messages} 
          drivers={drivers} 
          onAddMessage={handleAddMessage}
          vehicles={vehicles}
          schedules={schedules}
          onAddSchedule={handleAddSchedule}
          trips={trips}
          fuelLogs={fuelLogs}
        />;
      case 'Configurações':
        return <SettingsPage 
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />;
      default:
        return <Dashboard vehicles={vehicles}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} userRole={currentUser.role} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;