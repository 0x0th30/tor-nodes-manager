export interface GetBannedIpsDTO {
  success: boolean,
  message?: string,
  data?: { addresses: string[] },
}

export interface GetBannedIpsHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIps: string[] },
}
