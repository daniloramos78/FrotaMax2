import React, { useState } from 'react';
import { Vehicle, MaintenanceSchedule, MaintenanceStatus } from '../types';

interface MaintenanceFormProps {
  vehicle: Vehicle;
  onSave: (schedule: MaintenanceSchedule) => void;
  onCancel: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    workshop: '',
    workshopAddress: '',
    workshopPhone: '',

    dateTime: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: MaintenanceSchedule = {
      id: `SCH-${Date.now().toString().slice(-6)}`,
      vehicleId: vehicle.id,
      status: MaintenanceStatus.Scheduled,
      ...formData,
    };
    onSave(newSchedule);
  };

  const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-slate-300">Agendando para o veículo: <span className="font-bold text-white">{vehicle.brand} {vehicle.model} ({vehicle.licensePlate})</span></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="workshop" className={labelClasses}>Oficina / Prestador</label>
          <input type="text" id="workshop" name="workshop" value={formData.workshop} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="dateTime" className={labelClasses}>Data e Hora</label>
          <input type="datetime-local" id="dateTime" name="dateTime" value={formData.dateTime} onChange={handleChange} className={inputClasses} required />
        </div>
         <div className="md:col-span-2">
            <label htmlFor="workshopAddress" className={labelClasses}>Endereço</label>
            <input type="text" id="workshopAddress" name="workshopAddress" value={formData.workshopAddress} onChange={handleChange} className={inputClasses} />
        </div>
         <div className="md:col-span-2">
            <label htmlFor="workshopPhone" className={labelClasses}>Telefone</label>
            <input type="tel" id="workshopPhone" name="workshopPhone" value={formData.workshopPhone} onChange={handleChange} className={inputClasses} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className={labelClasses}>Descrição do Serviço</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} required />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
          Salvar Agendamento
        </button>
      </div>
    </form>
  );
};

export default MaintenanceForm;