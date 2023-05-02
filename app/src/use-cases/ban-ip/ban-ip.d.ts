export interface BanIpDTO {
  success: boolean,
  message?: string,
  data?: { address: string },
}

export interface BanIpHTTPResponse {
  success: boolean,
  message?: string,
  data?: { bannedIp: string },
}
