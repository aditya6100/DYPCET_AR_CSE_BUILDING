import type { FloorData } from './floorTypes';

// =============================================================
// FIRST FLOOR — IT / ECE Department
//
//  Z=-9  ┌──────┬──────┬──────────┬──────┬────────┬──────────┐
//        │ HOD  │DLib  │  Lab IT1 │ Lab  │  Lab   │  Lab IT4 │
//        │ IT   │ IT   │          │ IT2  │  IT3   │          │
//  Z=-1.5├──────┴──────┴──────────┴──────┴────────┴──────────┤
//        │              IT Department Corridor                │
//  Z=+1.5├────┬────┬──────────────┬─────────┬────────────────┤
//        │Lift│Strs│   Lab ECE1   │  Lab    │   Lab ECE3     │
//        │    │    │              │  ECE2   │                │
//  Z=+9  └────┴────┴──────────────┴─────────┴────────────────┘
// =============================================================

export const floor2Data: FloorData = {
  floorId: "f2",
  rooms: [
    // TOP ROW — IT Dept
    { id: "f2_hod_it",    name: "HOD IT",       center: [-22.5, -5.25], connectedTo: ["f2_wp_stairs"]   },
    { id: "f2_dlib_it",   name: "IT Library",   center: [-16,   -5.25], connectedTo: ["f2_wp_stairs"]   },
    { id: "f2_lab_it1",   name: "Lab IT 1",     center: [ -9,   -5.25], connectedTo: ["f2_wp_mid"]      },
    { id: "f2_lab_it2",   name: "Lab IT 2",     center: [ -3,   -5.25], connectedTo: ["f2_wp_mid"]      },
    { id: "f2_lab_it3",   name: "Lab IT 3",     center: [  4,   -5.25], connectedTo: ["f2_wp_mid"]      },
    { id: "f2_lab_it4",   name: "Lab IT 4",     center: [ 14,   -5.25], connectedTo: ["f2_wp_r"]        },
    // CORRIDOR
    { id: "f2_corridor",  name: "IT Corridor",  center: [  0,    0],    connectedTo: ["f2_wp_mid"]      },
    // BOTTOM ROW — ECE Dept
    { id: "f2_lift",      name: "Lift",         center: [-24,    5.25], connectedTo: ["f2_wp_lift"]     },
    { id: "f2_stairs",    name: "Stairs",       center: [-20,    5.25], connectedTo: ["f2_wp_stairs"]   },
    { id: "f2_lab_ece1",  name: "Lab ECE 1",    center: [ -8,    5.25], connectedTo: ["f2_wp_mid"]      },
    { id: "f2_lab_ece2",  name: "Lab ECE 2",    center: [  4,    5.25], connectedTo: ["f2_wp_mid"]      },
    { id: "f2_lab_ece3",  name: "Lab ECE 3",    center: [ 16,    5.25], connectedTo: ["f2_wp_r"]        },
  ],

  waypoints: [
    { id: "f2_wp_lift",   position: [-24, 0], connectedTo: ["f2_wp_stairs"]               },
    { id: "f2_wp_stairs", position: [-19, 0], connectedTo: ["f2_wp_lift",   "f2_wp_l"]    },
    { id: "f2_wp_ramp",   position: [ 22, 0], connectedTo: ["f2_wp_r"]                    },
    { id: "f2_wp_l",      position: [-10, 0], connectedTo: ["f2_wp_stairs", "f2_wp_mid"]  },
    { id: "f2_wp_mid",    position: [  0, 0], connectedTo: ["f2_wp_l",      "f2_wp_r"]    },
    { id: "f2_wp_r",      position: [ 14, 0], connectedTo: ["f2_wp_mid",    "f2_wp_ramp"] },
  ],

  walls: [
    { p1: [-26, -9], p2: [ 26, -9] },
    { p1: [ 26, -9], p2: [ 26,  9] },
    { p1: [ 26,  9], p2: [-26,  9] },
    { p1: [-26,  9], p2: [-26, -9] },
    { p1: [-26, -1.5], p2: [ 26, -1.5] },
    { p1: [-26,  1.5], p2: [ 26,  1.5] },
    // Top row
    { p1: [-19, -9], p2: [-19, -1.5] },
    { p1: [-13, -9], p2: [-13, -1.5] },
    { p1: [ -6, -9], p2: [ -6, -1.5] },
    { p1: [  0, -9], p2: [  0, -1.5] },
    { p1: [  8, -9], p2: [  8, -1.5] },
    // Bottom row
    { p1: [-22,  1.5], p2: [-22,  9] },
    { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] },
    { p1: [ -2,  1.5], p2: [ -2,  9] },
    { p1: [ 10,  1.5], p2: [ 10,  9] },
  ],

  wallHeight: 3,
  wallThickness: 0.2,
  planSize: { width: 52, height: 18 },
};
