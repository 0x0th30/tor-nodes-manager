export interface GetAllIpsDTO {
  success: boolean,
  error?: Error,
  data?: {
    results: number,
    addresses: string[],
  },
}

export interface GetAllIpsHTTPResponse {
  success: boolean,
  message?: string,
  data?: {
    results: number,
    addresses: string[],
  },
}
