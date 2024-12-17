'use client'
import { useBalance } from '@/context/BalanceContext';
import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Financial = () => {
  const { balance } = useBalance();

  const [data, setData] = useState({
    activoCirculante: 0,
    activoFijo: 0,
    otrosActivos: 0,
    pasivoCortoPlazo: 0,
    pasivoLargoPlazo: 0,
    patrimonio: 0,
    ventasNetas: 0,
    comprasCosto: 0,
    stock: 0,
    clientes: 0,
    proveedores: 0,
    ...balance.entries[0]
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const calculateRatios = () => {
    const {
      activoCirculante,
      activoFijo,
      otrosActivos,
      pasivoCortoPlazo,
      pasivoLargoPlazo,
      patrimonio,
      ventasNetas,
      comprasCosto,
      stock,
      clientes,
      proveedores
    } = data;

    const AC = parseFloat(activoCirculante);
    const PC = parseFloat(pasivoCortoPlazo);
    const AF = parseFloat(activoFijo);
    const OA = parseFloat(otrosActivos);
    const PCLP = parseFloat(pasivoLargoPlazo);
    const PAT = parseFloat(patrimonio);
    const VN = parseFloat(ventasNetas);
    const CC = parseFloat(comprasCosto);
    const ST = parseFloat(stock);
    const CL = parseFloat(clientes);
    const PR = parseFloat(proveedores);

    const razonFuncionamiento = AC / PC;
    const razonTesoreria = (AC - ST) / PC;
    const razonDisponible = (AC - ST - CL) / PC;
    const capitalTrabajoNeto = AC - PC;
    const capitalTrabajoNetoSobreAC = capitalTrabajoNeto / AC;
    const capitalTrabajoNetoSobreST = capitalTrabajoNeto / ST;
    const rotacionActivoCirculante = VN / AC;
    const plazoPromedioRotacionStock = 360 / (CC / ST);
    const rotacionClientes = VN / CL;
    const plazoPromedioCobroClientes = 360 / rotacionClientes;
    const rotacionProveedores = CC / PR;
    const plazoPromedioPagoProveedores = 360 / rotacionProveedores;

    return {
      razonFuncionamiento,
      razonTesoreria,
      razonDisponible,
      capitalTrabajoNeto,
      capitalTrabajoNetoSobreAC,
      capitalTrabajoNetoSobreST,
      rotacionActivoCirculante,
      plazoPromedioRotacionStock,
      plazoPromedioCobroClientes,
      plazoPromedioPagoProveedores
    };
  };

  const ratios = calculateRatios();

  const barData = {
    labels: ['Razón de Funcionamiento', 'Razón de Tesorería', 'Razón Disponible'],
    datasets: [
      {
        label: 'Ratios de Liquidez',
        data: [ratios.razonFuncionamiento, ratios.razonTesoreria, ratios.razonDisponible],
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }
    ]
  };

  const lineData = {
    labels: ['Activo Circulante', 'Activo Fijo', 'Otros Activos', 'Pasivo Corto Plazo', 'Pasivo Largo Plazo', 'Patrimonio'],
    datasets: [
      {
        label: 'Componentes Financieros',
        data: [
          parseFloat(data.activoCirculante),
          parseFloat(data.activoFijo),
          parseFloat(data.otrosActivos),
          parseFloat(data.pasivoCortoPlazo),
          parseFloat(data.pasivoLargoPlazo),
          parseFloat(data.patrimonio)
        ],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)'
      }
    ]
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Análisis Financiero</h1>
      <div className="mb-4">
        <div className="shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-2">Entradas Financieras</h2>
          <AlertDialog>
            <AlertDialogTrigger className='bg-primary rounded-lg px-4 py-2'>Ingresar datos</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ingresar Datos Financieros</AlertDialogTitle>
                <AlertDialogDescription>
                  Ingrese los datos financieros necesarios para realizar el análisis.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-200">Activo Circulante</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="activoCirculante" value={data.activoCirculante} placeholder="Activo Circulante" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Activo Fijo</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="activoFijo" value={data.activoFijo} placeholder="Activo Fijo" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Otros Activos</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="otrosActivos" value={data.otrosActivos} placeholder="Otros Activos" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Pasivo Corto Plazo</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="pasivoCortoPlazo" value={data.pasivoCortoPlazo} placeholder="Pasivo Corto Plazo" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Pasivo Largo Plazo</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="pasivoLargoPlazo" value={data.pasivoLargoPlazo} placeholder="Pasivo Largo Plazo" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Patrimonio</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="patrimonio" value={data.patrimonio} placeholder="Patrimonio" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Ventas Netas</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="ventasNetas" value={data.ventasNetas} placeholder="Ventas Netas" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Compras al Costo</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="comprasCosto" value={data.comprasCosto} placeholder="Compras al Costo" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Stock</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="stock" value={data.stock} placeholder="Stock" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Clientes</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="clientes" value={data.clientes} placeholder="Clientes" onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200">Proveedores</label>
                  <input className="w-full px-3 py-2 rounded bg-zinc-700" type="number" name="proveedores" value={data.proveedores} placeholder="Proveedores" onChange={handleChange} />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel type='button' className='text-black'>Cancel</AlertDialogCancel>
                  <AlertDialogAction type='submit'>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mb-4">
        <div className="shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-2">Resultados del Análisis</h2>
          <p>Razón de Funcionamiento: {ratios.razonFuncionamiento.toFixed(2)}</p>
          <p>Razón de Tesorería: {ratios.razonTesoreria.toFixed(2)}</p>
          <p>Razón Disponible: {ratios.razonDisponible.toFixed(2)}</p>
          <p>Capital de Trabajo Neto: {ratios.capitalTrabajoNeto.toFixed(2)}</p>
          <p>Capital de Trabajo Neto / Activo Circulante: {ratios.capitalTrabajoNetoSobreAC.toFixed(2)}</p>
          <p>Capital de Trabajo Neto / Stock: {ratios.capitalTrabajoNetoSobreST.toFixed(2)}</p>
          <p>Rotación del Activo Circulante: {ratios.rotacionActivoCirculante.toFixed(2)}</p>
          <p>Plazo Promedio de Rotación del Stock: {ratios.plazoPromedioRotacionStock.toFixed(2)} días</p>
          <p>Plazo Promedio de Cobro a Clientes: {ratios.plazoPromedioCobroClientes.toFixed(2)} días</p>
          <p>Plazo Promedio de Pago a Proveedores: {ratios.plazoPromedioPagoProveedores.toFixed(2)} días</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-2">Gráficos</h2>
          <div className="mb-4">
            <Bar data={barData} />
          </div>
          <div className="mb-4">
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;