import React, { useState, useMemo, useEffect } from 'react';
import { Message, Driver, MaintenanceSchedule, MaintenanceStatus, Vehicle, Trip, FuelLog, AIInsight } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

// --- Global Types for this page ---
declare global {
  interface Window {
    jspdf: any;
    autoTable: any;
  }
}

// --- Helper Functions ---
const formatDate = (dateString: string) => dateString ? new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A';
const formatDateTime = (dateString?: string) => dateString ? new Date(dateString).toLocaleString('pt-BR') : 'N/A';


// Tab button component
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

// --- MESSAGES TAB ---
interface MessagesTabProps {
  messages: Message[];
  drivers: Driver[];
  onAddMessage: (message: Message) => void;
}

const MessagesTab: React.FC<MessagesTabProps> = ({ messages, drivers, onAddMessage }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'all',
    expiresAt: '',
  });

  const activeMessages = useMemo(() => {
    const now = new Date();
    return messages.filter(msg => new Date(msg.expiresAt + 'T23:59:59') > now).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages]);
  
  const getTargetName = (targetId: string) => {
    if (targetId === 'all') return 'Todos';
    const driver = drivers.find(d => d.id === targetId);
    return driver ? driver.name : 'Desconhecido';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.expiresAt) return;
    
    const newMessage: Message = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      author: 'Usuário Admin',
      createdAt: new Date().toISOString(),
      ...formData,
    };
    onAddMessage(newMessage);
    setFormData({ title: '', content: '', target: 'all', expiresAt: '' });
  };
  
  const inputClasses = "w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Enviar Nova Mensagem</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label htmlFor="title" className={labelClasses}>Título</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
          </div>
          <div>
            <label htmlFor="content" className={labelClasses}>Conteúdo</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} required />
          </div>
          <div>
            <label htmlFor="target" className={labelClasses}>Destinatário</label>
            <select id="target" name="target" value={formData.target} onChange={handleChange} className={inputClasses} required>
              <option value="all">Todos</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
          </div>
           <div>
            <label htmlFor="expiresAt" className={labelClasses}>Data de Expiração</label>
            <input type="date" id="expiresAt" name="expiresAt" value={formData.expiresAt} onChange={handleChange} className={inputClasses} required min={new Date().toISOString().split('T')[0]}/>
          </div>
          <button type="submit" className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Enviar Mensagem
          </button>
        </form>
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Mensagens Ativas</h3>
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {activeMessages.length > 0 ? activeMessages.map(msg => (
             <div key={msg.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
               <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-gray-800">{msg.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">Expira em {new Date(msg.expiresAt + 'T23:59:59').toLocaleDateString('pt-BR')}</span>
               </div>
               <p className="text-gray-600 mt-2 text-sm">{msg.content}</p>
               <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200 flex justify-between">
                <span>Para: <span className="font-medium text-gray-700">{getTargetName(msg.target)}</span></span>
                <span>Por: <span className="font-medium text-gray-700">{msg.author}</span></span>
               </div>
            </div>
          )) : <p className="text-gray-500 text-center py-4">Nenhuma mensagem ativa.</p>}
        </div>
      </div>
    </div>
  );
};


