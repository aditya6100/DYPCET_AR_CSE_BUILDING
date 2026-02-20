import type { FloorData } from './floorTypes';

// =============================================================
// SECOND FLOOR — CSE Department (your actual floor)
//
//  Z=-9  ┌──────┬─────┬────────┬─────┬────────┬─────┬────────┐
//        │ HOD  │DLib │ Server │ Tut │ Lab 10 │Strs │ Lab 9  │
//  Z=-1.5├──────┴─────┴────────┴─────┴────────┴─────┴────────┤
//        │          Middle Portion / Corridor (full width)    │
//  Z=+1.5├────┬────┬─────────────────┬─────────┬──────┬──────┤
//        │Lift│Strs│     Lab 7       │  Lab 8  │WomenWR│MenWR│
//  Z=+9  └────┴────┴─────────────────┴─────────┴──────┴──────┘
// =============================================================

export const floor3Data: FloorData = {
  floorId: "f3",
  rooms: [
    // TOP ROW
    { id: "f3_hod",        name: "HOD Cabin",      center: [-22.5, -5.25], connectedTo: ["f3_wp_stairs"] },
    { id: "f3_dept_lib",   name: "Dept Library",   center: [-16.5, -5.25], connectedTo: ["f3_wp_stairs"] },
    { id: "f3_server",     name: "Server Room",    center: [-10,   -5.25], connectedTo: ["f3_wp_lab7"]   },
    { id: "f3_tutorial",   name: "Tutorial Room",  center: [ -4,   -5.25], connectedTo: ["f3_wp_lab7"]   },
    { id: "f3_lab10",      name: "Lab 10",         center: [  1.5, -5.25], connectedTo: ["f3_wp_lab8"]   },
    { id: "f3_stairs_top", name: "Stairs",         center: [  7,   -5.25], connectedTo: ["f3_wp_gents"]  },
    { id: "f3_lab9",       name: "Lab 9",          center: [ 17.5, -5.25], connectedTo: ["f3_wp_lab9"]   },
    // CORRIDOR
    { id: "f3_corridor",   name: "Middle Portion", center: [  0,    0],    connectedTo: ["f3_wp_lab7"]   },
    // BOTTOM ROW
    { id: "f3_lift",       name: "Lift",           center: [-24,    5.25], connectedTo: ["f3_wp_lift"]   },
    { id: "f3_stairs_bot", name: "Stairs",         center: [-20,    5.25], connectedTo: ["f3_wp_stairs"] },
    { id: "f3_lab7",       name: "Lab 7",          center: [-10,    5.25], connectedTo: ["f3_wp_lab7"]   },
    { id: "f3_lab8",       name: "Lab 8",          center: [  1,    5.25], connectedTo: ["f3_wp_lab8"]   },
    { id: "f3_women",      name: "Women Washroom", center: [  7.5,  5.25], connectedTo: ["f3_wp_women"]  },
    { id: "f3_gents",      name: "Men Washroom",   center: [ 14.5,  5.25], connectedTo: ["f3_wp_gents"]  },
  ],

  waypoints: [
    { id: "f3_wp_lift",    position: [-24,  0], connectedTo: ["f3_wp_stairs"]                  },
    { id: "f3_wp_stairs",  position: [-19,  0], connectedTo: ["f3_wp_lift",   "f3_wp_lab7"]    },
    { id: "f3_wp_lab7",    position: [-10,  0], connectedTo: ["f3_wp_stairs", "f3_wp_lab8"]    },
    { id: "f3_wp_lab8",    position: [  1,  0], connectedTo: ["f3_wp_lab7",   "f3_wp_women"]   },
    { id: "f3_wp_women",   position: [7.5,  0], connectedTo: ["f3_wp_lab8",   "f3_wp_gents"]   },
    { id: "f3_wp_gents",   position: [ 14,  0], connectedTo: ["f3_wp_women",  "f3_wp_lab9"]    },
    { id: "f3_wp_lab9",    position: [ 20,  0], connectedTo: ["f3_wp_gents"]                   },
  ],

  walls: [
    { p1: [-26, -9], p2: [ 26, -9] },
    { p1: [ 26, -9], p2: [ 26,  1.5] },
    { p1: [ 26,  1.5], p2: [ 18,  1.5] },
    { p1: [ 18,  1.5], p2: [ 18,  9] },
    { p1: [ 18,  9], p2: [-26,  9] },
    { p1: [-26,  9], p2: [-26, -9] },
    { p1: [-26, -1.5], p2: [ 26, -1.5] },
    { p1: [-26,  1.5], p2: [ 26,  1.5] },
    // Top row dividers
    { p1: [-19, -9], p2: [-19, -1.5] },
    { p1: [-14, -9], p2: [-14, -1.5] },
    { p1: [ -6, -9], p2: [ -6, -1.5] },
    { p1: [ -2, -9], p2: [ -2, -1.5] },
    { p1: [  5, -9], p2: [  5, -1.5] },
    { p1: [  9, -9], p2: [  9, -1.5] },
    // Bottom row dividers
    { p1: [-22,  1.5], p2: [-22,  9] },
    { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] },
    { p1: [ -2,  1.5], p2: [ -2,  9] },
    { p1: [  4,  1.5], p2: [  4,  9] },
    { p1: [ 11,  1.5], p2: [ 11,  9] },
  ],

  wallHeight: 3,
  wallThickness: 0.2,
  planSize: { width: 52, height: 18 },
};
