import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Vehicle, VehicleStatus } from '../types';
import { STATUS_COLORS } from '../constants';

const COLORS = {
    [VehicleStatus.Available]: STATUS_COLORS[VehicleStatus.Available].hex,
    [VehicleStatus.InUse]: STATUS_COLORS[VehicleStatus.InUse].hex,
    [VehicleStatus.Maintenance]: STATUS_COLORS[VehicleStatus.Maintenance].hex,
};


interface VehicleStatusChartProps {
    vehicles: Vehicle[];
}

const VehicleStatusChart: React.FC<VehicleStatusChartProps> = ({ vehicles }) => {
    const data = Object.values(VehicleStatus).map(status => ({
        name: status,
        value: vehicles.filter(v => v.status === status).length,
    })).filter(item => item.value > 0);

    return (
        <div className="w-full h-64">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as VehicleStatus]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E5E7EB',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: '#374151' }} 
                    />
                     <Legend iconType="circle" wrapperStyle={{color: "#374151", paddingTop: "10px"}} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VehicleStatusChart;