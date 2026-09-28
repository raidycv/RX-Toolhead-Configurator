# RX Toolhead V5.5 — V4 Mapping Studio

This is a mapping/verification build, not the final configurator.

- `assets/models/rx-v55-master.glb` is the only coordinate truth.
- `assets/reference/*.glb` are named Shapr3D exports used only as shape/color/size references.
- The mapper compares decoded geometry using rotation-invariant bounding dimensions, triangle density and material color.
- Select a named assembly, review the ranked master-mesh candidate for each reference body, and confirm it.
- High-confidence matches can be accepted in bulk.
- Mapping progress is stored in browser localStorage.
- `Export mapping.json` downloads the confirmed map for integration into the final configurator.
- Known validation: master mesh #39 is the servo.

No named reference GLB is used for final positioning.
