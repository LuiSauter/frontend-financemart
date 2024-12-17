'use client'
import { useBalance } from "@/context/BalanceContext";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Balance {
  assets: number;
  liabilities: number;
  equity: number;
}

const Patrimonial = () => {
  const { balance }: { balance: Balance } = useBalance();
  const [historicalData, setHistoricalData] = useState([]);
  const [comparison, setComparison] = useState({});

  useEffect(() => {
    // Ejemplo de datos históricos
    setHistoricalData([
      { year: 2021, assets: 100000, liabilities: 50000, equity: 50000 },
      { year: 2022, assets: 120000, liabilities: 60000, equity: 60000 },
    ]);
  }, []);

  useEffect(() => {
    if (historicalData.length > 0 && balance) {
      const lastYearData = historicalData[historicalData.length - 1];

      setComparison({
        assetsChange: {
          absolute: (balance.assets && lastYearData.assets) ? balance.assets - lastYearData.assets : 0,
          relative: (balance.assets && lastYearData.assets) ? ((balance.assets - lastYearData.assets) / lastYearData.assets) * 100 : 0,
        },
        liabilitiesChange: {
          absolute: (balance.liabilities && lastYearData.liabilities) ? balance.liabilities - lastYearData.liabilities : 0,
          relative: (balance.liabilities && lastYearData.liabilities) ? ((balance.liabilities - lastYearData.liabilities) / lastYearData.liabilities) * 100 : 0,
        },
        equityChange: {
          absolute: (balance.equity && lastYearData.equity) ? balance.equity - lastYearData.equity : 0,
          relative: (balance.equity && lastYearData.equity) ? ((balance.equity - lastYearData.equity) / lastYearData.equity) * 100 : 0,
        },
      });
    }
  }, [historicalData, balance]);

  if (!balance) {
    return <div className="text-center py-6">No se ha ingresado un balance general.</div>;
  }

  const { assets, liabilities, equity } = balance;

  const currentRatio = (assets && liabilities) ? (assets / liabilities).toFixed(2) : 0;
  const debtToEquityRatio = (liabilities && equity) ? ((liabilities / equity)).toFixed(2) : 0;

  const generateConclusions = () => {
    const conclusions = [];

    if (comparison.assetsChange?.absolute > 0) {
      conclusions.push(`Los activos han aumentado en ${comparison.assetsChange?.absolute} unidades, lo que representa un ${comparison.assetsChange?.relative?.toFixed(2)}% de incremento respecto al año anterior.`);
    } else {
      conclusions.push(`Los activos han disminuido en ${comparison.assetsChange?.absolute} unidades, lo que representa un ${comparison.assetsChange?.relative?.toFixed(2)}% de decremento respecto al año anterior.`);
    }

    if (comparison.liabilitiesChange?.absolute > 0) {
      conclusions.push(`Los pasivos han aumentado en ${comparison.liabilitiesChange?.absolute} unidades, lo que representa un ${comparison.liabilitiesChange?.relative?.toFixed(2)}% de incremento respecto al año anterior.`);
    } else {
      conclusions.push(`Los pasivos han disminuido en ${comparison.liabilitiesChange?.absolute} unidades, lo que representa un ${comparison.liabilitiesChange?.relative?.toFixed(2)}% de decremento respecto al año anterior.`);
    }

    if (comparison.equityChange?.absolute > 0) {
      conclusions.push(`El patrimonio ha aumentado en ${comparison.equityChange?.absolute} unidades, lo que representa un ${comparison.equityChange?.relative?.toFixed(2)}% de incremento respecto al año anterior.`);
    } else {
      conclusions.push(`El patrimonio ha disminuido en ${comparison.equityChange?.absolute} unidades, lo que representa un ${comparison.equityChange?.relative?.toFixed(2)}% de decremento respecto al año anterior.`);
    }

    if (currentRatio > 1) {
      conclusions.push(`La razón corriente es de ${currentRatio}, lo que indica que la empresa tiene suficientes activos para cubrir sus pasivos a corto plazo.`);
    } else {
      conclusions.push(`La razón corriente es de ${currentRatio}, lo que indica que la empresa puede tener dificultades para cubrir sus pasivos a corto plazo.`);
    }

    if (debtToEquityRatio > 1) {
      conclusions.push(`La razón de deuda a patrimonio es de ${debtToEquityRatio}, lo que indica que la empresa tiene más deuda que patrimonio.`);
    } else {
      conclusions.push(`La razón de deuda a patrimonio es de ${debtToEquityRatio}, lo que indica que la empresa tiene más patrimonio que deuda.`);
    }

    return conclusions;
  };

  const conclusions = generateConclusions();

  return (
    <div className="container mx-auto p-6  rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">Análisis Patrimonial</h1>

      <div className="mb-8  p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Análisis Estático</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Activos</h3>
            <p className="text-2xl font-bold">{assets ?? 0}</p>
          </div>
          <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Pasivos</h3>
            <p className="text-2xl font-bold">{liabilities ?? 0}</p>
          </div>
          <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Patrimonio</h3>
            <p className="text-2xl font-bold">{equity ?? 0}</p>
          </div>
          <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Razón Corriente</h3>
            <p className="text-2xl font-bold">{currentRatio ?? 0}</p>
          </div>
          <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Razón de Deuda a Patrimonio</h3>
            <p className="text-2xl font-bold">{debtToEquityRatio ?? 0}</p>
          </div>
        </div>
      </div>

      {historicalData.length > 0 && (
        <div className="mb-8  p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Análisis Dinámico</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="assets" stroke="#8884d8" />
              <Line type="monotone" dataKey="liabilities" stroke="#82ca9d" />
              <Line type="monotone" dataKey="equity" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">Cambio Absoluto en Activos</h3>
              <p className="text-2xl font-bold">{comparison.assetsChange?.absolute ?? 0}</p>
            </div>
            <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">Cambio Relativo en Activos</h3>
              <p className="text-2xl font-bold">{comparison.assetsChange?.relative?.toFixed(2) ?? 0}%</p>
            </div>
            <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">Cambio Absoluto en Pasivos</h3>
              <p className="text-2xl font-bold">{comparison.liabilitiesChange?.absolute ?? 0}</p>
            </div>
            <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">Cambio Relativo en Pasivos</h3>
              <p className="text-2xl font-bold">{comparison.liabilitiesChange?.relative?.toFixed(2) ?? 0} %</p>
            </div>
            <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">Cambio Absoluto en Patrimonio</h3>
              <p className="text-2xl font-bold">{comparison.equityChange?.absolute ?? 0}</p>
            </div>
            <div className="bg-zinc-800  text-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">Cambio Relativo en Patrimonio</h3>
              <p className="text-2xl font-bold">{comparison.equityChange?.relative?.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8  p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Datos Históricos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="assets" fill="#8884d8" />
            <Bar dataKey="liabilities" fill="#82ca9d" />
            <Bar dataKey="equity" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
        <ul className="list-disc ml-6 mt-4">
          {historicalData.map((data, index) => (
            <li key={index}>
              Año {data.year}: Activos: {data.assets}, Pasivos: {data.liabilities}, Patrimonio: {data.equity}
            </li>
          ))}
        </ul>
      </div>

      <div className=" p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Conclusiones</h2>
        <ul className="list-disc ml-6">
          {conclusions.map((conclusion, index) => (
            <li key={index}>{conclusion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Patrimonial;