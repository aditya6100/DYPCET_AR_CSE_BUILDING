// =============================================================
// Floor 2 — CSE Department (2nd Floor)
// AUTO-GENERATED from Secondfloorcse.dxf (AutoCAD 2018, AC1032)
//
// Scale: X = 1:1 metres, Z = 7.30/18.0 = 0.4056 (CAD units → metres)
// Verified: Lab 9 width = 10.07m ✓, Tutorial Room = 6.00m ✓
//
// Coordinate system:
//   X: 0 (west/left) → 41.311 (east/right)
//   Z: 0 (north/top) → 7.30  (south/bottom)
//   Corridor centreline: Z ≈ 3.53
//
// Layout (from actual DXF geometry):
//
//  Z=0   ┌────┬──────┬────────┬──────────┬────────┬──────┐
//        │HOD │ DLib │ Server │ Tutorial │ Lab 10 │ Strs │
//  Z=3.53└────┴──────┴────────┴──────────┴────────┴──────┘  ┌─────────┐
//        │         Middle Portion                            │  Lab 9  │
//  Z=4.66├──┬────┬──────────────────────┬────────┬──────────┤(Z:0→7.3)│
//        │Lt│Strs│      Lab 7           │ Lab 8  │ WomenWR  │  MenWR  │
//  Z=7.30└──┴────┴──────────────────────┴────────┴──────────┴─────────┘
// =============================================================

