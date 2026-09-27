# RX Toolhead Configurator
Interactive web configurator for the RX Toolhead V5.5.

## Current configuration groups discovered in the master STEP
- H2S Extruder Gear system / Main Body for H2S Extruder gear
- A1 gear setup parts / main body for A1 Gear
- MGN12H carriage
- MGN9 gantry / RX MGN9 carriage mount
- Cartographer / Beacon + carto mount
- BIQU MicroProbe carriage mount

The source STEP also contains electronics, hotend, fasteners, magnets, filament cutter, EBB36 setup and alternative parts. These will be classified as printable/configurable/reference hardware during the CAD cleanup pass.

## Run locally
Because browser modules cannot reliably run from `file://`, use a small local server:

```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Model pipeline
The browser uses lightweight `.glb` assets, while STEP remains the master CAD/download format. Export configurable groups from the same Shapr3D assembly **without moving them**, preserving the common origin. Put the resulting GLBs in `assets/models/` with the names referenced in `src/config.js`.

## GitHub Pages
After pushing this repository to GitHub, go to Settings > Pages > Build and deployment > Deploy from a branch, select `main` and `/ (root)`, then Save.
