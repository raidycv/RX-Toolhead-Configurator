# RX Toolhead Configurator V3.0

V3 replaces the anonymous single master GLB with the 23 named Shapr3D first-level GLB assemblies.

Current first-pass functional mapping:
- H2S / A1 gear setup
- MGN12H / MGN9 carriage
- None / Cartographer-Beacon / BIQU MicroProbe
- None / Static / Servo filament-cutter arm
- Click any visible component to show its source assembly filename
- Exploded view moves logical assemblies instead of individual raw meshes

The mapping is deliberately conservative: assemblies whose dependency is not yet verified remain visible rather than being incorrectly hidden.