// --- SCHEDULES TAB ---
const MaintenanceStatusBadge: React.FC<{ status: MaintenanceStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
    let colorClasses = "";
    switch (status) {
        case MaintenanceStatus.Scheduled: colorClasses = "bg-blue-100 text-blue-800"; break;
        case MaintenanceStatus.InProgress: colorClasses = "bg-yellow-100 text-yellow-800"; break;
        case MaintenanceStatus.Completed: colorClasses = "bg-green-100 text-green-800"; break;
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

interface SchedulesTabProps {
  schedules: MaintenanceSchedule[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddSchedule: (schedule: MaintenanceSchedule) => void;
  onAddMessage: (message: Message) => void;
}

const SchedulesTab: React.FC<SchedulesTabProps> = ({ schedules, vehicles, drivers, onAddSchedule, onAddMessage }) => {
    const [formData, setFormData] = useState({
        vehicleId: '',
        workshop: '',
        workshopAddress: '',
        workshopPhone: '',
        dateTime: '',
        description: '',
    });
    const [shouldNotify, setShouldNotify] = useState(false);
    const [notificationTarget, setNotificationTarget] = useState('all');
    const [notificationMessage, setNotificationMessage] = useState('');

    const sortedSchedules = useMemo(() => {
        return [...schedules].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }, [schedules]);

    useEffect(() => {
        if (shouldNotify && formData.vehicleId && formData.dateTime && formData.workshop) {
            const vehicle = vehicles.find(v => v.id === formData.vehicleId);
            const date = new Date(formData.dateTime).toLocaleDateString('pt-BR');
            const time = new Date(formData.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            setNotificationMessage(`Lembrete de Manutenção: Levar o veículo ${vehicle?.brand} ${vehicle?.model} (Placa: ${vehicle?.licensePlate}) para a oficina ${formData.workshop} no dia ${date} às ${time}.`);
        }
    }, [shouldNotify, formData.vehicleId, formData.dateTime, formData.workshop, vehicles]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.vehicleId || !formData.workshop || !formData.dateTime || !formData.description) return;

        const newSchedule: MaintenanceSchedule = {
            id: `SCH-${Date.now().toString().slice(-6)}`,
            status: MaintenanceStatus.Scheduled,
            ...formData,
        };
        onAddSchedule(newSchedule);

        if (shouldNotify && notificationMessage) {
            const vehicle = vehicles.find(v => v.id === formData.vehicleId);
            const newMessage: Message = {
              id: `MSG-${Date.now().toString().slice(-6)}`,
              author: 'Sistema (Agendamento)',
              createdAt: new Date().toISOString(),
              expiresAt: formData.dateTime.split('T')[0],
              title: `Manutenção Agendada - Veículo ${vehicle?.id}`,
              content: notificationMessage,
              target: notificationTarget,
            };
            onAddMessage(newMessage);
        }

        setFormData({ vehicleId: '', workshop: '', workshopAddress: '', workshopPhone: '', dateTime: '', description: '' });
        setShouldNotify(false);
        setNotificationMessage('');
        setNotificationTarget('all');
    };
    
    const inputClasses = "w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Agendar Manutenção</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="vehicleId" className={labelClasses}>Veículo</label>
                        <select id="vehicleId" name="vehicleId" value={formData.vehicleId} onChange={handleChange} className={inputClasses} required>
                            <option value="" disabled>Selecione um veículo</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licensePlate})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="workshop" className={labelClasses}>Oficina / Prestador</label>
                        <input type="text" id="workshop" name="workshop" value={formData.workshop} onChange={handleChange} className={inputClasses} required />
                    </div>
                     <div>
                        <label htmlFor="workshopAddress" className={labelClasses}>Endereço da Oficina</label>
                        <input type="text" id="workshopAddress" name="workshopAddress" value={formData.workshopAddress} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="workshopPhone" className={labelClasses}>Telefone da Oficina</label>
                        <input type="tel" id="workshopPhone" name="workshopPhone" value={formData.workshopPhone} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="dateTime" className={labelClasses}>Data e Hora</label>
                        <input type="datetime-local" id="dateTime" name="dateTime" value={formData.dateTime} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="description" className={labelClasses}>Descrição do Serviço</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputClasses} h-20 resize-none`} required />
                    </div>
                    <div className="pt-2">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input type="checkbox" checked={shouldNotify} onChange={(e) => setShouldNotify(e.target.checked)} className="bg-gray-200 border-gray-300 rounded text-blue-600 focus:ring-blue-500"/>
                            Notificar motorista sobre o agendamento
                        </label>
                    </div>
                    {shouldNotify && (
                        <>
                         <div>
                            <label htmlFor="notificationTarget" className={labelClasses}>Destinatário da Notificação</label>
                            <select id="notificationTarget" name="notificationTarget" value={notificationTarget} onChange={(e) => setNotificationTarget(e.target.value)} className={inputClasses} required>
                              <option value="all">Todos</option>
                              {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>{driver.name}</option>
                              ))}
                            </select>
                         </div>
                         <div>
                            <label htmlFor="notificationMessage" className={labelClasses}>Mensagem de Notificação</label>
                            <textarea id="notificationMessage" name="notificationMessage" value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} className={`${inputClasses} h-24 resize-none`} required />
                        </div>
                        </>
                    )}
                    <button type="submit" className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                        Agendar Manutenção
                    </button>
                </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Agendamentos</h3>
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                    {sortedSchedules.length > 0 ? sortedSchedules.map(schedule => {
                        const vehicle = vehicles.find(v => v.id === schedule.vehicleId);
                        return (
                             <div key={schedule.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                               <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <h4 className="font-bold text-gray-800">{vehicle?.brand} {vehicle?.model} ({vehicle?.licensePlate})</h4>
                                    <p className="text-sm text-gray-500">{schedule.workshop}</p>
                                    {schedule.workshopAddress && <p className="text-xs text-gray-500">{schedule.workshopAddress}</p>}
                                     {schedule.workshopPhone && <p className="text-xs text-gray-500">{schedule.workshopPhone}</p>}
                                  </div>
                                  <MaintenanceStatusBadge status={schedule.status} />
                               </div>
                               <p className="text-gray-600 mt-2 text-sm">{schedule.description}</p>
                               <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200 flex justify-between">
                                <span>Agendado para: <span className="font-medium text-gray-700">{formatDateTime(schedule.dateTime)}</span></span>
                               </div>
                            </div>
                        )
                    }) : <p className="text-gray-500 text-center py-4">Nenhum agendamento encontrado.</p>}
                </div>
            </div>
        </div>
    );
};

// --- REPORTS TAB ---
interface ReportsTabProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  schedules: MaintenanceSchedule[];
  messages: Message[];
  trips: Trip[];
  fuelLogs: FuelLog[];
}
const ReportsTab: React.FC<ReportsTabProps> = ({ vehicles, drivers, schedules, messages, trips, fuelLogs }) => {
    const [reportType, setReportType] = useState('vehicles');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [specificId, setSpecificId] = useState('all');
    const [reportData, setReportData] = useState<any[] | null>(null);
    
    const handleGenerateReport = () => {
        let data: any[] = [];
        
        const inDateRange = (dateStr: string) => {
            if (!startDate || !endDate) return true;
            const itemDate = new Date(dateStr).getTime();
            const start = new Date(startDate).getTime();
            const end = new Date(endDate + 'T23:59:59').getTime();
            return itemDate >= start && itemDate <= end;
        };
        
        const getDriverName = (driverId: string) => {
          if(driverId === 'all') return 'Todos';
          return drivers.find(d => d.id === driverId)?.name || 'N/A';
        }
        const getVehicleName = (vehicleId: string) => {
            const v = vehicles.find(v => v.id === vehicleId);
            return v ? `${v.brand} ${v.model} (${v.licensePlate})` : 'N/A';
        };

        switch (reportType) {
            case 'vehicles':
                data = vehicles.map(v => ({
                    'ID Veículo': v.id, 'Marca': v.brand, 'Modelo': v.model, 'Placa': v.licensePlate, 'Ano': v.year, 'Tipo': v.vehicleType, 'Combustível': v.fuelType, 'Status': v.status
                }));
                 if (specificId !== 'all') data = data.filter(item => item['ID Veículo'] === specificId);
                break;
            case 'drivers':
                 data = drivers.map(d => ({
                    'Nome': d.name, 'Categoria': d.role, 'Email': d.email, 'Telefone': d.phone, 'CNH': d.cnhNumber, 'Cat. CNH': d.cnhCategory, 'Venc. CNH': formatDate(d.cnhExpiration)
                }));
                if (specificId !== 'all') data = data.filter(item => item['Nome'] === drivers.find(d=>d.id === specificId)?.name);
                break;
            case 'trips':
                data = trips
                    .filter(trip => inDateRange(trip.startTime))
                    .filter(trip => specificId === 'all' || trip.vehicleId === specificId || trip.driverId === specificId)
                    .map(trip => ({
                        'Veículo': getVehicleName(trip.vehicleId), 'Motorista': getDriverName(trip.driverId), 'Origem': trip.origin, 'Destino': trip.destination, 'Distância (km)': (trip.endMileage ?? trip.startMileage) - trip.startMileage, 'Início': formatDateTime(trip.startTime), 'Fim': formatDateTime(trip.endTime)
                    }));
                break;
            case 'fuel-logs':
                data = fuelLogs
                    .filter(log => inDateRange(log.date))
                    .filter(log => specificId === 'all' || log.vehicleId === specificId || log.driverId === specificId)
                    .map(log => ({
                        'Data': formatDate(log.date), 'Veículo': getVehicleName(log.vehicleId), 'Motorista': getDriverName(log.driverId), 'Litros': log.liters.toFixed(2), 'Preço/Litro': `R$ ${log.pricePerLiter.toFixed(2)}`, 'Custo Total': `R$ ${log.totalCost.toFixed(2)}`
                    }));
                break;
            case 'maintenance':
                data = schedules
                    .filter(s => inDateRange(s.dateTime))
                    .filter(s => specificId === 'all' || s.vehicleId === specificId)
                    .map(s => ({
                        'Data': formatDateTime(s.dateTime), 'Veículo': getVehicleName(s.vehicleId), 'Oficina': s.workshop, 'Serviço': s.description, 'Status': s.status
                    }));
                break;
            case 'communications':
                data = messages
                    .filter(m => inDateRange(m.createdAt))
                    .filter(m => specificId === 'all' || m.target === specificId)
                    .map(m => ({
                        'Data': formatDateTime(m.createdAt), 'Título': m.title, 'Destinatário': getDriverName(m.target), 'Autor': m.author, 'Expira em': formatDate(m.expiresAt)
                    }));
                break;
        }
        setReportData(data);
    };

    const handleDownloadPdf = () => {
        if (!reportData || reportData.length === 0) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const headers = Object.keys(reportData[0]);
        const body = reportData.map(row => Object.values(row));
        
        (doc as any).autoTable({ head: [headers], body });
        doc.save(`relatorio_${reportType}.pdf`);
    };

    const handlePrint = () => {
        window.print();
    };

    const reportHeaders = reportData && reportData.length > 0 ? Object.keys(reportData[0]) : [];
    
    const inputClasses = "w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md no-print">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Gerar Relatório</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
                        <select value={reportType} onChange={e => { setReportType(e.target.value); setSpecificId('all'); setReportData(null); }} className={inputClasses}>
                            <option value="vehicles">Veículos</option>
                            <option value="drivers">Motoristas</option>
                            <option value="trips">Viagens</option>
                            <option value="fuel-logs">Combustíveis</option>
                            <option value="maintenance">Manutenções</option>
                            <option value="communications">Comunicações</option>
                        </select>
                    </div>

                    {(reportType !== 'vehicles' && reportType !== 'drivers') && (
                        <>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                           <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClasses} />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                           <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClasses} />
                        </div>
                        </>
                    )}
                    
                    {['maintenance', 'trips', 'fuel-logs', 'vehicles'].includes(reportType) && (
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Veículo Específico</label>
                             <select value={specificId} onChange={e => setSpecificId(e.target.value)} className={inputClasses}>
                                <option value="all">Todos os Veículos</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licensePlate})</option>)}
                            </select>
                        </div>
                    )}

                    {['communications', 'trips', 'fuel-logs', 'drivers'].includes(reportType) && !['vehicles'].includes(reportType) && (
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Motorista Específico</label>
                             <select value={specificId} onChange={e => setSpecificId(e.target.value)} className={inputClasses}>
                                <option value="all">Todos os Motoristas</option>
                                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className={ (reportType === 'vehicles' || reportType === 'drivers') ? 'lg:col-start-3 lg:col-span-2' : 'lg:col-start-4'}>
                        <button onClick={handleGenerateReport} className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                            Gerar
                        </button>
                    </div>
                </div>
            </div>

            {reportData && (
                <div className="bg-white p-6 rounded-xl shadow-md print-container" id="report-content">
                    <div className="flex justify-between items-center mb-4 no-print">
                        <h3 className="text-xl font-semibold text-gray-800">Resultado do Relatório</h3>
                        <div className="flex gap-2">
                             <button onClick={handlePrint} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm">Imprimir</button>
                            <button onClick={handleDownloadPdf} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm">Baixar PDF</button>
                        </div>
                    </div>
                     {reportData.length > 0 ? (
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                                <thead className="border-b border-gray-200 text-sm text-gray-600">
                                    <tr>
                                        {reportHeaders.map(header => <th key={header} className="p-3">{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reportData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            {Object.values(row).map((cell: any, cellIndex) => (
                                                <td key={cellIndex} className="p-3 text-gray-700 text-sm">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-500 text-center py-8">Nenhum dado encontrado para os filtros selecionados.</p>}
                </div>
            )}
        </div>
    );
};

// --- AI INSIGHTS TAB ---
interface AIInsightsTabProps {
    vehicles: Vehicle[];
    drivers: Driver[];
    schedules: MaintenanceSchedule[];
    trips: Trip[];
    fuelLogs: FuelLog[];
}
const AIInsightsTab: React.FC<AIInsightsTabProps> = ({ vehicles, drivers, schedules, trips, fuelLogs }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<AIInsight | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const schema = {
                type: Type.OBJECT,
                properties: {
                    generalSummary: { type: Type.STRING },
                    costOpportunities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                vehicleId: { type: Type.STRING },
                            },
                        },
                    },
                    efficiencyInsights: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                        },
                    },
                    maintenanceAlerts: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                vehicleId: { type: Type.STRING },
                            },
                        },
                    },
                },
            };

            const allFleetData = { vehicles, drivers, schedules, trips, fuelLogs };
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analise os seguintes dados da frota e forneça insights. Aja como um especialista em gestão de frotas. 
                           Forneça um resumo geral, oportunidades de redução de custos (como alto consumo de combustível), 
                           insights de eficiência (como otimização de rotas) e alertas de manutenção proativos.
                           Dados: ${JSON.stringify(allFleetData)}`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
            
            const parsedInsights: AIInsight = JSON.parse(response.text);
            setInsights(parsedInsights);

        } catch (e) {
            console.error("Erro ao gerar insights:", e);
            setError("Não foi possível gerar os insights. Verifique a chave de API e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const getVehicleName = (vehicleId: string) => {
        const v = vehicles.find(v => v.id === vehicleId);
        return v ? `${v.brand} ${v.model} (${v.licensePlate})` : vehicleId;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Insights de Inteligência Artificial</h3>
            <p className="text-gray-500 mb-6">Receba análises e recomendações automáticas para otimizar sua frota.</p>

            {!insights && !isLoading && !error && (
                <div className="text-center py-10">
                    <button onClick={handleGenerateInsights} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                        Gerar Análise com IA
                    </button>
                </div>
            )}
            
            {isLoading && (
                 <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Analisando dados da frota... Isso pode levar alguns segundos.</p>
                </div>
            )}

            {error && (
                 <div className="text-center py-10 bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-700 font-semibold">Erro na Análise</p>
                    <p className="text-gray-600 mt-2">{error}</p>
                     <button onClick={handleGenerateInsights} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm">
                        Tentar Novamente
                    </button>
                </div>
            )}

            {insights && (
                <div className="space-y-8">
                     <div>
                        <h4 className="text-lg font-semibold text-blue-600 mb-3">Resumo Geral da Frota</h4>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">{insights.generalSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                           <h4 className="text-lg font-semibold text-yellow-600">Oportunidades de Custo</h4>
                            {insights.costOpportunities.map((item, i) => (
                                <div key={i} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    <p className="text-xs text-yellow-700 mt-2">Veículo: {getVehicleName(item.vehicleId)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-lg font-semibold text-green-600">Insights de Eficiência</h4>
                           {insights.efficiencyInsights.map((item, i) => (
                                <div key={i} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                </div>
                            ))}
                        </div>
                         <div className="space-y-4">
                           <h4 className="text-lg font-semibold text-red-600">Alertas de Manutenção</h4>
                           {insights.maintenanceAlerts.map((item, i) => (
                                <div key={i} className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                     <p className="text-xs text-red-700 mt-2">Veículo: {getVehicleName(item.vehicleId)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center pt-6">
                         <button onClick={handleGenerateInsights} className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm">
                            Gerar Nova Análise
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN ADMIN PAGE ---
interface AdminPageProps {
  messages: Message[];
  drivers: Driver[];
  onAddMessage: (message: Message) => void;
  vehicles: Vehicle[];
  schedules: MaintenanceSchedule[];
  onAddSchedule: (schedule: MaintenanceSchedule) => void;
  trips: Trip[];
  fuelLogs: FuelLog[];
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const { messages, drivers, onAddMessage, vehicles, schedules, onAddSchedule, trips, fuelLogs } = props;
  const [activeTab, setActiveTab] = useState('Mensagens');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Mensagens':
        return <MessagesTab messages={messages} drivers={drivers} onAddMessage={onAddMessage} />;
      case 'Agendamentos':
        return <SchedulesTab schedules={schedules} vehicles={vehicles} drivers={drivers} onAddSchedule={onAddSchedule} onAddMessage={onAddMessage} />;
      case 'Relatórios':
        return <ReportsTab vehicles={vehicles} drivers={drivers} schedules={schedules} messages={messages} trips={trips} fuelLogs={fuelLogs} />;
      case 'Insights de IA':
        return <AIInsightsTab vehicles={vehicles} drivers={drivers} schedules={schedules} trips={trips} fuelLogs={fuelLogs} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <header className="no-print">
        <h1 className="text-3xl font-bold text-gray-800">Administrativo</h1>
        <p className="text-gray-500 mt-1">Gerencie mensagens, agendamentos e relatórios.</p>
      </header>
      
      <div className="flex space-x-1 sm:space-x-2 border-b border-gray-200 pb-2 mb-6 overflow-x-auto no-print">
        <TabButton label="Mensagens" isActive={activeTab === 'Mensagens'} onClick={() => setActiveTab('Mensagens')} />
        <TabButton label="Agendamentos" isActive={activeTab === 'Agendamentos'} onClick={() => setActiveTab('Agendamentos')} />
        <TabButton label="Relatórios" isActive={activeTab === 'Relatórios'} onClick={() => setActiveTab('Relatórios')} />
        <TabButton label="Insights de IA" isActive={activeTab === 'Insights de IA'} onClick={() => setActiveTab('Insights de IA')} />
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AdminPage;