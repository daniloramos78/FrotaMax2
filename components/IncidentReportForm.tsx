import React, { useState, useRef } from 'react';
import { Vehicle, Driver, IncidentReport, IncidentSeverity, IncidentType, IncidentLocation } from '../types';
import { INCIDENT_TYPES, INCIDENT_LOCATIONS } from '../constants';

interface AvariasTabProps {
  vehicle: Vehicle;
  incidents: IncidentReport[];
  drivers: Driver[];
  onAddIncidentReport: (report: Omit<IncidentReport, 'id'>) => void;
}

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const AvariasTab: React.FC<AvariasTabProps> = ({ vehicle, incidents, drivers, onAddIncidentReport }) => {
  const [formData, setFormData] = useState({
    location: '' as IncidentLocation,
    type: '' as IncidentType,
    severity: IncidentSeverity.Low,
    description: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [docs, setDocs] = useState<File[]>([]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({ location: '' as IncidentLocation, type: '' as IncidentType, severity: IncidentSeverity.Low, description: '' });
    setPhotos([]);
    setDocs([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = drivers.find(d => d.id === vehicle.currentDriverId);
    if (!driver) return; // Or handle case where vehicle is available

    const newReport: Omit<IncidentReport, 'id'> = {
      vehicleId: vehicle.id,
      driverId: driver.id,
      date: new Date().toISOString(),
      ...formData,
      photoFilenames: photos.map(p => p.name),
      documentFilenames: docs.map(d => d.name),
    };
    onAddIncidentReport(newReport);
    resetForm();
  };

  const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";
  
  const severityColors: Record<IncidentSeverity, string> = {
    [IncidentSeverity.Low]: 'bg-yellow-500/20 text-yellow-300',
    [IncidentSeverity.Medium]: 'bg-orange-500/20 text-orange-300',
    [IncidentSeverity.High]: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-slate-900/50 rounded-lg">
        <h3 className="text-xl font-bold text-white">Registrar Nova Avaria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className={labelClasses}>Local</label>
                <select value={formData.location} onChange={e => setFormData(p => ({...p, location: e.target.value as IncidentLocation}))} className={inputClasses} required>
                    <option value="" disabled>Selecione...</option>
                    {INCIDENT_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
             <div>
                <label className={labelClasses}>Tipo de Avaria</label>
                <select value={formData.type} onChange={e => setFormData(p => ({...p, type: e.target.value as IncidentType}))} className={inputClasses} required>
                    <option value="" disabled>Selecione...</option>
                    {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
             <div>
                <label className={labelClasses}>Gravidade</label>
                <select value={formData.severity} onChange={e => setFormData(p => ({...p, severity: e.target.value as IncidentSeverity}))} className={inputClasses} required>
                   {Object.values(IncidentSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label className={labelClasses}>Descrição</label>
            <textarea value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} placeholder="Descreva a avaria em mais detalhes..." className={`${inputClasses} h-20 resize-none`} required />
        </div>
        <div>
            <label className={labelClasses}>Fotos e Documentos</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="file" accept="image/*" capture="environment" multiple ref={photoInputRef} onChange={e => setPhotos([...e.target.files!])} className="hidden" />
                <button type="button" onClick={() => photoInputRef.current?.click()} className="w-full flex items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm">
                    <CameraIcon /> Câmera
                </button>
                 <input type="file" accept=".pdf,.jpg,.png" multiple ref={docInputRef} onChange={e => setDocs([...e.target.files!])} className="hidden" />
                <button type="button" onClick={() => docInputRef.current?.click()} className="w-full flex items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm">
                    <UploadIcon /> Galeria / Arquivo
                </button>
            </div>
             <p className="text-xs text-slate-400 mt-2">PDF, JPG, PNG (máx. 10MB cada)</p>
        </div>
        <div className="text-right">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">Salvar Avaria</button>
        </div>
      </form>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-3">Avarias Existentes</h3>
        {incidents.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {incidents.map(inc => (
                    <div key={inc.id} className="bg-slate-700/50 p-3 rounded-lg">
                         <div className="flex justify-between items-start">
                            <p className="font-semibold text-white">{inc.type} - {inc.location}</p>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityColors[inc.severity]}`}>{inc.severity}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{inc.description}</p>
                        <p className="text-xs text-slate-400 mt-2">Reportado por {drivers.find(d => d.id === inc.driverId)?.name} em {new Date(inc.date).toLocaleString('pt-BR')}</p>
                    </div>
                ))}
            </div>
        ) : <div className="text-center py-6 px-4 bg-slate-700/50 rounded-lg"><p className="text-slate-400">Nenhuma avaria registrada para este veículo.</p></div>}
      </div>
    </div>
  );
};

export default AvariasTab;