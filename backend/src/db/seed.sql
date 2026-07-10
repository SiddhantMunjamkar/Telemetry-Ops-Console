-- =============================================================================
-- Seed data — five industrial devices matching the sensor simulator fleet
-- =============================================================================
-- Fixed UUIDs keep references stable across local dev, tests, and documentation.
-- Re-running is safe: ON CONFLICT DO NOTHING on devices and device_health.
-- =============================================================================

INSERT INTO devices (id, name, type, location, status)
VALUES
  (
    '11111111-1111-4111-8111-111111111101',
    'Motor-1',
    'Motor',
    'Production Line A',
    'healthy'
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Motor-2',
    'Motor',
    'Production Line A',
    'healthy'
  ),
  (
    '22222222-2222-4222-8222-222222222201',
    'Pump-1',
    'Pump',
    'Hydraulic Bay 1',
    'healthy'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'Pump-2',
    'Pump',
    'Hydraulic Bay 2',
    'healthy'
  ),
  (
    '33333333-3333-4333-8333-333333333301',
    'Cooling-Unit-1',
    'Cooling Unit',
    'Cooling Plant',
    'healthy'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO device_health (
  device_id,
  health_score,
  status,
  last_temperature,
  last_pressure,
  last_power,
  last_vibration,
  last_seen
)
VALUES
  (
    '11111111-1111-4111-8111-111111111101',
    100,
    'healthy',
    70.0,
    NULL,
    300.0,
    3.0,
    NULL
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    100,
    'healthy',
    72.0,
    NULL,
    298.0,
    2.9,
    NULL
  ),
  (
    '22222222-2222-4222-8222-222222222201',
    100,
    'healthy',
    42.0,
    100.0,
    200.0,
    1.5,
    NULL
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    100,
    'healthy',
    44.0,
    98.0,
    198.0,
    1.4,
    NULL
  ),
  (
    '33333333-3333-4333-8333-333333333301',
    100,
    'healthy',
    25.0,
    70.0,
    150.0,
    0.8,
    NULL
  )
ON CONFLICT (device_id) DO NOTHING;
