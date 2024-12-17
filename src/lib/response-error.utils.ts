import { ApiResponse } from "@/services/crud.service"

export class ResponseError extends Error {
  private readonly errorInfo: ApiResponse

  constructor(message: string, errorInfo: ApiResponse) {
    super(message)
    this.errorInfo = errorInfo
  }

  get statusCode(): number {
    return this.errorInfo.statusCode ?? 0
  }

  get errorMessages(): string[] {
    if (typeof this.errorInfo.message === 'string') {
      return [this.errorInfo.message]
    }
    return this.errorInfo.message ?? []
  }

  get error(): string {
    return this.errorInfo.error ?? ''
  }
}
