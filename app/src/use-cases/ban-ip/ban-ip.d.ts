export interface BanIpDTO {
  success: boolean,
  error?: Error,
  data?: { address: string },
}

export interface BanIpHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIp: string },
}
