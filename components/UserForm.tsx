import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface UserFormProps {
  onSave: (user: User) => void;
  onCancel: () => void;
  initialData?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    role: UserRole.Manager,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        email: initialData.email,
        role: initialData.role,
      });
    } else {
        setFormData({
            id: '', email: '', role: UserRole.Manager,
        });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: User = {
      ...formData,
      id: formData.id || `USR-${Date.now().toString().slice(-6)}`,
    };
    onSave(userData);
  };

  const inputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";
  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClasses}>E-mail do Usuário</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="role" className={labelClasses}>Permissão</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputClasses} required>
            {Object.values(UserRole).filter(role => role !== UserRole.SuperAdmin).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">A permissão de Super Admin não pode ser atribuída.</p>
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
          {isEditing ? 'Salvar Alterações' : 'Adicionar Usuário'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
