# RX Toolhead Configurator V2

V2 loads the real aligned RX V5.5 Configurator Master Assembly exported from Shapr3D as GLB.

## Current milestone
- Real RX geometry in browser
- 122 separate selectable meshes
- Original GLB materials retained
- Orbit / zoom / fit view
- Click-to-identify mesh IDs for mapping
- Shareable configuration state

## Next milestone
Map mesh IDs into common, H2S, A1, MGN12H, MGN9, Cartographer/Beacon, and MicroProbe groups. After that the controls will actually show/hide the correct geometry and printable downloads can be attached.


## Draco web asset
The master GLB is geometry-compressed with Draco (~22.8 MB). The viewer configures Three.js DRACOLoader from the jsDelivr-hosted Three.js decoder files.
