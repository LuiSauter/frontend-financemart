'use client'
import BalanceSheetCharts from "@/components/pages/BalanceSheetCharts";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBalance } from "@/context/BalanceContext";
import { API_BASEURL } from "@/lib/api.utils";
import { RootState } from "@/lib/store";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// function to get index month
// const monthIndex = months.findIndex((month) => month === period.month);

const AVAILABLE_ASSETS_ACCOUNT = {
  CASH: "caja o efectivo",
  PETTY_CASH: "caja chica",
  BANCK: "banco",
  CHECKING_ACCOUNT: "cuenta corriente",
  SAVINGS_ACCOUNT: "cuenta de ahorros",
  INVESTMENT_ACCOUNT: "cuenta de inversiones",
  TIME_DEPOSITS: "depósitos a plazo fijo",
  OTHER: "otro",
};

const DEMANDABLE_ASSETS_ACCOUNT = {
  ACCOUNTS_RECEIVABLE: "cuentas por cobrar",
  NOTES_RECEIVABLE: "recibos por cobrar",
  DOCUMENTOS: "documentos",
  PROMISSORY_NOTE: "pagaré",
  BILLS_OF_EXCHANGE: "letras de cambio",
  BILLS_RECEIVABLE: "letras por cobrar",
  ACCRUED_INCOME: "ingresos acumulados",
  OTHER: "otro",
};

const REALIZABLE_ASSETS_ACCOUNT = {
  STOCK: "stock o inventario",
  WORK_IN_PROGRESS: "trabajos en proceso",
  OTHER: "otro",
};

const FIXED_ASSETS_ACCOUNT = {
  LANDS: "terrenos",
  BUILDING: "edificios",
  MACHINERY: "maquinaria",
  EQUIPMENT: "equipo",
  OFFICE_EQUIPMENT: "equipo de oficina",
  VEHICLES: "vehículos",
  FURNITURE_AND_FIXTURES: "muebles y enseres",
  LEASEHOLD_IMPROVEMENTS: "mejoras en propiedades arrendadas",
  OTHER: "otro",
};

const DEFERRED_ASSETS_ACCOUNT = {
  INSURANCE: "seguro",
  INTEREST: "intereses",
  RENTALS: "alquileres",
  PREPAID_TAXES: "impuestos pagados por adelantado",
  OTHER: "otro",
};

const CURRENT_LIABILITIES_ACCOUNT = {
  ACCOUNTS_PAYABLE: "cuentas por pagar",
  DOCUMENTS_PAYABLE: "documentos por pagar",
  PAYMENT_TO_SUPPLIERS: "pago a proveedores",
  ACCRUED_EXPENSES: "gastos acumulados",
  UNEARNED_REVENUE: "ingresos no devengados",
  OTHER: "otro",
};

const FIXED_LIABILITIES_ACCOUNT = {
  MORTGAGE: "hipoteca",
  LONG_TERM_LOANS: "préstamos a largo plazo",
  DEFERRED_TAX_LIABILITIES: "pasivos por impuestos diferidos",
  OTHER: "otro",
};

const EQUITY_ACCOUNT = {
  CONTRIBUTED_CAPITAL: "capital aportado",
  RETAINED_EARNINGS: "utilidades retenidas o utilidades no distribuidas",
  MANAGEMENT_UTILITIES: "utilidades de la gestión",
  LEGAL_RESERVATION: "reserva legal",
  ADDITIONAL_PAID_IN_CAPITAL: "capital pagado adicional",
  TREASURY_STOCK: "acciones en tesorería",
  OTHER: "otro",
};

function generateYearRange(startYear: number) {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}

export type Asset = { account: string; amount: number };

export interface Assets {
  currentAssets: {
    availableAssets: Asset[];
    demandableAssets: Asset[];
    realizableAssets: Asset[];
  };
  fixedAssets: Asset[];
  deferredAssets: Asset[];
}

// export const STATE_ASSETS: Assets = {
//   currentAssets: {
//     availableAssets: [] as Asset[],
//     demandableAssets: [] as Asset[],
//     realizableAssets: [] as Asset[],
//   },
//   fixedAssets: [] as Asset[],
//   deferredAssets: [] as Asset[],
// };

export type Liability = { account: string; amount: number };

