import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle, VehicleType, FuelType, VehicleStatus, FuelLevel } from '../types';
import { VEHICLE_FUEL_TYPES } from '../constants';

interface VehicleFormProps {
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
  initialData?: Vehicle | null;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    id: '',
    brand: '',
    model: '',
    licensePlate: '',
    fuelType: FuelType.Gasoline,
    year: new Date().getFullYear(),
    vehicleType: VehicleType.LightCar,
    hasArla32: false,
    mileage: 0,
    fuelLevel: FuelLevel.Full,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        brand: initialData.brand,
        model: initialData.model,
        licensePlate: initialData.licensePlate,
        fuelType: initialData.fuelType,
        year: initialData.year,
        vehicleType: initialData.vehicleType,
        hasArla32: initialData.hasArla32,
        mileage: initialData.mileage,
        fuelLevel: initialData.fuelLevel,
      });
    } else {
        setFormData({
            id: '', brand: '', model: '', licensePlate: '', fuelType: FuelType.Gasoline,
            year: new Date().getFullYear(), vehicleType: VehicleType.LightCar, hasArla32: false,
            mileage: 0, fuelLevel: FuelLevel.Full
        });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'hasArla32') {
      setFormData(prev => ({ ...prev, hasArla32: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'year' || name === 'mileage' ? parseInt(value) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleData: Vehicle = {
      ...formData,
      id: formData.id || `VEH-${Date.now().toString().slice(-6)}`,
      status: initialData ? initialData.status : VehicleStatus.Available,
      location: initialData ? initialData.location : 'Garagem',
      currentDriverId: initialData ? initialData.currentDriverId : null,
      year: Number(formData.year),
    };
    onSave(vehicleData);
  };

  const isArlaRelevantVehicle = useMemo(() => {
    const relevantTypes = [
      VehicleType.Truck, VehicleType.Bus, VehicleType.Pickup, VehicleType.Van,
      VehicleType.CargoVan, VehicleType.AgriculturalTractor, VehicleType.CrawlerTractor,
      VehicleType.MotorGrader, VehicleType.WheelLoader, VehicleType.BackhoeLoader,
      VehicleType.HydraulicExcavator, VehicleType.Harvester,
    ];
    return relevantTypes.includes(formData.vehicleType) && formData.year >= 2012;
  }, [formData.vehicleType, formData.year]);

  const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";
  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className={labelClasses}>Marca</label>
          <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="model" className={labelClasses}>Modelo</label>
          <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="licensePlate" className={labelClasses}>Placa</label>
          <input type="text" id="licensePlate" name="licensePlate" value={formData.licensePlate} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="year" className={labelClasses}>Ano de Fabricação</label>
          <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} className={inputClasses} required min="1950" max={new Date().getFullYear() + 1} />
        </div>
        <div>
          <label htmlFor="vehicleType" className={labelClasses}>Tipo de Veículo</label>
          <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={inputClasses} required>
            {Object.values(VehicleType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fuelType" className={labelClasses}>Combustível</label>
          <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClasses} required>
            {VEHICLE_FUEL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mileage" className={labelClasses}>Quilometragem</label>
          <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} className={inputClasses} required />
        </div>
        {isArlaRelevantVehicle && (
          <div>
            <label htmlFor="hasArla32" className={labelClasses}>Utiliza Arla 32?</label>
            <select id="hasArla32" name="hasArla32" value={String(formData.hasArla32)} onChange={handleChange} className={inputClasses} required>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;