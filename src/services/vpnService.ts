import { VPNCountry, VPNStatus, VPNServer } from '../types/vpn';

// 10 Countries with VPN Endpoints
const VPN_COUNTRIES: VPNCountry[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    endpoint: 'us-vpn-endpoint',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    endpoint: 'gb-vpn-endpoint',
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    endpoint: 'de-vpn-endpoint',
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    endpoint: 'jp-vpn-endpoint',
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    endpoint: 'ca-vpn-endpoint',
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    endpoint: 'au-vpn-endpoint',
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    endpoint: 'fr-vpn-endpoint',
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    endpoint: 'sg-vpn-endpoint',
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    endpoint: 'nl-vpn-endpoint',
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    endpoint: 'br-vpn-endpoint',
  },
];

class VPNAPIService {
  private isConnected: boolean = false;
  private currentCountry: string | null = null;
  private currentIP: string | null = null;
  private connectionStartTime: number | null = null;

  /**
   * Get list of all available VPN countries
   * GET /api/countries
   */
  getCountriesList(): {
    success: boolean;
    data: VPNCountry[];
    message: string;
  } {
    return {
      success: true,
      data: [...VPN_COUNTRIES],
      message: 'Countries list retrieved successfully',
    };
  }

  /**
   * Connect to VPN server in specified country
   * POST /api/connect?country_code=US
   */
  connectVPN(countryCode: string): {
    success: boolean;
    data: VPNStatus;
    message: string;
  } {
    const country = VPN_COUNTRIES.find((c) => c.code === countryCode);
    if (!country) {
      return {
        success: false,
        data: this.getVPNStatus(),
        message: `Country code ${countryCode} not found`,
      };
    }

    this.isConnected = true;
    this.currentCountry = country.name;
    this.connectionStartTime = Date.now();
    this.currentIP = this.generateVPNIP(countryCode);

    return {
      success: true,
      data: this.getVPNStatus(),
      message: `Successfully connected to ${country.name} (${country.endpoint})`,
    };
  }

  /**
   * Disconnect from VPN
   * POST /api/disconnect
   */
  disconnectVPN(): {
    success: boolean;
    data: VPNStatus;
    message: string;
  } {
    const wasConnected = this.isConnected;
    this.isConnected = false;
    this.currentCountry = null;
    this.currentIP = null;
    this.connectionStartTime = null;

    return {
      success: true,
      data: this.getVPNStatus(),
      message: wasConnected
        ? 'Successfully disconnected from VPN'
        : 'VPN was not connected',
    };
  }

  /**
   * Get current VPN connection status
   * GET /api/status
   */
  getVPNStatus(): VPNStatus {
    return {
      isConnected: this.isConnected,
      currentCountry: this.currentCountry,
      currentIP: this.currentIP,
      connectionTime: this.connectionStartTime
        ? Math.floor((Date.now() - this.connectionStartTime) / 1000)
        : null,
    };
  }

  /**
   * Get VPN status with full response
   * GET /api/status
   */
  getStatusResponse(): {
    success: boolean;
    data: VPNStatus;
    message: string;
  } {
    return {
      success: true,
      data: this.getVPNStatus(),
      message: this.isConnected
        ? `Connected to ${this.currentCountry}`
        : 'Not connected to VPN',
    };
  }

  /**
   * Generate VPN IP address for specified country
   * GET /api/ip?country_code=US
   */
  generateVPNIP(countryCode: string): string {
    const ipMap: Record<string, string> = {
      US: '192.168.1.45',
      GB: '192.168.1.78',
      DE: '192.168.1.92',
      JP: '192.168.1.156',
      CA: '192.168.1.201',
      AU: '192.168.1.134',
      FR: '192.168.1.89',
      SG: '192.168.1.167',
      NL: '192.168.1.123',
      BR: '192.168.1.234',
    };
    return ipMap[countryCode] || '192.168.1.1';
  }

  /**
   * Get VPN IP with response
   * GET /api/ip?country_code=US
   */
  getVPNIPResponse(countryCode: string): {
    success: boolean;
    data: { country_code: string; ip: string };
    message: string;
  } {
    const country = VPN_COUNTRIES.find((c) => c.code === countryCode);
    if (!country) {
      return {
        success: false,
        data: { country_code: countryCode, ip: '' },
        message: `Country code ${countryCode} not found`,
      };
    }

    return {
      success: true,
      data: {
        country_code: countryCode,
        ip: this.generateVPNIP(countryCode),
      },
      message: `VPN IP for ${country.name} retrieved successfully`,
    };
  }

  /**
   * Get list of available VPN servers
   * GET /api/servers
   */
  getServersList(): {
    success: boolean;
    data: VPNServer[];
    message: string;
  } {
    const servers = VPN_COUNTRIES.map((country) => ({
      id: `server-${country.code}`,
      country: country.name,
      ip: this.generateVPNIP(country.code),
      status: 'active' as const,
    }));

    return {
      success: true,
      data: servers,
      message: 'Servers list retrieved successfully',
    };
  }

  /**
   * Check VPN connection health
   * GET /api/health
   */
  checkConnectionHealth(): {
    success: boolean;
    data: { isHealthy: boolean; status: string };
    message: string;
  } {
    const isHealthy = this.isConnected;
    return {
      success: true,
      data: {
        isHealthy,
        status: isHealthy ? 'VPN connection is healthy' : 'VPN is not connected',
      },
      message: 'Health check completed',
    };
  }
}

export default VPNAPIService;
