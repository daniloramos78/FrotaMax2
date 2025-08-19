
import React from 'react';
import { Alert, AlertLevel } from '../types';

const AlertIcon: React.FC<{ level: AlertLevel }> = ({ level }) => {
    let icon;
    let color = '';

    switch (level) {
        case AlertLevel.Critical:
            color = 'text-red-500';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
            break;
        case AlertLevel.Warning:
            color = 'text-amber-500';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            break;
        case AlertLevel.Info:
            color = 'text-blue-500';
            icon = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            break;
    }
    return <div className={color}>{icon}</div>;
}

const ActionIcon = () => (
    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </div>
);


const AlertsList: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
    return (
        <div className="space-y-4">
            {alerts.length > 0 ? (
                alerts.map(alert => (
                    <div key={alert.id} className="flex items-center p-4 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0">
                            <AlertIcon level={alert.level} />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="font-semibold text-gray-800">
                                {alert.message} - <span className="font-normal text-gray-600">Veículo {alert.vehicleId}</span>
                            </p>
                        </div>
                         <button className="flex-shrink-0">
                            <ActionIcon />
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center py-4">Nenhum alerta recente.</p>
            )}
        </div>
    );
};

export default AlertsList;