export const floor2Data = {
  floorId: 'f2',
  floorNumber: 2,
  floorName: 'CSE Department (2nd Floor)',

  rooms: [
    // ── TOP ROW (Z: 0 → 3.53) ────────────────────────────────────────────
    { id: 'f2_hod',        name: 'HOD Cabin',      center: [ 2.025, 1.764] as [number,number], connectedTo: ['f2_wp_hod']        },
    { id: 'f2_dept_lib',   name: 'Dept Library',   center: [ 5.541, 1.764] as [number,number], connectedTo: ['f2_wp_lib']        },
    { id: 'f2_server',     name: 'Server Room',    center: [ 9.352, 1.764] as [number,number], connectedTo: ['f2_wp_server']     },
    { id: 'f2_tutorial',   name: 'Tutorial Room',  center: [14.063, 1.764] as [number,number], connectedTo: ['f2_wp_tutorial']   },
    { id: 'f2_lab10',      name: 'Lab 10',         center: [22.942, 1.764] as [number,number], connectedTo: ['f2_wp_lab10']      },
    { id: 'f2_stairs_top', name: 'Stairs',         center: [29.741, 1.678] as [number,number], connectedTo: ['f2_wp_stairs_top'] },

    // ── LAB 9 — full height right column (Z: 0 → 7.30) ──────────────────
    { id: 'f2_lab9',       name: 'Lab 9',          center: [36.276, 3.650] as [number,number], connectedTo: ['f2_wp_lab9']       },

    // ── CORRIDOR (Z: 3.53 → 4.66) ────────────────────────────────────────
    { id: 'f2_corridor',   name: 'Middle Portion', center: [14.887, 4.095] as [number,number], connectedTo: ['f2_wp_lab7']       },

    // ── BOTTOM ROW (Z: 4.66 → 7.30) ──────────────────────────────────────
    { id: 'f2_lift',       name: 'Lift',           center: [ 2.680, 5.894] as [number,number], connectedTo: ['f2_wp_lift']       },
    { id: 'f2_stairs_bot', name: 'Stairs',         center: [ 6.601, 5.894] as [number,number], connectedTo: ['f2_wp_stairs_bot'] },
    { id: 'f2_lab7',       name: 'Lab 7',          center: [14.043, 5.979] as [number,number], connectedTo: ['f2_wp_lab7']       },
    { id: 'f2_lab8',       name: 'Lab 8',          center: [23.191, 5.979] as [number,number], connectedTo: ['f2_wp_lab8']       },
    { id: 'f2_women',      name: 'Women Washroom', center: [29.576, 5.979] as [number,number], connectedTo: ['f2_wp_women']      },
    { id: 'f2_gents',      name: 'Men Washroom',   center: [35.461, 6.182] as [number,number], connectedTo: ['f2_wp_gents']      },
  ],

  // Waypoints on corridor centreline Z = 4.095
  waypoints: [
    { id: 'f2_wp_lift',       position: [ 2.680, 4.095] as [number,number], connectedTo: ['f2_wp_stairs_bot'] },
    { id: 'f2_wp_stairs_bot', position: [ 6.601, 4.095] as [number,number], connectedTo: ['f2_wp_lift',  'f2_wp_lab7',  'f1_wp_stairs_bot', 'f3_wp_stairs_bot'] },
    { id: 'f2_wp_hod',        position: [ 2.025, 4.095] as [number,number], connectedTo: ['f2_wp_stairs_bot', 'f2_wp_lib'] },
    { id: 'f2_wp_lib',        position: [ 5.541, 4.095] as [number,number], connectedTo: ['f2_wp_hod',         'f2_wp_server'] },
    { id: 'f2_wp_server',     position: [ 9.352, 4.095] as [number,number], connectedTo: ['f2_wp_lib',         'f2_wp_tutorial'] },
    { id: 'f2_wp_tutorial',   position: [14.063, 4.095] as [number,number], connectedTo: ['f2_wp_server',      'f2_wp_lab10'] },
    { id: 'f2_wp_lab10',      position: [22.942, 4.095] as [number,number], connectedTo: ['f2_wp_tutorial',    'f2_wp_stairs_top'] },
    { id: 'f2_wp_stairs_top', position: [29.741, 4.095] as [number,number], connectedTo: ['f2_wp_lab10', 'f2_wp_lab9',  'f1_wp_stairs_top', 'f3_wp_stairs_top'] },
    { id: 'f2_wp_lab7',       position: [14.043, 4.095] as [number,number], connectedTo: ['f2_wp_stairs_bot',  'f2_wp_lab8'] },
    { id: 'f2_wp_lab8',       position: [23.191, 4.095] as [number,number], connectedTo: ['f2_wp_lab7',        'f2_wp_women'] },
    { id: 'f2_wp_women',      position: [29.576, 4.095] as [number,number], connectedTo: ['f2_wp_lab8',        'f2_wp_gents'] },
    { id: 'f2_wp_gents',      position: [35.461, 4.095] as [number,number], connectedTo: ['f2_wp_women',       'f2_wp_lab9'] },
    { id: 'f2_wp_lab9',       position: [36.276, 4.095] as [number,number], connectedTo: ['f2_wp_stairs_top',  'f2_wp_gents'] },
  ],

walls: [
    // ── OUTER BOUNDARY ────────────────────────────────────────────────────
    { p1: [ 0.000, 0.000] as [number,number], p2: [41.311, 0.000] as [number,number] },
    { p1: [41.311, 0.000] as [number,number], p2: [41.311, 7.300] as [number,number] },
    { p1: [41.311, 7.300] as [number,number], p2: [ 0.000, 7.300] as [number,number] },
    { p1: [ 0.000, 7.300] as [number,number], p2: [ 0.000, 0.000] as [number,number] },

    // ── LIFT AREA ─────────────────────────────────────────────────────────
    { p1: [ 0.000, 6.489] as [number,number], p2: [ 5.360, 6.489] as [number,number] },
    { p1: [ 0.049, 3.528] as [number,number], p2: [ 0.000, 6.489] as [number,number] },

    // ── CORRIDOR WALLS ────────────────────────────────────────────────────
    { p1: [ 0.049, 3.528] as [number,number], p2: [ 4.049, 3.539] as [number,number] },
    { p1: [ 5.041, 3.539] as [number,number], p2: [ 6.041, 3.539] as [number,number] },
    { p1: [ 6.041, 3.539] as [number,number], p2: [ 9.127, 3.534] as [number,number] },
    { p1: [ 9.677, 3.536] as [number,number], p2: [11.063, 3.536] as [number,number] },
    { p1: [11.063, 3.536] as [number,number], p2: [17.063, 3.520] as [number,number] },
    { p1: [18.442, 3.520] as [number,number], p2: [26.442, 3.499] as [number,number] },
    // ❌ REMOVED: stairs front walls
    { p1: [31.241, 3.495] as [number,number], p2: [31.241, 0.000] as [number,number] },

    // Bottom of corridor / top of bottom rooms
    { p1: [ 8.740, 4.659] as [number,number], p2: [17.063, 4.659] as [number,number] },
    { p1: [18.463, 4.659] as [number,number], p2: [26.442, 4.659] as [number,number] },

    // ── TOP ROW DIVIDERS ──────────────────────────────────────────────────
    { p1: [ 6.041, 3.539] as [number,number], p2: [ 6.041, 0.000] as [number,number] },
    { p1: [ 9.677, 3.541] as [number,number], p2: [ 9.677, 0.000] as [number,number] },
    { p1: [15.563, 3.536] as [number,number], p2: [15.563, 0.000] as [number,number] },
    { p1: [19.442, 3.520] as [number,number], p2: [19.442, 0.000] as [number,number] },
    { p1: [28.241, 3.495] as [number,number], p2: [28.241, 0.000] as [number,number] },

    // ── LAB 9 BOUNDARY ────────────────────────────────────────────────────
    { p1: [31.241, 4.359] as [number,number], p2: [41.311, 4.359] as [number,number] },
    { p1: [41.311, 4.359] as [number,number], p2: [41.311, 5.065] as [number,number] },
    { p1: [41.311, 5.065] as [number,number], p2: [41.311, 0.000] as [number,number] },

    // ── BOTTOM ROW DIVIDERS ───────────────────────────────────────────────
    { p1: [ 8.740, 5.069] as [number,number], p2: [ 8.740, 7.300] as [number,number] },
    { p1: [19.442, 4.659] as [number,number], p2: [19.442, 7.300] as [number,number] },
    { p1: [27.911, 5.065] as [number,number], p2: [27.911, 7.300] as [number,number] },
    { p1: [27.911, 5.065] as [number,number], p2: [28.311, 5.065] as [number,number] },
    { p1: [29.211, 5.065] as [number,number], p2: [35.011, 5.065] as [number,number] },
    { p1: [34.811, 5.065] as [number,number], p2: [34.811, 7.300] as [number,number] },
    { p1: [35.911, 5.065] as [number,number], p2: [41.311, 5.065] as [number,number] },
],

  wallHeight: 3.00,
  wallThickness: 0.15,
  planSize: { width: 41.311, height: 7.300 },
};
