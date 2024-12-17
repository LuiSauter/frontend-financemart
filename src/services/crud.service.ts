import { convertObjectToFormData, fetchData } from "@/lib/fetch-data.utils"

export interface ApiResponse<T = unknown> {
  statusCode?: number
  message?: string | string[]
  error?: string
  data?: T
  countData?: number
}


const getAllResource = async <T>(url: string): Promise<ApiResponse<T[]>> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as T[], countData: response.countData }
}

const getResource = async <T>(url: string): Promise<T> => {
  const response = await fetchData(url)
  return response.data as T
}

const createResource = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const createResourceWithImage = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const formData = convertObjectToFormData(arg as Record<string, unknown>)
  const options: RequestInit = {
    method: 'POST',
    body: formData
  }
  const response = await fetchData(url, options)
  return response
}

const updateResource = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify(arg)
  }
  const id = (arg as Record<string, unknown>).id

  console.log(url + id ? `/${id}` : '')

  const response = await fetchData(url + id ? `/${id}` : '', options)
  return response
}

const deleteResource = async (url: string): Promise<void> => {
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(url, options)
}

export { getAllResource, createResource, updateResource, getResource, deleteResource, createResourceWithImage }
