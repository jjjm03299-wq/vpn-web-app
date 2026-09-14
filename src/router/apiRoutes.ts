import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import React from 'react';
import VPNAPIService from '../services/vpnService';

const vpnService = new VPNAPIService();

// Outlet Component
function Outlet() {
  return null;
}

// Root Route
const rootRoute = createRootRoute({
  component: () => <div id="app"><Outlet /></div>,
});

// GET /api/countries - Get list of all available VPN countries
export const countriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/countries',
  component: () => {
    const response = vpnService.getCountriesList();
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// POST /api/connect?country_code=US - Connect to VPN
export const connectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/connect',
  validateSearch: (search: Record<string, unknown>) => ({
    country_code: (search.country_code as string) || '',
  }),
  component: () => {
    const search = connectRoute.useSearch() as { country_code: string };
    const response = vpnService.connectVPN(search.country_code);
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// POST /api/disconnect - Disconnect from VPN
export const disconnectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/disconnect',
  component: () => {
    const response = vpnService.disconnectVPN();
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// GET /api/status - Get current VPN status
export const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/status',
  component: () => {
    const response = vpnService.getStatusResponse();
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// GET /api/ip?country_code=US - Get VPN IP for country
export const ipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/ip',
  validateSearch: (search: Record<string, unknown>) => ({
    country_code: (search.country_code as string) || '',
  }),
  component: () => {
    const search = ipRoute.useSearch() as { country_code: string };
    const response = vpnService.getVPNIPResponse(search.country_code);
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// GET /api/servers - Get list of all VPN servers
export const serversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/servers',
  component: () => {
    const response = vpnService.getServersList();
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// GET /api/health - Health check
export const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/api/health',
  component: () => {
    const response = vpnService.checkConnectionHealth();
    return (
      <pre style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  },
});

// Create router with all API routes
export const apiRouter = createRouter({
  routeTree: rootRoute.addChildren([
    countriesRoute,
    connectRoute,
    disconnectRoute,
    statusRoute,
    ipRoute,
    serversRoute,
    healthRoute,
  ]),
});

export default apiRouter;
