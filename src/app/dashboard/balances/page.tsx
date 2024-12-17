'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { API_BASEURL } from "@/lib/api.utils";
import { getStorage, STORAGE_USER } from "@/lib/storage.utils";
import { Button } from "@/components/ui/button";

function BalancesPage() {
  const navigate = useRouter()
  const user = useSelector((state: RootState) => state.user);
  const [balances, setBalances] = useState([])
  const getBalances = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
      const res = await axios(`${API_BASEURL}/api/balance/all/` + id, config);
      return res.data
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user && user.id) {
      getBalances(user.id)
        .then((response) => {
          setBalances(response)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [user])

  return (
    <div className="flex flex-col min-h-screen p-4 rounded-lg">
      <div className="flex flex-row">
        <div className="flex flex-col w-full p-4 pt-0">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Balances</h1>
            <Button
              onClick={() => navigate.push("/dashboard/cuentas")}
              className="bg-purple-400 text-white px-4 py-1 rounded-lg shadow hover:bg-purple-500">Crear balance</Button>
          </header>

          <div className="container mx-auto p-4">
            {balances.length > 0 && balances.map((balance) => (
              <div key={balance.id} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Balance general de la fecha {balance.year}-{balance.month}
                </h2>
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Cuenta</th>
                      <th className="py-2 px-4 border-b">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">Total activos corrientes</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.assets.totalCurrentAssets}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Activos fijos totales</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.assets.totalFixedAssets}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Activos diferidos totales</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.assets.totalDeferredAssets}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Activos Totales</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.assets.totalAssets}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Total pasivos corrientes</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.liabilities.totalCurrentLiabilities}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Pasivos fijos totales</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.liabilities.totalFixedLiabilities}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Equidad total</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.liabilities.totalEquity}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Pasivos y patrimonio totales</td>
                      <td className="py-2 px-4 border-b">Bs. {balance.liabilities.totalLiabilitiesEquity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalancesPage;