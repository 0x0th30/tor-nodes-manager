interface GetBannedIpsDTO {
  success: boolean,
  message?: string,
  data?: { addresses: string[] },
}

interface GetBannedIpsHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIps: string[] },
}
