// =============================================================
// CSE Department - Second Floor  — FINAL CORRECT LAYOUT
//
//  Z=-9  ┌──────┬─────┬────────┬─────┬────────┬─────┬──────────┐
//        │ HOD  │DLib │ Server │ Tut │ Lab 10 │Strs │  Lab 9   │
//  Z=-1.5├──────┴─────┴────────┴─────┴────────┴─────┴──────────┤
//        │          Middle Portion / Corridor (full width)      │
//  Z=+1.5├────┬────┬─────────────────┬─────────┬──────────┬─────┤
//        │Lift│Strs│     Lab 7       │  Lab 8  │ Women WR │MenWR│
//  Z=+9  └────┴────┴─────────────────┴─────────┴──────────┴─────┘
//        X=-26  -22 -18             -2         4         11    18
//
// Key:
//   Top row  (Z -9 → -1.5): HOD(-26→-19) | DLib(-19→-14) | Server(-14→-6)
//                           | Tutorial(-6→-2) | Lab10(-2→5) | Stairs(5→9) | Lab9(9→26)
//   Corridor (Z -1.5→+1.5): FULL width -26 → 26
//   Bottom   (Z +1.5→+9):   Lift(-26→-22) | Stairs(-22→-18) | Lab7(-18→-2)
//                           | Lab8(-2→4) | Women(4→11) | Men(11→18)
// =============================================================

export const floorPlanData = {
  rooms: [
    // ── TOP ROW (Z: -9 → -1.5) ──────────────────────────────────────────────
    { id: "hod",        name: "HOD Cabin",      center: [-22.5, -5.25], connectedTo: ["wp_stairs_bot"] },
    { id: "dept_lib",   name: "Dept Library",   center: [-16.5, -5.25], connectedTo: ["wp_stairs_bot"] },
    { id: "server",     name: "Server Room",    center: [-10,   -5.25], connectedTo: ["wp_lab7"]       },
    { id: "tutorial",   name: "Tutorial Room",  center: [ -4,   -5.25], connectedTo: ["wp_lab7"]       },
    { id: "lab10",      name: "Lab 10",         center: [  1.5, -5.25], connectedTo: ["wp_lab8"]       },
    { id: "stairs_top", name: "Stairs",         center: [  7,   -5.25], connectedTo: ["wp_gents"]      },
    // Lab 9 — top-right (X: 9→26, Z: -9→-1.5) same height as top row
    { id: "lab9",       name: "Lab 9",          center: [ 17.5, -5.25], connectedTo: ["wp_lab9"]       },

    // ── CORRIDOR — full width (Z: -1.5 → +1.5, X: -26 → 26) ────────────────
    { id: "corridor",   name: "Middle Portion", center: [  0,    0],    connectedTo: ["wp_lab7"]       },

    // ── BOTTOM ROW (Z: +1.5 → +9) ────────────────────────────────────────────
    { id: "lift",       name: "Lift",           center: [-24,    5.25], connectedTo: ["wp_lift"]       },
    { id: "stairs_bot", name: "Stairs",         center: [-20,    5.25], connectedTo: ["wp_stairs_bot"] },
    { id: "lab7",       name: "Lab 7",          center: [-10,    5.25], connectedTo: ["wp_lab7"]       },
    { id: "lab8",       name: "Lab 8",          center: [  1,    5.25], connectedTo: ["wp_lab8"]       },
    { id: "women",      name: "Women Washroom", center: [  7.5,  5.25], connectedTo: ["wp_women"]      },
    { id: "gents",      name: "Men Washroom",   center: [ 14.5,  5.25], connectedTo: ["wp_gents"]      },
  ],

  waypoints: [
    // position: [X, Z] — corridor spine at Z=0, spanning full width
    { id: "wp_lift",       position: [-24,  0], connectedTo: ["wp_stairs_bot"]                },
    { id: "wp_stairs_bot", position: [-19,  0], connectedTo: ["wp_lift",    "wp_lab7"]        },
    { id: "wp_lab7",       position: [-10,  0], connectedTo: ["wp_stairs_bot", "wp_lab8"]     },
    { id: "wp_lab8",       position: [  1,  0], connectedTo: ["wp_lab7",    "wp_women"]       },
    { id: "wp_women",      position: [7.5,  0], connectedTo: ["wp_lab8",    "wp_gents"]       },
    { id: "wp_gents",      position: [ 14,  0], connectedTo: ["wp_women",   "wp_lab9"]        },
    { id: "wp_lab9",       position: [ 20,  0], connectedTo: ["wp_gents"]                     },
  ],

  walls: [
    // ===== OUTER BOUNDARY =====
    // Top wall (Z=-9), full width
    { p1: [-26, -9], p2: [ 26, -9] },
    // Right wall (X=26), top row + corridor height only (Z: -9 → +1.5)
    // Then bottom row right wall at X=18
    { p1: [ 26, -9], p2: [ 26,  1.5] },
    // Bottom wall of corridor on right side connects to bottom row
    { p1: [ 26,  1.5], p2: [ 18,  1.5] },  // top of Men WR (right stub)
    // Men WR right wall
    { p1: [ 18,  1.5], p2: [ 18,  9] },
    // Bottom wall of bottom row
    { p1: [ 18,  9], p2: [-26,  9] },
    // Left wall, full height
    { p1: [-26,  9], p2: [-26, -9] },

    // ===== CORRIDOR WALLS (horizontal) =====
    // Bottom of top rooms / top of corridor
    { p1: [-26, -1.5], p2: [ 26, -1.5] },
    // Bottom of corridor / top of bottom row
    { p1: [-26,  1.5], p2: [ 26,  1.5] },

    // ===== TOP ROW VERTICAL DIVIDERS (Z: -9 → -1.5) =====
    { p1: [-19, -9], p2: [-19, -1.5] },    // HOD | Dept Library
    { p1: [-14, -9], p2: [-14, -1.5] },    // Dept Library | Server Room
    { p1: [ -6, -9], p2: [ -6, -1.5] },    // Server Room | Tutorial Room
    { p1: [ -2, -9], p2: [ -2, -1.5] },    // Tutorial Room | Lab 10
    { p1: [  5, -9], p2: [  5, -1.5] },    // Lab 10 | Stairs (top)
    { p1: [  9, -9], p2: [  9, -1.5] },    // Stairs (top) | Lab 9

    // ===== BOTTOM ROW VERTICAL DIVIDERS (Z: +1.5 → +9) =====
    { p1: [-22,  1.5], p2: [-22,  9] },    // Lift | Stairs (bot)
    { p1: [-18,  1.5], p2: [-18,  9] },    // Stairs (bot) | Lab 7
    { p1: [-20,  1.5], p2: [-20,  9] },    // inner staircase divider
    { p1: [ -2,  1.5], p2: [ -2,  9] },    // Lab 7 | Lab 8
    { p1: [  4,  1.5], p2: [  4,  9] },    // Lab 8 | Women Washroom
    { p1: [ 11,  1.5], p2: [ 11,  9] },    // Women Washroom | Men Washroom
  ],

  wallHeight: 3,
  wallThickness: 0.2,
  planSize: { width: 52, height: 18 },
};
