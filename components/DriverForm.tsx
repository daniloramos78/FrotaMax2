import React, { useState, useEffect } from 'react';
import { Driver, DriverRole, CNHCombinedCategory } from '../types';

interface DriverFormProps {
  onSave: (driver: Driver) => void;
  onCancel: () => void;
  initialData?: Driver | null;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    cnhNumber: '',
    cnhExpiration: '',
    role: DriverRole.Driver,
    cnhCategory: CNHCombinedCategory.A,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        cnhNumber: initialData.cnhNumber,
        cnhExpiration: initialData.cnhExpiration,
        role: initialData.role,
        cnhCategory: initialData.cnhCategory,
      });
    } else {
        setFormData({
            id: '', name: '', email: '', phone: '', address: '', cnhNumber: '',
            cnhExpiration: '', role: DriverRole.Driver, cnhCategory: CNHCombinedCategory.A
        });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const driverData: Driver = {
      ...formData,
      id: formData.id || `DRV-${Date.now().toString().slice(-6)}`,
    };
    onSave(driverData);
  };

  const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";
  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Nome Completo</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="role" className={labelClasses}>Categoria Profissional</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputClasses} required>
            {Object.values(DriverRole).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>E-mail</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>Telefone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="address" className={labelClasses}>Endereço</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="cnhNumber" className={labelClasses}>Número da CNH</label>
          <input type="text" id="cnhNumber" name="cnhNumber" value={formData.cnhNumber} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="cnhExpiration" className={labelClasses}>Vencimento da CNH</label>
          <input type="date" id="cnhExpiration" name="cnhExpiration" value={formData.cnhExpiration} onChange={handleChange} className={inputClasses} required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cnhCategory" className={labelClasses}>Categoria da CNH</label>
          <select id="cnhCategory" name="cnhCategory" value={formData.cnhCategory} onChange={handleChange} className={inputClasses} required>
            {Object.values(CNHCombinedCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Motorista'}
        </button>
      </div>
    </form>
  );
};

export default DriverForm;