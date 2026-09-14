// VPN Types and Interfaces
export interface VPNCountry {
  code: string;
  name: string;
  flag: string;
  endpoint: string;
}

export interface VPNServer {
  id: string;
  country: string;
  ip: string;
  status: 'active' | 'inactive';
}

export interface VPNStatus {
  isConnected: boolean;
  currentCountry: string | null;
  currentIP: string | null;
  connectionTime: number | null;
}

export interface VPNConfig {
  protocol: 'OpenVPN' | 'WireGuard';
  encryptionLevel: 'standard' | 'high';
  autoConnect: boolean;
}
