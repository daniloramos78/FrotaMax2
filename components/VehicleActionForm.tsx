import React, { useState } from 'react';
import { Vehicle, Driver, FuelLevel } from '../types';
import { CHECKLIST_ITEMS, FUEL_LEVELS } from '../constants';

interface VehicleActionFormProps {
  actionType: 'Retirar' | 'Entregar' | 'AcceptHandover';
  vehicle: Vehicle;
  currentDriver: Driver;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const VehicleActionForm: React.FC<VehicleActionFormProps> = ({ actionType, vehicle, currentDriver, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    mileage: vehicle.mileage,
    fuelLevel: vehicle.fuelLevel,
    destination: '',
    purpose: '',
  });
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => 
    CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistChange = (item: string) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const isFormValid = () => {
    const allChecked = Object.values(checklist).every(Boolean);
    if (actionType === 'Retirar' || actionType === 'AcceptHandover') {
        return allChecked && formData.destination && formData.purpose;
    }
    return allChecked;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    onSubmit(formData);
  };
  
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const inputClasses = "w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const sectionTitleClasses = "text-lg font-semibold text-gray-800 mb-3";

  const formTitle = actionType === 'AcceptHandover' ? 'Aceitar Repasse' : `Dados da ${actionType}`;
  const kmLabel = actionType === 'Entregar' ? 'KM de Chegada' : 'KM de Saída';
  const buttonText = actionType === 'AcceptHandover' ? 'Confirmar Aceite' : `Confirmar ${actionType}`;


  return (
    <form onSubmit={handleSubmit} className="border-t-2 border-dashed border-gray-200 mt-4 pt-4 space-y-6 bg-gray-50 p-4 rounded-b-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className={sectionTitleClasses}>{formTitle}</h3>
           <div>
            <label htmlFor="mileage" className={labelClasses}>{kmLabel}</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className={inputClasses} required />
          </div>
          <div>
            <label htmlFor="fuelLevel" className={labelClasses}>Nível de Combustível</label>
            <select name="fuelLevel" value={formData.fuelLevel} onChange={handleInputChange} className={inputClasses} required>
                {FUEL_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
           {(actionType === 'Retirar' || actionType === 'AcceptHandover') && (
            <>
            <div>
                <label htmlFor="destination" className={labelClasses}>Destino</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="purpose" className={labelClasses}>Finalidade</label>
                <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} className={inputClasses} required />
            </div>
            </>
           )}
        </div>

        <div>
          <h3 className={sectionTitleClasses}>Checklist (Obrigatório)</h3>
          <div className="space-y-2">
            {CHECKLIST_ITEMS.map(item => (
                <label key={item} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={checklist[item]} onChange={() => handleChecklistChange(item)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    {item}
                </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <h4 className="font-bold text-yellow-800">Lembretes Importantes</h4>
        <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
            <li>Respeitar limites de velocidade e normas de trânsito.</li>
            <li>Usar sempre o cinto de segurança.</li>
            <li>Reportar qualquer problema ou dano imediatamente.</li>
            <li>Não usar celular ao dirigir.</li>
            <li>Manter distância segura de outros veículos.</li>
            <li>Não dirigir sob efeito de álcool ou drogas.</li>
            <li>Proibido carona.</li>
        </ul>
      </div>

      <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg">Cancelar</button>
          <button type="submit" disabled={!isFormValid()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
            {buttonText}
          </button>
      </div>
    </form>
  );
};

export default VehicleActionForm;
