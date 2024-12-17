import packgeJson from '../../package.json' assert { type: 'json' }

export const AppConfig = {
  APP_NAME: "Financemart",
  APP_DESCRIPTION: "Herramienta Financiera para PYMES.",
  APP_VERSION: packgeJson.version,
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
}
