import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationDataPoint } from '../types';

interface Props {
  data: SimulationDataPoint[];
}

const SimulationChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Expression Simulation (Deterministic)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#64748b" label={{ value: 'Time (min)', position: 'insideBottomRight', offset: -10 }} />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <Legend />
          <Line type="monotone" dataKey="mRNA" stroke="#8884d8" strokeWidth={2} dot={false} name="mRNA Level" />
          <Line type="monotone" dataKey="protein" stroke="#82ca9d" strokeWidth={2} dot={false} name="Protein Level" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimulationChart;
