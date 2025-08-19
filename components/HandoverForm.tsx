import React, { useState } from 'react';
import { Driver } from '../types';

interface HandoverFormProps {
  drivers: Driver[];
  currentDriverId: string;
  onSubmit: (targetDriverId: string, justification: string) => void;
  onCancel: () => void;
}

const HandoverForm: React.FC<HandoverFormProps> = ({ drivers, currentDriverId, onSubmit, onCancel }) => {
  const [targetDriverId, setTargetDriverId] = useState('');
  const [justification, setJustification] = useState('');

  const availableDrivers = drivers.filter(d => d.id !== currentDriverId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDriverId || !justification) return;
    onSubmit(targetDriverId, justification);
  };
  
  const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="targetDriverId" className={labelClasses}>Selecione o Motorista de Destino</label>
        <select 
            id="targetDriverId" 
            name="targetDriverId" 
            value={targetDriverId} 
            onChange={(e) => setTargetDriverId(e.target.value)} 
            className={inputClasses} 
            required
        >
          <option value="" disabled>Escolha um motorista...</option>
          {availableDrivers.map(driver => (
            <option key={driver.id} value={driver.id}>{driver.name}</option>
          ))}
        </select>
      </div>
       <div>
        <label htmlFor="justification" className={labelClasses}>Justificativa</label>
        <textarea 
          id="justification" 
          name="justification" 
          value={justification} 
          onChange={(e) => setJustification(e.target.value)} 
          className={`${inputClasses} h-24 resize-none`} 
          required 
          placeholder="Ex: Fim do meu turno, necessidade de outro motorista para a próxima entrega."
        />
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
          Confirmar Repasse
        </button>
      </div>
    </form>
  );
};

export default HandoverForm;
