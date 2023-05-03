export interface UnbanIpDTO {
  success: boolean,
  error?: Error,
  data?: { address: string },
}

export interface UnbanIpHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIp: string },
}
