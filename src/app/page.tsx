import Header from "@/components/pages/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart4, Calculator, FileSpreadsheet, LineChart, PieChart } from "lucide-react";
const tools = [
  {
    title: "Análisis Financiero",
    description: "Analiza la salud de tu negocio con nuestra herramienta de diagnóstico integral.",
    icon: BarChart4,
    color: "text-blue-400"
  },
  {
    title: "Diagnóstico Económico",
    description: "Obtén información sobre tu rendimiento económico con nuestra herramienta de diagnóstico.",
    icon: PieChart,
    color: "text-green-400"
  },
  {
    title: "Análisis Patrimonial",
    description: "Comprende tus activos y pasivos con nuestra herramienta de análisis patrimonial.",
    icon: LineChart,
    color: "text-purple-400"
  },
  {
    title: "Valor del Dinero en el Tiempo",
    description: "Calcula el valor del dinero en el tiempo con nuestra potente calculadora.",
    icon: Calculator,
    color: "text-yellow-400"
  },
  {
    title: "Balance General",
    description: "Genera y analiza tu balance general con nuestra intuitiva herramienta.",
    icon: FileSpreadsheet,
    color: "text-red-400"
  }
]
export default function Home() {
  return (
    <div className="p-5">
      <Header />
      <div className="flex flex-col lg:flex-row gap-8 py-5">
        <div className="lg:w-2/3 h-[calc(100vh-67.97px-32px)] flex lg:sticky top-[calc(67.97px-32px)]">
          <div className="space-y-8 my-auto">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              ✨ Introducción a Financemart
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Financemart: Herramienta Financiera para PYMES
            </h1>
            <p className="text-xl text-gray-400 max-w-screen-sm">
              Potencia la gestión financiera de tu pequeña o mediana empresa con nuestras herramientas intuitivas y eficaces.
            </p>
            <div className="space-x-4">
              <Button size="lg" variant='default'>
                Comenzar ahora
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 space-y-8">
          {/* <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold">Join our Discord</h2>
            <p className="text-gray-300">
              Join our Discord server to chat with other developers and get help.
            </p>
            <Button className="w-full">Chat with us</Button>
          </div> */}
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg  space-y-4 border-0">
                <CardHeader className="relative z-10 mb-0 pb-0">
                  <Icon className={`${tool.color} w-12 h-12 mb-4`} />
                  <CardTitle className="text-2xl font-semibold text-white group-hover:text-white transition-colors duration-300 ease-in-out">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white group-hover:text-gray-100 transition-colors duration-300 ease-in-out">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
