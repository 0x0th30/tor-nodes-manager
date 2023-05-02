export interface GetFilteredIpsDTO {
  success: boolean,
  message?: string,
  data?: {
    results: number,
    bannedIps: number,
    addresses: string[],
  },
}

export interface GetFilteredIpsHTTPResponse {
  success: boolean,
  message?: string,
  data?: {
    results: number,
    bannedIps: number,
    addresses: string[],
  },
}
