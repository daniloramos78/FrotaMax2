import React, { useState, useEffect, useRef } from 'react';
import { Vehicle, Driver, FuelLog, FuelType } from '../types';
import { RECORD_TYPES, VEHICLE_FUEL_TYPES } from '../constants';

interface AbastecimentoTabProps {
  vehicle: Vehicle;
  drivers: Driver[];
  fuelLogs: FuelLog[];
  onAddFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  currentDriverId: string;
}

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : 'N/A';

const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const AbastecimentoTab: React.FC<AbastecimentoTabProps> = ({ vehicle, drivers, fuelLogs, onAddFuelLog, currentDriverId }) => {
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        driverId: currentDriverId,
        recordType: 'Combustível',
        date: new Date().toISOString().split('T')[0],
        mileage: vehicle.mileage.toString(),
        fuelType: vehicle.fuelType,
        totalCost: '',
        liters: '',
        fuelStation: '',
    });
    const [pricePerLiter, setPricePerLiter] = useState('Automático');

    const photoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    useEffect(() => {
        if (formData.recordType === 'Arla 32') {
            setFormData(p => ({ ...p, fuelType: 'Arla-32' as FuelType }));
        } else {
            setFormData(p => ({ ...p, fuelType: vehicle.fuelType }));
        }
    }, [formData.recordType, vehicle.fuelType]);

    useEffect(() => {
        const total = parseFloat(formData.totalCost);
        const liters = parseFloat(formData.liters);
        if (!isNaN(total) && !isNaN(liters) && liters > 0) {
            setPricePerLiter((total / liters).toFixed(2));
        } else {
            setPricePerLiter('Automático');
        }
    }, [formData.totalCost, formData.liters]);
    
    const resetForm = () => {
        setFormData({
            driverId: currentDriverId, recordType: 'Combustível', date: new Date().toISOString().split('T')[0],
            mileage: vehicle.mileage.toString(), fuelType: vehicle.fuelType, totalCost: '', liters: '', fuelStation: '',
        });
        setPhotoFile(null);
        setReceiptFile(null);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog: Omit<FuelLog, 'id'> = {
            vehicleId: vehicle.id,
            driverId: formData.driverId,
            date: formData.date,
            liters: parseFloat(formData.liters),
            pricePerLiter: parseFloat(pricePerLiter),
            totalCost: parseFloat(formData.totalCost),
            mileage: parseInt(formData.mileage, 10),
            recordType: formData.recordType,
            fuelType: formData.fuelType,
            fuelStation: formData.fuelStation,
            receiptPhotoFilename: photoFile?.name,
            receiptFileFilename: receiptFile?.name,
        };
        onAddFuelLog(newLog);
        resetForm();
        setShowForm(false);
    };

    const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-800 disabled:cursor-not-allowed";
    const labelClasses = "block text-sm font-medium text-slate-300 mb-1";

    const fuelTypeOptions = formData.recordType === 'Combustível'
      ? VEHICLE_FUEL_TYPES.filter(f => f !== 'Arla-32')
      : ['Arla-32'];

    if (showForm) {
        return (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                <button type="button" onClick={() => setShowForm(false)} className="flex items-center text-blue-400 hover:text-blue-300 font-semibold mb-2">
                    <BackArrowIcon /> Voltar para Histórico
                </button>
                <h3 className="text-xl font-bold text-white">Novo Registro de Abastecimento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="driverId" className={labelClasses}>Motorista *</label>
                        <select name="driverId" value={formData.driverId} onChange={(e) => setFormData(p => ({...p, driverId: e.target.value}))} className={inputClasses} required>
                            <option value="" disabled>Selecione um motorista</option>
                            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="recordType" className={labelClasses}>Tipo de Registro *</label>
                        <select name="recordType" value={formData.recordType} onChange={(e) => setFormData(p => ({...p, recordType: e.target.value}))} className={inputClasses} required>
                            {RECORD_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="date" className={labelClasses}>Data *</label>
                        <input type="date" name="date" value={formData.date} onChange={(e) => setFormData(p => ({...p, date: e.target.value}))} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="fuelType" className={labelClasses}>Tipo de Combustível *</label>
                        <select 
                            name="fuelType" 
                            value={formData.fuelType} 
                            onChange={(e) => setFormData(p => ({...p, fuelType: e.target.value as FuelType}))} 
                            className={inputClasses} 
                            required 
                            disabled={formData.recordType === 'Arla 32'}
                        >
                            {fuelTypeOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="mileage" className={labelClasses}>Quilometragem *</label>
                        <input type="number" name="mileage" value={formData.mileage} onChange={(e) => setFormData(p => ({...p, mileage: e.target.value}))} className={inputClasses} required />
                    </div>
                     <div>
                        <label htmlFor="liters" className={labelClasses}>Litros *</label>
                        <input type="number" step="0.01" name="liters" value={formData.liters} onChange={(e) => setFormData(p => ({...p, liters: e.target.value}))} className={inputClasses} required />
                    </div>
                     <div>
                        <label htmlFor="totalCost" className={labelClasses}>Valor Total (R$) *</label>
                        <input type="number" step="0.01" name="totalCost" value={formData.totalCost} onChange={(e) => setFormData(p => ({...p, totalCost: e.target.value}))} className={inputClasses} required />
                    </div>
                     <div>
                        <label htmlFor="pricePerLiter" className={labelClasses}>Preço por Litro (R$)</label>
                        <input type="text" name="pricePerLiter" value={pricePerLiter} readOnly className={`${inputClasses}`} />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="fuelStation" className={labelClasses}>Posto de Combustível</label>
                        <input type="text" name="fuelStation" placeholder="Ex: Posto Shell" value={formData.fuelStation} onChange={(e) => setFormData(p => ({...p, fuelStation: e.target.value}))} className={inputClasses} />
                    </div>
                </div>
                <div>
                     <label className={labelClasses}>Cupom Fiscal</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="file" accept="image/*" capture="environment" ref={photoInputRef} onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="hidden" />
                        <button type="button" onClick={() => photoInputRef.current?.click()} className="w-full flex items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm">
                            <CameraIcon /> Tirar Foto
                        </button>
                         <input type="file" accept=".pdf,.jpg,.png" ref={fileInputRef} onChange={e => setReceiptFile(e.target.files?.[0] || null)} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm">
                            <UploadIcon /> Anexar Arquivo
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">PDF, JPG, PNG (máx. 10MB cada)</p>
                </div>
                 <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">Salvar</button>
                </div>
            </form>
        )
    }

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-200">Histórico de Abastecimento</h3>
                <button onClick={() => setShowForm(true)} className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm">
                    + Novo Registro
                </button>
            </div>
            {fuelLogs.length > 0 ? (
                <div className="overflow-x-auto max-h-80 pr-2">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400">
                            <tr>
                                <th className="p-2 font-normal">Data</th>
                                <th className="p-2 font-normal">Litros</th>
                                <th className="p-2 font-normal">Custo Total</th>
                                <th className="p-2 font-normal">Motorista</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-white">
                            {fuelLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="p-2">{formatDate(log.date)}</td>
                                    <td className="p-2">{log.liters.toFixed(2)} L</td>
                                    <td className="p-2">{formatCurrency(log.totalCost)}</td>
                                    <td className="p-2">{drivers.find(d => d.id === log.driverId)?.name || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <div className="text-center py-6 px-4 bg-slate-700/50 rounded-lg"><p className="text-slate-400">Nenhum abastecimento registrado.</p></div>}
        </div>
    );
};

export default AbastecimentoTab;