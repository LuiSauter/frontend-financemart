import { AppConfig } from "./config"

export const ENDPOINTS = {
  AUTH: '/api/auth',
  LOGOUT: '/api/logout',
  USERS: '/api/users',
  ROLES_PERMISSIONS: '/api/roles-permissions',
  RECOVER_PASSWORD: '/api/forgot-password',
  RESET_PASSWORD: '/api/reset-password',
  STORE: '/api/store',
  STORE_COMMENT: '/api/store-comment',
  CATEGORY: '/api/category',
  PATIENTS: '/api/patients',
  //Service-medic
  AREA: '/api/areas',
  FORMULARIO_AREA: '/api/formularios',
  HORARIO_USUARIO:'/api/horario-usuario',
  HORARIOS: '/api/horarios',
  USUARIO_DEPARTAMENTO: '/api/usuario-departamento',
  // Binnacle
  BINNACLE: '/api/binnacle',
  REPORT_BINNACLE: '/api/report/bitacora',
  PLAN: '/api/plan',
  COMPANY: '/api/company',
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  console.log(API_BASEURL)
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
