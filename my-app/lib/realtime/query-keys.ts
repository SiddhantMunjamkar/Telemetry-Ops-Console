export const queryKeys = {
  fleet: ["fleet"] as const,
  devices: ["devices"] as const,
  device: (id: string) => ["device", id] as const,
  deviceHistory: (id: string) => ["device-history", id] as const,
  alerts: ["alerts"] as const,
};
