import type { FloorData } from './floorTypes';

// =============================================================
// GROUND FLOOR — Main Building
// Typical ground floor: Reception, Admin, Seminar Hall, Canteen
//
//  Z=-9  ┌──────────┬──────────┬──────────┬──────────────────┐
//        │ Reception│  Admin   │ Principal│   Seminar Hall   │
//  Z=-1.5├──────────┴──────────┴──────────┴──────────────────┤
//        │                  Main Corridor                     │
//  Z=+1.5├────┬────┬──────────────┬─────────┬────────────────┤
//        │Lift│Strs│    Canteen   │  Store  │  Exam Section  │
//  Z=+9  └────┴────┴──────────────┴─────────┴────────────────┘
// =============================================================

export const floor1Data: FloorData = {
  floorId: "f1",
  rooms: [
    // TOP ROW
    { id: "f1_reception",    name: "Reception",      center: [-20,   -5.25], connectedTo: ["f1_wp_corridor_l"] },
    { id: "f1_admin",        name: "Admin Office",   center: [-10,   -5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_principal",    name: "Principal",      center: [  1,   -5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_seminar",      name: "Seminar Hall",   center: [ 14,   -5.25], connectedTo: ["f1_wp_corridor_r"] },
    // CORRIDOR LABEL
    { id: "f1_corridor",     name: "Main Corridor",  center: [  0,    0],    connectedTo: ["f1_wp_mid"]        },
    // BOTTOM ROW
    { id: "f1_lift",         name: "Lift",           center: [-24,    5.25], connectedTo: ["f1_wp_lift"]       },
    { id: "f1_stairs",       name: "Stairs",         center: [-20,    5.25], connectedTo: ["f1_wp_stairs"]     },
    { id: "f1_canteen",      name: "Canteen",        center: [ -8,    5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_store",        name: "Store Room",     center: [  4,    5.25], connectedTo: ["f1_wp_mid"]        },
    { id: "f1_exam",         name: "Exam Section",   center: [ 14,    5.25], connectedTo: ["f1_wp_corridor_r"] },
    { id: "f1_ramp_room",    name: "Ramp Access",    center: [ 22,    5.25], connectedTo: ["f1_wp_ramp"]       },
  ],

  waypoints: [
    { id: "f1_wp_lift",        position: [-24,  0], connectedTo: ["f1_wp_stairs"]                     },
    { id: "f1_wp_stairs",      position: [-19,  0], connectedTo: ["f1_wp_lift",     "f1_wp_corridor_l"] },
    { id: "f1_wp_ramp",        position: [ 22,  0], connectedTo: ["f1_wp_corridor_r"]                  },
    { id: "f1_wp_corridor_l",  position: [-10,  0], connectedTo: ["f1_wp_stairs",   "f1_wp_mid"]       },
    { id: "f1_wp_mid",         position: [  0,  0], connectedTo: ["f1_wp_corridor_l","f1_wp_corridor_r"] },
    { id: "f1_wp_corridor_r",  position: [ 12,  0], connectedTo: ["f1_wp_mid",      "f1_wp_ramp"]      },
  ],

  walls: [
    // Outer boundary
    { p1: [-26, -9], p2: [ 26, -9] },
    { p1: [ 26, -9], p2: [ 26,  9] },
    { p1: [ 26,  9], p2: [-26,  9] },
    { p1: [-26,  9], p2: [-26, -9] },
    // Corridor walls
    { p1: [-26, -1.5], p2: [ 26, -1.5] },
    { p1: [-26,  1.5], p2: [ 26,  1.5] },
    // Top row dividers
    { p1: [-14, -9], p2: [-14, -1.5] },
    { p1: [ -2, -9], p2: [ -2, -1.5] },
    { p1: [  6, -9], p2: [  6, -1.5] },
    // Bottom row dividers
    { p1: [-22,  1.5], p2: [-22,  9] },
    { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] },
    { p1: [ -2,  1.5], p2: [ -2,  9] },
    { p1: [  8,  1.5], p2: [  8,  9] },
    { p1: [ 18,  1.5], p2: [ 18,  9] },
  ],

  wallHeight: 3,
  wallThickness: 0.2,
  planSize: { width: 52, height: 18 },
};
