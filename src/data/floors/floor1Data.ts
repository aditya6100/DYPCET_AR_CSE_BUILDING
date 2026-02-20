// =============================================================
// Floor 1 — Ground Floor
// Main entrance, Admin block, Canteen, Principal Office
//
//  Z=-9  ┌──────────┬──────────┬──────────┬──────┬───────────┐
//        │ Principal│  Admin   │ Conf Room│Strs  │  Lab 1    │
//  Z=-1.5├──────────┴──────────┴──────────┴──────┴───────────┤
//        │              Main Corridor (full width)            │
//  Z=+1.5├──────┬──────┬───────────────────┬─────────┬───────┤
//        │ Lift │Strs  │     Canteen        │ Library │Ramp   │
//  Z=+9  └──────┴──────┴───────────────────┴─────────┴───────┘
//        X=-26   -22  -18                  2         12     18
// =============================================================

export const floor1Data = {
  floorId: 'f1',
  floorNumber: 1,
  floorName: "Ground Floor",

  rooms: [
    // TOP ROW
    { id: "f1_principal", name: "Principal Office", center: [-20,  -5.25], connectedTo: ["f1_wp_stairs_bot"] },
    { id: "f1_admin",     name: "Admin Office",     center: [-10,  -5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_conf",      name: "Conference Room",  center: [ -1,  -5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_stairs_top",name: "Stairs",           center: [  7,  -5.25], connectedTo: ["f1_wp_stairs_top"] },
    { id: "f1_lab1",      name: "Lab 1",            center: [ 17.5,-5.25], connectedTo: ["f1_wp_lab1"]       },

    // CORRIDOR label
    { id: "f1_corridor",  name: "Main Corridor",    center: [  0,   0],    connectedTo: ["f1_wp_mid"]        },

    // BOTTOM ROW
    { id: "f1_lift",      name: "Lift",             center: [-24,   5.25], connectedTo: ["f1_wp_lift"]       },
    { id: "f1_stairs_bot",name: "Stairs",           center: [-20,   5.25], connectedTo: ["f1_wp_stairs_bot"] },
    { id: "f1_canteen",   name: "Canteen",          center: [ -8,   5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_library",   name: "Library",          center: [  7,   5.25], connectedTo: ["f1_wp_library"]    },
    { id: "f1_ramp",      name: "Ramp",             center: [ 14.5, 5.25], connectedTo: ["f1_wp_ramp"]       },
  ],

  waypoints: [
    // position: [X, Z]
    { id: "f1_wp_lift",       position: [-24,  0], connectedTo: ["f1_wp_stairs_bot",                    "f2_wp_lift"] },
    { id: "f1_wp_stairs_bot", position: [-19,  0], connectedTo: ["f1_wp_lift",  "f1_wp_mid",             "f2_wp_stairs_bot"] },
    { id: "f1_wp_mid",        position: [  0,  0], connectedTo: ["f1_wp_stairs_bot", "f1_wp_library"]   },
    { id: "f1_wp_library",    position: [  7,  0], connectedTo: ["f1_wp_mid",        "f1_wp_ramp"]      },
    { id: "f1_wp_ramp",       position: [ 14,  0], connectedTo: ["f1_wp_library",    "f1_wp_lab1",      "f2_wp_ramp"] },
    { id: "f1_wp_lab1",       position: [ 20,  0], connectedTo: ["f1_wp_ramp"]                          },
    { id: "f1_wp_stairs_top", position: [  7, -5], connectedTo: ["f1_wp_mid",                           "f2_wp_stairs_top"] },
  ],

  walls: [
    // Outer boundary
    { p1: [-26, -9], p2: [ 26, -9] },
    { p1: [ 26, -9], p2: [ 26,  1.5] },
    { p1: [ 26,  1.5], p2: [ 18,  1.5] },
    { p1: [ 18,  1.5], p2: [ 18,  9] },
    { p1: [ 18,  9],  p2: [-26,  9] },
    { p1: [-26,  9],  p2: [-26, -9] },
    // Corridor walls
    { p1: [-26, -1.5], p2: [ 26, -1.5] },
    { p1: [-26,  1.5], p2: [ 26,  1.5] },
    // Top row dividers
    { p1: [-14, -9], p2: [-14, -1.5] },
    { p1: [ -4, -9], p2: [ -4, -1.5] },
    { p1: [  4, -9], p2: [  4, -1.5] },
    { p1: [  9, -9], p2: [  9, -1.5] },
    // Lab 1 separator (top right)
    { p1: [  9, -9], p2: [  9, -1.5] },
    // Bottom row dividers
    { p1: [-22,  1.5], p2: [-22,  9] },
    { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] },
    { p1: [  2,  1.5], p2: [  2,  9] },
    { p1: [ 12,  1.5], p2: [ 12,  9] },
  ],

  wallHeight: 3,
  wallThickness: 0.2,
};
