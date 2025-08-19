import { Vehicle, Alert, VehicleStatus, AlertLevel, VehicleType, FuelType, Driver, DriverRole, CNHCombinedCategory, Message, MaintenanceSchedule, MaintenanceStatus, Trip, FuelLog, FuelLevel, User, UserRole, IncidentReport, IncidentSeverity, IncidentType, IncidentLocation } from './types';

export const CURRENT_LOGGED_IN_DRIVER_ID = 'DRV-001'; // Simula o motorista Carlos Pereira logado
export const CURRENT_USER_ID = 'USR-002'; // Simula o login do usuário 'gerente@fromtamax.com' com perfil de Gerente

export const CHECKLIST_ITEMS = [
  'Documentos em ordem (CNH, CRLV)',
  'Nível de combustível verificado',
  'Pneus em bom estado e calibrados',
  'Faróis e lanternas funcionando',
  'Espelhos ajustados e limpos',
  'Cintos de segurança funcionando',
  'Água do limpador de parabrisa',
  'Veículo limpo e organizado',
];

export const FUEL_LEVELS = Object.values(FuelLevel);
export const RECORD_TYPES = ['Combustível', 'Arla 32'];
export const VEHICLE_FUEL_TYPES = ['Gasolina', 'Etanol', 'Diesel Comum', 'Diesel S10', 'Arla-32'];
export const INCIDENT_TYPES: IncidentType[] = ['Risco', 'Amassado', 'Rachadura', 'Quebrado', 'Faltando', 'Desgastado', 'Outro'];
export const INCIDENT_LOCATIONS: IncidentLocation[] = ['Para-brisa', 'Para-choque Dianteiro', 'Para-choque Traseiro', 'Porta Esquerda', 'Porta Direita', 'Capô', 'Teto', 'Vidro Traseiro', 'Retrovisor Esquerdo', 'Retrovisor Direito', 'Rodas', 'Interior', 'Outro'];
export const INCIDENT_SEVERITIES: IncidentSeverity[] = [IncidentSeverity.Low, IncidentSeverity.Medium, IncidentSeverity.High];


export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'CAR-001', status: VehicleStatus.InUse, location: 'Houston, TX', model: 'Palio', brand: 'Fiat', licensePlate: 'DW19A94', fuelType: FuelType.Flex, year: 2008, vehicleType: VehicleType.LightCar, hasArla32: false, currentDriverId: 'DRV-001', mileage: 130100, fuelLevel: FuelLevel.Half, gpsStatus: 'Ativo' },
  { id: 'TRK-001', status: VehicleStatus.Available, location: 'New York, NY', model: 'VNL 860', brand: 'Volvo', licensePlate: 'ABC-1234', fuelType: FuelType.S10Diesel, year: 2022, vehicleType: VehicleType.Truck, hasArla32: true, currentDriverId: null, mileage: 120500, fuelLevel: FuelLevel.Full },
  { id: 'VAN-001', status: VehicleStatus.Available, location: 'Phoenix, AZ', model: 'Oroch', brand: 'Renault', licensePlate: 'TCY4F88', fuelType: FuelType.Flex, year: 2025, vehicleType: VehicleType.Pickup, hasArla32: true, currentDriverId: null, mileage: 40160, fuelLevel: FuelLevel.ThreeQuarters, lastLocation: { timestamp: '18/08/2025, 17:28:57', address: 'Phoenix, AZ'} },
  { id: 'VAN-002', status: VehicleStatus.Available, location: 'Garagem', model: 'Oroch', brand: 'Renault', licensePlate: 'RNP6J45', fuelType: FuelType.Flex, year: 2022, vehicleType: VehicleType.Pickup, hasArla32: false, currentDriverId: null, mileage: 215358, fuelLevel: FuelLevel.Full },
];


export const MOCK_DRIVERS: Driver[] = [
  { id: 'DRV-001', name: 'Carlos Pereira', email: 'carlos.p@example.com', phone: '(11) 98765-4321', address: 'Rua das Flores, 123, São Paulo, SP', cnhNumber: '123456789', cnhExpiration: '2025-10-15', role: DriverRole.Driver, cnhCategory: CNHCombinedCategory.AB },
  { id: 'DRV-002', name: 'Fernanda Lima', email: 'fernanda.l@example.com', phone: '(21) 91234-5678', address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ', cnhNumber: '987654321', cnhExpiration: '2026-05-20', role: DriverRole.Driver, cnhCategory: CNHCombinedCategory.D },
  { id: 'DRV-003', name: 'Ricardo Alves', email: 'ricardo.a@example.com', phone: '(31) 95555-4444', address: 'Praça da Liberdade, 789, Belo Horizonte, MG', cnhNumber: '112233445', cnhExpiration: '2024-12-01', role: DriverRole.TractorOperator, cnhCategory: CNHCombinedCategory.C },
  { id: 'DRV-004', name: 'Juliana Costa', email: 'juliana.c@example.com', phone: '(51) 93333-2222', address: 'Rua dos Andradas, 101, Porto Alegre, RS', cnhNumber: '556677889', cnhExpiration: '2027-02-28', role: DriverRole.MachineOperator, cnhCategory: CNHCombinedCategory.E },
];


export const MOCK_ALERTS: Alert[] = [
  { id: 'A01', message: 'Baixa pressão do óleo do motor', vehicleId: 'CAR-001', level: AlertLevel.Critical, timestamp: '2024-07-30 08:15:00' },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'MSG-001',
    title: 'Lembrete de Segurança',
    content: 'Por favor, lembrem-se de realizar a verificação diária dos veículos antes de iniciar a rota. A segurança vem em primeiro lugar.',
    target: 'all',
    author: 'Admin',
    createdAt: '2024-08-14T09:00:00Z',
    expiresAt: '2024-08-20T23:59:59Z',
  },
  {
    id: 'MSG-002',
    title: 'Documentação Pendente',
    content: 'Carlos, por favor, envie a cópia atualizada da sua CNH para o RH até o final da semana.',
    target: 'DRV-001',
    author: 'Admin',
    createdAt: '2024-08-13T14:30:00Z',
    expiresAt: '2024-08-18T23:59:59Z',
  },
  {
    id: 'MSG-003',
    title: 'Manutenção Agendada (Expirada)',
    content: 'Lembrete de manutenção para o veículo TRK-001.',
    target: 'all',
    author: 'Admin',
    createdAt: '2024-08-01T10:00:00Z',
    expiresAt: '2024-08-05T23:59:59Z',
  }
];