export interface LiabilitiesEquity {
  currentLiabilities: Liability[];
  fixedLiabilities: Liability[];
  equity: Liability[];
}

const BalanceSheetPage = () => {
  const { balance, setBalance } = useBalance();
  // const { user } = useAuth();
  const user = useSelector((state: RootState) => state.user);
  const [newEntry, setNewEntry] = useState({ name: "", category: "activo", subcategory: "", subcategory2: "", value: 0 });
  const [error, setError] = useState("");
  // const [periodType, setPeriodType] = useState(user.balance_type);
  const [period, setPeriod] = useState({ month: months[new Date().getMonth()], year: new Date().getFullYear() });
  const [assets, setAssets] = useState({} as Assets);
  const [liabilitiesEquity, setLiabilitiesEquity] = useState({} as LiabilitiesEquity);
  const chartRef = useRef(null);
  const [isDownload, setIsDownload] = useState(false);

  useEffect(() => {
    if (newEntry.category === "activo") {
      setNewEntry((prev) => ({ ...prev, subcategory: "" }));
    } else if (newEntry.category === "pasivo") {
      setNewEntry((prev) => ({ ...prev, subcategory: "" }));
    } else if (newEntry.category === "patrimonio") {
      setNewEntry((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [newEntry.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "category" || name === "subcategory") {
      setNewEntry((prev) => ({
        ...prev,
        [name]: value,
        subcategory2: "",
      }));
    } else {
      setNewEntry((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInputChange2 = ({ name, value }: { name: string, value: string | number }) => {
    if (name === "category" || name === "subcategory") {
      setNewEntry((prev) => ({
        ...prev,
        [name]: value,
        subcategory2: "",
      }));
    } else {
      setNewEntry((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const verifyRepeatedEntry = (accountName: string, arr: { account: string }[]) => {
    if (arr.some((entry) => entry.account === accountName)) {
      setError("El nombre de la cuenta ya existe");
      throw new Error("El nombre de la cuenta ya existe");
    }
  }

  const handleAddEntry = () => {
    const accountName = newEntry.name;
    if (!accountName) {
      setError("El nombre de la cuenta no puede estar vacío");
      return;
    }
    // if (balance.entries.some((entry) => entry.name === accountName)) {
    //   setError("El nombre de la cuenta ya existe");
    //   return;
    // }
    if (newEntry.category === 'activo') {
      if (newEntry.subcategory === "circulante") {
        switch (newEntry.subcategory2) {
          case "availableAssets":
            verifyRepeatedEntry(accountName, assets.currentAssets.availableAssets)
            setAssets((prev) => ({
              ...prev, currentAssets: {
                demandableAssets: prev.currentAssets.demandableAssets,
                realizableAssets: prev.currentAssets.realizableAssets,
                availableAssets: [...prev.currentAssets.availableAssets, { account: accountName, amount: newEntry.value }]
              }
            }));
            break;
          case "demandableAssets":
            verifyRepeatedEntry(accountName, assets.currentAssets.demandableAssets)
            setAssets((prev) => ({
              ...prev, currentAssets: {
                demandableAssets: [...prev.currentAssets.demandableAssets, { account: accountName, amount: newEntry.value }],
                realizableAssets: prev.currentAssets.realizableAssets,
                availableAssets: prev.currentAssets.availableAssets
              }
            }));
            break;
          case "realizableAssets":
            verifyRepeatedEntry(accountName, assets.currentAssets.realizableAssets)
            setAssets((prev) => ({
              ...prev, currentAssets: {
                demandableAssets: prev.currentAssets.demandableAssets,
                realizableAssets: [...prev.currentAssets.realizableAssets, { account: accountName, amount: newEntry.value }],
                availableAssets: prev.currentAssets.availableAssets
              }
            }));
            break;

          default:
            break;
        }
      } else if (newEntry.subcategory === "fijo") {
        verifyRepeatedEntry(accountName, assets.fixedAssets)
        setAssets((prev) => ({
          ...prev, fixedAssets: [...prev.fixedAssets, { account: accountName, amount: newEntry.value }]
        }));
      } else if (newEntry.subcategory === "otros_activos") {
        verifyRepeatedEntry(accountName, assets.deferredAssets)
        setAssets((prev) => ({
          ...prev, deferredAssets: [...prev.deferredAssets, { account: accountName, amount: newEntry.value }]
        }));
      }
    } else if (newEntry.category === 'pasivo') {
      if (newEntry.subcategory === "corto_plazo") {
        verifyRepeatedEntry(accountName, liabilitiesEquity.currentLiabilities)
        setLiabilitiesEquity(prev => ({
          ...prev, currentLiabilities: [...prev.currentLiabilities, { account: accountName, amount: newEntry.value }]
        }));
      } else if (newEntry.subcategory === "largo_plazo") {
        verifyRepeatedEntry(accountName, liabilitiesEquity.fixedLiabilities)
        setLiabilitiesEquity(prev => ({
          ...prev, fixedLiabilities: [...prev.fixedLiabilities, { account: accountName, amount: newEntry.value }]
        }));
      }
    } else if (newEntry.category === 'patrimonio') {
      verifyRepeatedEntry(accountName, liabilitiesEquity.equity)
      setLiabilitiesEquity(prev => ({
        ...prev, equity: [...prev.equity, { account: accountName, amount: newEntry.value }]
      }));
    }

    const updatedEntries = [...balance.entries, { ...newEntry, id: (balance.entries.length + 1).toString(), name: accountName, value: parseFloat(newEntry.value.toString()), year: period.year, month: months.findIndex((month) => month === period.month) + 1, assets: { ...assets, totalCurrentAssets: 0, totalFixedAssets: 0, totalDeferredAssets: 0, totalAssets: 0 }, liabilities: { ...liabilitiesEquity, totalCurrentLiabilities: 0, totalFixedLiabilities: 0, totalEquity: 0, totalLiabilitiesEquity: 0 } }];
    setBalance({ ...balance, entries: updatedEntries });

    setNewEntry(prev => ({
      ...prev,
      subcategory2: "",
      value: 0,
      name: ""
    }));
    setError("");
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = balance.entries.filter((entry) => entry.id !== id);
    setBalance({ ...balance, entries: updatedEntries });
  };

  const sortedEntries = (category: string, subcategory: string | null = null) => {
    return balance.entries.filter((entry) => entry.category === category && entry.subcategory === subcategory);
  };

  const calculateTotal = (category: string, subcategory: string | null = null) => {
    return balance.entries.filter((entry) => entry.category === category && (subcategory ? entry.subcategory === subcategory : true)).reduce((acc, entry) => acc + entry.value, 0);
  };

  const calculateOverallTotal = (categories: string[]) => {
    return balance.entries.filter((entry) => categories.includes(entry.category)).reduce((acc, entry) => acc + entry.value, 0);
  };

  const calculatePasivoPatrimonioTotal = () => {
    return calculateOverallTotal(["pasivo", "patrimonio"]);
  };

  const createBalance = async (obj: { year: number; month: number; assets: Assets; liabilitiesEquity: LiabilitiesEquity }) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
      const res = await axios.post(`${API_BASEURL}/api/balance/` + user.id, obj, config);
      return res
    } catch (error) {
      console.log(error)
      setError("Hubo un error al crear el balance")
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (period.month === "" || period.year === 0) {
      setError("El mes y el año son obligatorios");
      return;
    }
    if (assets.currentAssets.availableAssets.length === 0 && assets.currentAssets.demandableAssets.length === 0 && assets.currentAssets.realizableAssets.length === 0 && assets.fixedAssets.length === 0 && assets.deferredAssets.length === 0) {
      setError("No se han agregado cuentas de activo");
      return;
    }
    if (assets.currentAssets.availableAssets.length === 0) {
      setError("No se han agregado cuentas de activo circulante");
      return;
    }
    if (assets.currentAssets.demandableAssets.length === 0) {
      setError("No se han agregado cuentas de activo exigible");
      return;
    }
    if (assets.currentAssets.realizableAssets.length === 0) {
      setError("No se han agregado cuentas de activo realizable");
      return;
    }
    if (assets.fixedAssets.length === 0) {
      setError("No se han agregado cuentas de activo fijo");
      return;
    }
    if (assets.deferredAssets.length === 0) {
      setError("No se han agregado cuentas de activo diferido");
      return;
    }
    if (liabilitiesEquity.currentLiabilities.length === 0 && liabilitiesEquity.fixedLiabilities.length === 0 && liabilitiesEquity.equity.length === 0) {
      setError("No se han agregado cuentas de pasivo o patrimonio");
      return;
    }
    if (liabilitiesEquity.currentLiabilities.length === 0) {
      setError("No se han agregado cuentas de pasivo a corto plazo (circulante)");
      return;
    }
    if (liabilitiesEquity.fixedLiabilities.length === 0) {
      setError("No se han agregado cuentas de pasivo a largo plazo (fijo)");
      return;
    }
    createBalance({ year: period.year, month: months.findIndex((month) => month === period.month) + 1, assets, liabilitiesEquity })
      .then((res) => {
        console.log(res)
        setIsDownload(true)
      })
      .catch((error) => {
        console.log(error)
      })

    setNewEntry({
      category: "activo",
      subcategory: "",
      subcategory2: "",
      value: 0,
      name: ""
    });
  }

  const [arrOptions, setArrOptions] = useState<Record<string, string>>({})

  function dynamicOptions(subcategory2: string): Record<string, string> {
    if (subcategory2 === "availableAssets") return AVAILABLE_ASSETS_ACCOUNT;
    if (subcategory2 === "demandableAssets") return DEMANDABLE_ASSETS_ACCOUNT;
    if (subcategory2 === "realizableAssets") return REALIZABLE_ASSETS_ACCOUNT;
    if (subcategory2 === "fijo") return FIXED_ASSETS_ACCOUNT;
    if (subcategory2 === "otros_activos") return DEFERRED_ASSETS_ACCOUNT;
    if (subcategory2 === "corto_plazo") return CURRENT_LIABILITIES_ACCOUNT;
    if (subcategory2 === "largo_plazo") return FIXED_LIABILITIES_ACCOUNT;
    if (subcategory2 === "patrimonio") return EQUITY_ACCOUNT;
    return {};
  }

  return (
    <div className="flex flex-col min-h-screen rounded-lg">
      <div className="flex flex-row">
        <div className="flex flex-col w-full pt-0">
          {/* {isDownload && <BalanceSheetTools balance={balance} sortedEntries={sortedEntries} calculateTotal={calculateTotal} calculateOverallTotal={calculateOverallTotal} chartRef={chartRef} />} */}
          <div className="w-full ">
            <div className="flex flex-col items-center mb-4">
              <div className="rounded-lg shadow-inner w-full flex justify-between items-center">
                {user.balance_type === "mensual" && (
                  <select name="periodMonth" value={period.month} onChange={(e) => setPeriod((prev) => ({ ...prev, month: e.target.value }))} className="border p-2 rounded-lg focus:outline-none focus:ring-2 bg-zinc-800 border-black">
                    <option value="">Selecciona un mes</option>
                    <option value="enero">Enero</option>
                    <option value="febrero">Febrero</option>
                    <option value="marzo">Marzo</option>
                    <option value="abril">Abril</option>
                    <option value="mayo">Mayo</option>
                    <option value="junio">Junio</option>
                    <option value="julio">Julio</option>
                    <option value="agosto">Agosto</option>
                    <option value="septiembre">Septiembre</option>
                    <option value="octubre">Octubre</option>
                    <option value="noviembre">Noviembre</option>
                    <option value="diciembre">Diciembre</option>
                  </select>
                )}
                <select value={period.year} onChange={(e) => setPeriod((prev) => ({ ...prev, year: parseInt(e.target.value) }))} className="border p-2 rounded-lg focus:outline-none focus:ring-2 bg-zinc-800 border-black">
                  {generateYearRange(2000).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Card className="border-transparent">
                  <CardContent className="text-white pt-5 space-y-2">
                    <span>Activos</span>
                    <h2 className="text-2xl font-bold">Bs {calculateOverallTotal(["activo"]).toLocaleString()}</h2>
                    <AlertDialog>
                      <AlertDialogTrigger type="button" className="bg-primary rounded-full p-2" onClick={() => {
                        handleInputChange2({ name: "category", value: 'activo' })
                        setArrOptions(dynamicOptions('activo'))
                        setNewEntry((prev) => ({ ...prev, subcategory: '' }));
                      }}>
                        <Plus />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Agregar activo</AlertDialogTitle>
                          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {newEntry.category !== "patrimonio" && (
                              <label className="flex flex-col">
                                <span>
                                  Tipo de activo
                                </span>
                                <select name="subcategory" value={newEntry.subcategory} onChange={(e) => {
                                  handleInputChange(e)
                                  setArrOptions(dynamicOptions(e.target.value))
                                  // setArrOptions(dynamicOptions(e.target.value))
                                }} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800">
                                  <option value="">Seleccione...</option>
                                  {newEntry.category === "activo" && (
                                    <>
                                      <option value="circulante">Circulante</option>
                                      <option value="fijo">Fijo</option>
                                      <option value="otros_activos">Diferido</option>
                                    </>
                                  )}
                                  {newEntry.category === "pasivo" && (
                                    <>
                                      <option value="corto_plazo">Circulante</option>
                                      <option value="largo_plazo">Fijo</option>
                                    </>
                                  )}
                                </select>
                              </label>
                            )}
                            {newEntry.subcategory === "circulante" && (
                              <label className="flex flex-col">
                                <span>
                                  Tipo de activo circulante
                                </span>
                                <select
                                  name="subcategory2"
                                  value={newEntry.subcategory2}
                                  onChange={(e) => {
                                    handleInputChange(e);
                                    setArrOptions(dynamicOptions(e.target.value))
                                    // setNewEntry((prev) => ({ ...prev, subcategory2: e.target.value }));
                                  }}
                                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
                                >
                                  <option value="">Seleccione tipo de activo</option>
                                  <option value="availableAssets">Activo disponible</option>
                                  <option value="demandableAssets">Activo exigible</option>
                                  <option value="realizableAssets">Activo realizable</option>
                                </select>
                              </label>
                            )}
                            <label className="flex flex-col">
                              <span>
                                Cuenta
                              </span>
                              <select
                                name="name"
                                value={newEntry.name}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
                              // required
                              >
                                <option value="">Seleccione una cuenta</option>
                                {Object.entries(arrOptions).map(([key, value]) => (
                                  <option key={key} value={value}>
                                    {value}
                                  </option>
                                ))}

                              </select>
                            </label>
                            <label className="flex flex-col">
                              <span>Valor</span>
                              <input type="number" name="value" value={newEntry.value} onChange={handleInputChange} placeholder="Valor" className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800" /></label>
                          </div>
                          {error && <p className="text-red-500 mt-2">{error}</p>}
                          <Button type="button" variant='ghost' onClick={handleAddEntry} className="mb-5 px-4">
                            Agregar
                          </Button>
                          <h2 className="text-base font-semibold mt-4 text-primary">Activo Circulante</h2>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Opciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEntries("activo", "circulante").map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{entry.name}</TableCell>
                                  <TableCell>Bs. {entry.value.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:underline">
                                      Eliminar
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell>Total Activo Circulante</TableCell>
                                <TableCell>Bs. {calculateTotal("activo", "circulante").toLocaleString()}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>

                          <h2 className="text-base font-semibold mt-4 text-primary">Activo fijo</h2>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Opciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEntries("activo", "fijo").map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{entry.name}</TableCell>
                                  <TableCell>Bs. {entry.value.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:underline">
                                      Eliminar
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell>Total Activo Fijo</TableCell>
                                <TableCell>Bs. {calculateTotal("activo", "fijo").toLocaleString()}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>

                          <h2 className="text-base font-semibold mt-4 text-primary">Otros activos</h2>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Opciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEntries("activo", "otros_activos").map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{entry.name}</TableCell>
                                  <TableCell>Bs. {entry.value.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:underline">
                                      Eliminar
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell>Total Otros Activos</TableCell>
                                <TableCell>Bs. {calculateTotal("activo", "otros_activos").toLocaleString()}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>Cerrar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
                <Card className="border-transparent">
                  <CardContent className="text-white pt-5 space-y-2">
                    <span>Pasivos</span>
                    <h2 className="text-2xl font-bold">Bs {calculateOverallTotal(["pasivo"]).toLocaleString()}</h2>
                    <AlertDialog>
                      <AlertDialogTrigger type="button" className="bg-primary rounded-full p-2" onClick={() => {
                        handleInputChange2({ name: "category", value: 'pasivo' })
                        setArrOptions(dynamicOptions('pasivo'))
                        setNewEntry((prev) => ({ ...prev, subcategory: '' }));
                      }}>
                        <Plus />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Agregar pasivos</AlertDialogTitle>
                          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {newEntry.category !== "patrimonio" && (
                              <label className="flex flex-col">
                                <span>
                                  Tipo de activo
                                </span>
                                <select name="subcategory" value={newEntry.subcategory} onChange={(e) => {
                                  handleInputChange(e)
                                  setArrOptions(dynamicOptions(e.target.value))
                                  // setArrOptions(dynamicOptions(e.target.value))
                                }} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800">
                                  <option value="">Seleccione...</option>
                                  {newEntry.category === "activo" && (
                                    <>
                                      <option value="circulante">Circulante</option>
                                      <option value="fijo">Fijo</option>
                                      <option value="otros_activos">Diferido</option>
                                    </>
                                  )}
                                  {newEntry.category === "pasivo" && (
                                    <>
                                      <option value="corto_plazo">Circulante</option>
                                      <option value="largo_plazo">Fijo</option>
                                    </>
                                  )}
                                </select>
                              </label>
                            )}
                            {newEntry.subcategory === "circulante" && (
                              <label className="flex flex-col">
                                <span>
                                  Tipo de activo circulante
                                </span>
                                <select
                                  name="subcategory2"
                                  value={newEntry.subcategory2}
                                  onChange={(e) => {
                                    handleInputChange(e);
                                    setArrOptions(dynamicOptions(e.target.value))
                                    // setNewEntry((prev) => ({ ...prev, subcategory2: e.target.value }));
                                  }}
                                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
                                >
                                  <option value="">Seleccione tipo de activo</option>
                                  <option value="availableAssets">Activo disponible</option>
                                  <option value="demandableAssets">Activo exigible</option>
                                  <option value="realizableAssets">Activo realizable</option>
                                </select>
                              </label>
                            )}
                            <label className="flex flex-col">
                              <span>
                                Cuenta
                              </span>
                              <select
                                name="name"
                                value={newEntry.name}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
                              // required
                              >
                                <option value="">Seleccione una cuenta</option>
                                {Object.entries(arrOptions).map(([key, value]) => (
                                  <option key={key} value={value}>
                                    {value}
                                  </option>
                                ))}

                              </select>
                            </label>
                            <label className="flex flex-col">
                              <span>Valor</span>
                              <input type="number" name="value" value={newEntry.value} onChange={handleInputChange} placeholder="Valor" className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800" /></label>
                          </div>
                          {error && <p className="text-red-500 mt-2">{error}</p>}
                          <Button type="button" variant='ghost' onClick={handleAddEntry} className="mb-5 px-4">
                            Agregar
                          </Button>
                          <h2 className="text-base font-semibold mt-4 text-primary">Pasivo a corto plazo</h2>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Opciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEntries("pasivo", "corto_plazo").map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{entry.name}</TableCell>
                                  <TableCell>Bs. {entry.value.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:underline">
                                      Eliminar
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell>Total Pasivo a Corto Plazo</TableCell>
                                <TableCell>Bs. {calculateTotal("pasivo", "corto_plazo").toLocaleString()}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>

                          <h2 className="text-base font-semibold mt-4 text-primary">Pasivo a largo plazo</h2>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Opciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEntries("pasivo", "largo_plazo").map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{entry.name}</TableCell>
                                  <TableCell>Bs. {entry.value.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:underline">
                                      Eliminar
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell>Total Pasivo a Largo Plazo</TableCell>
                                <TableCell>Bs. {calculateTotal("pasivo", "largo_plazo").toLocaleString()}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>Cerrar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
                <Card className="border-transparent">
                  <CardContent className="text-white pt-5 space-y-2">
                    <span>Patrimonio</span>
                    <h2 className="text-2xl font-bold">Bs {calculateOverallTotal(["patrimonio"]).toLocaleString()}</h2>
                    <AlertDialog>
                      <AlertDialogTrigger type="button" className="bg-primary rounded-full p-2" onClick={() => {
                        handleInputChange2({ name: "category", value: 'patrimonio' })
                        setArrOptions(dynamicOptions('patrimonio'))
                        setNewEntry((prev) => ({ ...prev, subcategory: '' }));
                      }}>
                        <Plus />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Patrimonios</AlertDialogTitle>
                          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {newEntry.category !== "patrimonio" && (
                              <label className="flex flex-col">
                                <span>
                                  Tipo de activo
                                </span>
                                <select name="subcategory" value={newEntry.subcategory} onChange={(e) => {
                                  handleInputChange(e)
                                  setArrOptions(dynamicOptions(e.target.value))
                                  // setArrOptions(dynamicOptions(e.target.value))
                                }} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800">
                                  <option value="">Seleccione...</option>
                                  {newEntry.category === "activo" && (
                                    <>
                                      <option value="circulante">Circulante</option>
                                      <option value="fijo">Fijo</option>
                                      <option value="otros_activos">Diferido</option>
                                    </>
                                  )}
                                  {newEntry.category === "pasivo" && (
                                    <>
                                      <option value="corto_plazo">Circulante</option>
                                      <option value="largo_plazo">Fijo</option>
                                    </>
                                  )}
                                </select>
                              </label>
                            )}
                            {newEntry.subcategory === "circulante" && (
                              <label className="flex flex-col">
                                <span>
                                  Tipo de activo circulante
                                </span>
                                <select
                                  name="subcategory2"
                                  value={newEntry.subcategory2}
                                  onChange={(e) => {
                                    handleInputChange(e);
                                    setArrOptions(dynamicOptions(e.target.value))
                                    // setNewEntry((prev) => ({ ...prev, subcategory2: e.target.value }));
                                  }}
                                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
                                >
                                  <option value="">Seleccione tipo de activo</option>
                                  <option value="availableAssets">Activo disponible</option>
                                  <option value="demandableAssets">Activo exigible</option>
                                  <option value="realizableAssets">Activo realizable</option>
                                </select>
                              </label>
                            )}
                            <label className="flex flex-col">
                              <span>
                                Cuenta
                              </span>
                              <select
                                name="name"
                                value={newEntry.name}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
                              // required
                              >
                                <option value="">Seleccione una cuenta</option>
                                {Object.entries(arrOptions).map(([key, value]) => (
                                  <option key={key} value={value}>
                                    {value}
                                  </option>
                                ))}

                              </select>
                            </label>
                            <label className="flex flex-col">
                              <span>Valor</span>
                              <input type="number" name="value" value={newEntry.value} onChange={handleInputChange} placeholder="Valor" className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800" /></label>
                          </div>
                          {error && <p className="text-red-500 mt-2">{error}</p>}
                          <Button type="button" variant='ghost' onClick={handleAddEntry} className="mb-5 px-4">
                            Agregar
                          </Button>

                          <h2 className="text-base font-semibold mt-4 text-primary">Patrimonio</h2>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Opciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEntries("patrimonio").map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{entry.name}</TableCell>
                                  <TableCell>Bs. {entry.value.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:underline">
                                      Eliminar
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell>Total Patrimonio</TableCell>
                                <TableCell>Bs. {calculateTotal("patrimonio").toLocaleString()}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>Cerrar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
                <Card className="border-transparent">
                  <CardContent className="text-white pt-5 space-y-2">
                    <span>Pasivo + Patrimonio</span>
                    <h2 className="text-2xl font-bold">Bs {calculatePasivoPatrimonioTotal().toLocaleString()}</h2>
                  </CardContent>
                </Card>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <header className="flex w-full justify-between items-center py-5  ">
                <div className="space-x-4">
                  {isDownload && <button type='button' onClick={() => {
                    setAssets({} as Assets)
                    setLiabilitiesEquity({} as LiabilitiesEquity)
                    setIsDownload(false)
                    setBalance({ ...balance, entries: [] })
                  }} className="bg-purple-400 text-white px-4 py-1 rounded-lg shadow hover:bg-purple-500">
                    ¿Nuevo Balance?
                  </button>}
                  <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-600">
                    Crear
                  </button>
                </div>
              </header>
            </form>

            <div className="flex flex-col w-full bg-zinc-800 rounded-lg p-4 justify-center items-center mb-5">
              <div className="w-full md:w-1/2 h-[400px]">
                <BalanceSheetCharts ref={chartRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetPage
