/* Updated TrafficPredictor.jsx
   - Congestion = static per lane (no future 3-minute prediction)
   - White changed to #c3d871
   - Blue changed to #7bcdd5
*/

import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle, TrendingUp, Car } from 'lucide-react';

const TrafficPredictor = () => {
  const [sensorData, setSensorData] = useState([0, 0, 0]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef(null);

  const LANES = ['Lane 1 (Left)', 'Lane 2 (Center)', 'Lane 3 (Right)'];
  const SENSOR_SPACING = 15;

  const generateLaneReading = (time, laneIndex) => {
    const hour = time % 24;
    let baseOccupancy = 0.3;

    if (laneIndex === 0 && hour >= 7 && hour <= 9) baseOccupancy = 0.75;
    else if (laneIndex === 1) baseOccupancy = hour >= 7 && hour <= 19 ? 0.7 : 0.4;
    else if (laneIndex === 2 && hour >= 17 && hour <= 19) baseOccupancy = 0.8;

    const noise = (Math.random() - 0.5) * 0.15;
    return Math.max(0, Math.min(1, baseOccupancy + noise));
  };

  const simulateSensorData = () => {
    const currentHour = new Date().getHours() + Math.random() * 0.5;

    const newReading = [
      generateLaneReading(currentHour, 0),
      generateLaneReading(currentHour, 1),
      generateLaneReading(currentHour, 2)
    ];

    setSensorData(newReading);

    setHistoricalData(prev => [
      ...prev.slice(-15),
      {
        time: new Date().toLocaleTimeString(),
        lane1: parseFloat((newReading[0] * 100).toFixed(1)),
        lane2: parseFloat((newReading[1] * 100).toFixed(1)),
        lane3: parseFloat((newReading[2] * 100).toFixed(1))
      }
    ]);
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simulateSensorData();
      intervalRef.current = setInterval(simulateSensorData, 2500);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#7bcdd5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-lg shadow-xl p-6 mb-6" style={{ backgroundColor: '#c3d871' }}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Activity className="text-indigo-600" />
            Smart Traffic Lane Congestion Monitor
          </h1>
          <p className="text-gray-700">Static congestion display based on 3 ultrasonic sensors ({SENSOR_SPACING}cm spacing)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#c3d871' }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Simulation Control</h2>

            <button
              onClick={toggleSimulation}
              className={`w-full py-3 rounded-lg font-semibold transition text-white ${
                isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Live Simulation'}
            </button>
          </div>

          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#c3d871' }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Static Lane Congestion</h2>
            <p className="text-gray-700">This shows the real-time congestion percentage for each lane — not future predictions.</p>
          </div>
        </div>

        <div className="rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: '#c3d871' }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Car /> Live Sensor Readings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LANES.map((lane, idx) => (
              <div key={idx} className="border-2 rounded-lg p-4" style={{ background: '#f7fadb' }}>
                <h3 className="font-semibold text-gray-700 mb-2">{lane}</h3>
                <div className="text-center">
                  <p className="text-4xl font-bold text-indigo-700">
                    {(sensorData[idx] * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Occupancy</p>
                </div>
                <div className="mt-3 bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${sensorData[idx] * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {historicalData.length > 0 && (
          <div className="rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: '#c3d871' }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <TrendingUp /> Historical Traffic Patterns
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="lane1" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="lane2" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="lane3" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficPredictor;
