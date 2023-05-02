export interface UnbanIpDTO {
  success: boolean,
  message?: string,
  data?: { address: string },
}

export interface UnbanIpHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIp: string },
}
