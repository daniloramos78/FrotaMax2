export enum VehicleStatus {
  Available = 'Disponível',
  InUse = 'Em Uso',
  Maintenance = 'Manutenção',
  PendingHandover = 'Aguardando Repasse',
}

export enum VehicleType {
  LightCar = 'Carro Leve',
  SUV = 'SUV',
  Van = 'Van',
  CargoVan = 'Furgão',
  Truck = 'Caminhão',
  Bus = 'Ônibus',
  Pickup = 'Caminhonete',
  AgriculturalTractor = 'Trator Agrícola',
  CrawlerTractor = 'Trator de Esteiras',
  MotorGrader = 'Motoniveladora',
  WheelLoader = 'Pá Carregadeira',
  BackhoeLoader = 'Retroescavadeira',
  HydraulicExcavator = 'Escavadeira Hidráulica',
  Harvester = 'Colheitadeira',
}

export enum FuelType {
  Gasoline = 'Gasolina',
  Ethanol = 'Etanol',
  CommonDiesel = 'Diesel Comum',
  S10Diesel = 'Diesel S10',
  Arla32 = 'Arla-32',
  Electric = 'Elétrico',
  Hybrid = 'Híbrido',
  Flex = 'Flex',
}

export enum FuelLevel {
    Empty = 'Vazio',
    OneQuarter = '1/4',
    Half = '1/2',
    ThreeQuarters = '3/4',
    Full = 'Cheio',
}

export interface Vehicle {
  id: string;
  status: VehicleStatus;
  location: string;
  model: string;
  brand: string;
  licensePlate: string;
  fuelType: FuelType;
  year: number;
  vehicleType: VehicleType;
  hasArla32: boolean;
  currentDriverId: string | null;
  mileage: number;
  fuelLevel: FuelLevel;
  handoverToDriverId?: string | null;
  handoverJustification?: string | null;
  lastLocation?: {
    timestamp: string;
    address: string;
  };
  gpsStatus?: 'Ativo' | 'Inativo';
}

export enum AlertLevel {
  Info = 'Informativo',
  Warning = 'Aviso',
  Critical = 'Crítico',
}

export interface Alert {
  id: string;
  message: string;
  vehicleId: string;
  level: AlertLevel;
  timestamp: string;
}

export enum DriverRole {
  Driver = 'Motorista',
  TractorOperator = 'Tratorista',
  MachineOperator = 'Operador de Máquinas',
}

export enum CNHCombinedCategory {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    AB = 'AB',
    AC = 'AC',
    AD = 'AD',
    AE = 'AE',
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cnhNumber: string;
  cnhExpiration: string;
  role: DriverRole;
  cnhCategory: CNHCombinedCategory;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  target: 'all' | string; // 'all' or driver ID
  author: string;
  createdAt: string;
  expiresAt: string;
}

export enum MaintenanceStatus {
  Scheduled = 'Agendado',
  InProgress = 'Em Andamento',
  Completed = 'Concluído',
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  workshop: string;
  workshopAddress?: string;
  workshopPhone?: string;
  dateTime: string;
  description: string;
  status: MaintenanceStatus;
  mileage?: number;
  cost?: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startTime: string;
  endTime?: string;
  startMileage: number;
  endMileage?: number;
  startFuelLevel: FuelLevel;
  endFuelLevel?: FuelLevel;
  origin?: string;
  destination: string;
  purpose: string;
  isPaused?: boolean;
}


export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  mileage: number;
  recordType: string;
  fuelType: string;
  fuelStation?: string;
  receiptPhotoFilename?: string;
  receiptFileFilename?: string;
}

export enum IncidentSeverity {
  Low = 'Leve',
  Medium = 'Moderada',
  High = 'Grave',
}

export type IncidentType = 'Risco' | 'Amassado' | 'Rachadura' | 'Quebrado' | 'Faltando' | 'Desgastado' | 'Outro';
export type IncidentLocation = 'Para-brisa' | 'Para-choque Dianteiro' | 'Para-choque Traseiro' | 'Porta Esquerda' | 'Porta Direita' | 'Capô' | 'Teto' | 'Vidro Traseiro' | 'Retrovisor Esquerdo' | 'Retrovisor Direito' | 'Rodas' | 'Interior' | 'Outro';


export interface IncidentReport {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  description: string;
  severity: IncidentSeverity;
  type: IncidentType;
  location: IncidentLocation;
  photoFilenames?: string[];
  documentFilenames?: string[];
}


// --- User Management Types ---
export enum UserRole {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Manager = 'Gerente',
  Driver = 'Motorista',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}


// --- AI Insights Types ---
export interface CostOpportunity {
    title: string;
    description: string;
    vehicleId: string;
}

export interface EfficiencyInsight {
    title: string;
    description: string;
}

export interface MaintenanceAlert {
    title: string;
    description: string;
    vehicleId: string;
}

export interface AIInsight {
    generalSummary: string;
    costOpportunities: CostOpportunity[];
    efficiencyInsights: EfficiencyInsight[];
    maintenanceAlerts: MaintenanceAlert[];
}