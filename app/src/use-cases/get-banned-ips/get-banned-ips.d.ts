export interface GetBannedIpsDTO {
  success: boolean,
  error?: Error,
  data?: { addresses: string[] },
}

export interface GetBannedIpsHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIps: string[] },
}
