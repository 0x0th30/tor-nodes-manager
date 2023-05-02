export interface GetAllIpsDTO {
  success: boolean,
  message?: string,
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