export const MOCK_SCHEDULES: MaintenanceSchedule[] = [
  { id: 'SCH-001', vehicleId: 'CAR-001', workshop: 'Oficina Central', dateTime: '2024-07-20T14:00:00Z', description: 'Troca de óleo e filtro', status: MaintenanceStatus.Completed, workshopAddress: 'Rua do Mecânico, 123', workshopPhone: '1155551234', mileage: 128500, cost: 250.00 },
  { id: 'SCH-002', vehicleId: 'TRK-001', workshop: 'Point S Pneus', dateTime: '2024-09-12T09:00:00Z', description: 'Alinhamento e balanceamento', status: MaintenanceStatus.Scheduled, workshopAddress: 'Av. das Rodas, 456' },
];

export const MOCK_TRIPS: Trip[] = [
  { id: 'TRIP-001', vehicleId: 'CAR-001', driverId: 'DRV-001', startTime: '2024-08-10T08:00:00Z', startMileage: 130100, startFuelLevel: FuelLevel.Full, destination: 'Rio de Janeiro, RJ', purpose: 'Entrega Cliente A', isPaused: false },
  { id: 'TRIP-002', vehicleId: 'VAN-001', driverId: 'DRV-002', startTime: '2024-08-11T10:00:00Z', endTime: '2024-08-11T12:15:00Z', startMileage: 40000, endMileage: 40160, startFuelLevel: FuelLevel.ThreeQuarters, endFuelLevel: FuelLevel.Half, origin: 'Phoenix, AZ', destination: 'Tucson, AZ', purpose: 'Visita Técnica' },
];

export const MOCK_FUEL_LOGS: FuelLog[] = [
  { id: 'FUEL-001', vehicleId: 'CAR-001', driverId: 'DRV-001', date: '2024-08-12', liters: 40, pricePerLiter: 5.90, totalCost: 236.00, mileage: 129500, recordType: 'Combustível', fuelType: 'Gasolina', fuelStation: 'Posto Shell' },
  { id: 'FUEL-002', vehicleId: 'VAN-001', driverId: 'DRV-002', date: '2024-08-11', liters: 60, pricePerLiter: 6.10, totalCost: 366.00, mileage: 40000, recordType: 'Combustível', fuelType: 'Etanol' },
  { id: 'FUEL-003', vehicleId: 'TRK-001', driverId: 'DRV-003', date: '2024-08-10', liters: 200, pricePerLiter: 5.75, totalCost: 1150.00, mileage: 120000, recordType: 'Combustível', fuelType: 'Diesel S10', fuelStation: 'Posto Ipiranga' },
];

export const MOCK_INCIDENT_REPORTS: IncidentReport[] = [
    { id: 'INC-001', vehicleId: 'CAR-001', driverId: 'DRV-002', date: '2024-08-14T07:00:00Z', description: 'Arranhão profundo na lateral direita do para-choque.', severity: IncidentSeverity.Low, type: 'Risco', location: 'Para-choque Dianteiro' },
];


export const MOCK_USERS: User[] = [
    { id: 'USR-001', email: 'admin@fromtamax.com', role: UserRole.SuperAdmin },
    { id: 'USR-002', email: 'gerente@fromtamax.com', role: UserRole.Manager },
    { id: 'USR-003', email: 'carlos.p@example.com', role: UserRole.Driver },
];


export const STATUS_COLORS: { [key in VehicleStatus]: { bg: string; text: string, iconBg: string, badgeBg: string, hex: string } } = {
  [VehicleStatus.Available]: { bg: 'bg-emerald-50', text: 'text-emerald-800', iconBg: 'bg-emerald-500', badgeBg: 'bg-emerald-100', hex: '#10B981' },
  [VehicleStatus.InUse]: { bg: 'bg-amber-50', text: 'text-amber-800', iconBg: 'bg-amber-400', badgeBg: 'bg-amber-100', hex: '#FBBF24' },
  [VehicleStatus.Maintenance]: { bg: 'bg-red-50', text: 'text-red-800', iconBg: 'bg-red-500', badgeBg: 'bg-red-100', hex: '#EF4444' },
  [VehicleStatus.PendingHandover]: { bg: 'bg-indigo-50', text: 'text-indigo-800', iconBg: 'bg-indigo-500', badgeBg: 'bg-indigo-100', hex: '#6366F1' },
};