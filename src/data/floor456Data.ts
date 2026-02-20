import type { FloorData } from './floorTypes';

// =============================================================
// THIRD FLOOR — Mechanical / Civil Department (placeholder)
// =============================================================
export const floor4Data: FloorData = {
  floorId: "f4",
  rooms: [
    { id: "f4_hod",       name: "HOD Mech",      center: [-22.5, -5.25], connectedTo: ["f4_wp_stairs"] },
    { id: "f4_dlib",      name: "Mech Library",  center: [-16,   -5.25], connectedTo: ["f4_wp_stairs"] },
    { id: "f4_lab_m1",    name: "Mech Lab 1",    center: [ -8,   -5.25], connectedTo: ["f4_wp_mid"]    },
    { id: "f4_lab_m2",    name: "Mech Lab 2",    center: [  2,   -5.25], connectedTo: ["f4_wp_mid"]    },
    { id: "f4_lab_m3",    name: "Mech Lab 3",    center: [ 12,   -5.25], connectedTo: ["f4_wp_mid"]    },
    { id: "f4_corridor",  name: "Corridor",      center: [  0,    0],    connectedTo: ["f4_wp_mid"]    },
    { id: "f4_lift",      name: "Lift",          center: [-24,    5.25], connectedTo: ["f4_wp_lift"]   },
    { id: "f4_stairs",    name: "Stairs",        center: [-20,    5.25], connectedTo: ["f4_wp_stairs"] },
    { id: "f4_lab_c1",    name: "Civil Lab 1",   center: [ -8,    5.25], connectedTo: ["f4_wp_mid"]    },
    { id: "f4_lab_c2",    name: "Civil Lab 2",   center: [  4,    5.25], connectedTo: ["f4_wp_mid"]    },
    { id: "f4_lab_c3",    name: "Civil Lab 3",   center: [ 15,    5.25], connectedTo: ["f4_wp_mid"]    },
    { id: "f4_staff",     name: "Staff Room",    center: [ 22,   -5.25], connectedTo: ["f4_wp_r"]      },
  ],
  waypoints: [
    { id: "f4_wp_lift",   position: [-24, 0], connectedTo: ["f4_wp_stairs"]              },
    { id: "f4_wp_stairs", position: [-19, 0], connectedTo: ["f4_wp_lift",   "f4_wp_l"]  },
    { id: "f4_wp_l",      position: [-10, 0], connectedTo: ["f4_wp_stairs", "f4_wp_mid"] },
    { id: "f4_wp_mid",    position: [  0, 0], connectedTo: ["f4_wp_l",      "f4_wp_r"]  },
    { id: "f4_wp_r",      position: [ 14, 0], connectedTo: ["f4_wp_mid"]                },
  ],
  walls: [
    { p1: [-26, -9], p2: [ 26, -9] }, { p1: [ 26, -9], p2: [ 26,  9] },
    { p1: [ 26,  9], p2: [-26,  9] }, { p1: [-26,  9], p2: [-26, -9] },
    { p1: [-26, -1.5], p2: [ 26, -1.5] }, { p1: [-26,  1.5], p2: [ 26,  1.5] },
    { p1: [-19, -9], p2: [-19, -1.5] }, { p1: [-13, -9], p2: [-13, -1.5] },
    { p1: [ -2, -9], p2: [ -2, -1.5] }, { p1: [  6, -9], p2: [  6, -1.5] },
    { p1: [ 18, -9], p2: [ 18, -1.5] },
    { p1: [-22,  1.5], p2: [-22,  9] }, { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] }, { p1: [ -2,  1.5], p2: [ -2,  9] },
    { p1: [ 10,  1.5], p2: [ 10,  9] },
  ],
  wallHeight: 3, wallThickness: 0.2, planSize: { width: 52, height: 18 },
};

// =============================================================
// FOURTH FLOOR — MBA / Management Department (placeholder)
// =============================================================
export const floor5Data: FloorData = {
  floorId: "f5",
  rooms: [
    { id: "f5_hod",       name: "HOD MBA",       center: [-22.5, -5.25], connectedTo: ["f5_wp_stairs"] },
    { id: "f5_dlib",      name: "MBA Library",   center: [-15,   -5.25], connectedTo: ["f5_wp_stairs"] },
    { id: "f5_class1",    name: "Classroom 1",   center: [ -6,   -5.25], connectedTo: ["f5_wp_mid"]    },
    { id: "f5_class2",    name: "Classroom 2",   center: [  4,   -5.25], connectedTo: ["f5_wp_mid"]    },
    { id: "f5_class3",    name: "Classroom 3",   center: [ 14,   -5.25], connectedTo: ["f5_wp_mid"]    },
    { id: "f5_corridor",  name: "Corridor",      center: [  0,    0],    connectedTo: ["f5_wp_mid"]    },
    { id: "f5_lift",      name: "Lift",          center: [-24,    5.25], connectedTo: ["f5_wp_lift"]   },
    { id: "f5_stairs",    name: "Stairs",        center: [-20,    5.25], connectedTo: ["f5_wp_stairs"] },
    { id: "f5_seminar",   name: "Seminar Hall",  center: [ -6,    5.25], connectedTo: ["f5_wp_mid"]    },
    { id: "f5_board",     name: "Board Room",    center: [  6,    5.25], connectedTo: ["f5_wp_mid"]    },
    { id: "f5_women_wr",  name: "Women WR",      center: [ 16,    5.25], connectedTo: ["f5_wp_r"]      },
    { id: "f5_men_wr",    name: "Men WR",        center: [ 22,    5.25], connectedTo: ["f5_wp_r"]      },
  ],
  waypoints: [
    { id: "f5_wp_lift",   position: [-24, 0], connectedTo: ["f5_wp_stairs"]               },
    { id: "f5_wp_stairs", position: [-19, 0], connectedTo: ["f5_wp_lift",   "f5_wp_l"]   },
    { id: "f5_wp_l",      position: [-10, 0], connectedTo: ["f5_wp_stairs", "f5_wp_mid"] },
    { id: "f5_wp_mid",    position: [  0, 0], connectedTo: ["f5_wp_l",      "f5_wp_r"]   },
    { id: "f5_wp_r",      position: [ 18, 0], connectedTo: ["f5_wp_mid"]                 },
  ],
  walls: [
    { p1: [-26, -9], p2: [ 26, -9] }, { p1: [ 26, -9], p2: [ 26,  9] },
    { p1: [ 26,  9], p2: [-26,  9] }, { p1: [-26,  9], p2: [-26, -9] },
    { p1: [-26, -1.5], p2: [ 26, -1.5] }, { p1: [-26,  1.5], p2: [ 26,  1.5] },
    { p1: [-19, -9], p2: [-19, -1.5] }, { p1: [-11, -9], p2: [-11, -1.5] },
    { p1: [ -2, -9], p2: [ -2, -1.5] }, { p1: [  8, -9], p2: [  8, -1.5] },
    { p1: [-22,  1.5], p2: [-22,  9] }, { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] }, { p1: [ -2,  1.5], p2: [ -2,  9] },
    { p1: [ 12,  1.5], p2: [ 12,  9] }, { p1: [ 20,  1.5], p2: [ 20,  9] },
  ],
  wallHeight: 3, wallThickness: 0.2, planSize: { width: 52, height: 18 },
};

// =============================================================
// FIFTH FLOOR — Research / PG Department (placeholder)
// =============================================================
export const floor6Data: FloorData = {
  floorId: "f6",
  rooms: [
    { id: "f6_hod",       name: "HOD Research",  center: [-22.5, -5.25], connectedTo: ["f6_wp_stairs"] },
    { id: "f6_research1", name: "Research Lab 1",center: [-12,   -5.25], connectedTo: ["f6_wp_mid"]    },
    { id: "f6_research2", name: "Research Lab 2",center: [ -2,   -5.25], connectedTo: ["f6_wp_mid"]    },
    { id: "f6_research3", name: "Research Lab 3",center: [  9,   -5.25], connectedTo: ["f6_wp_mid"]    },
    { id: "f6_conf",      name: "Conference Rm", center: [ 20,   -5.25], connectedTo: ["f6_wp_r"]      },
    { id: "f6_corridor",  name: "Corridor",      center: [  0,    0],    connectedTo: ["f6_wp_mid"]    },
    { id: "f6_lift",      name: "Lift",          center: [-24,    5.25], connectedTo: ["f6_wp_lift"]   },
    { id: "f6_stairs",    name: "Stairs",        center: [-20,    5.25], connectedTo: ["f6_wp_stairs"] },
    { id: "f6_pg_lab1",   name: "PG Lab 1",      center: [ -8,    5.25], connectedTo: ["f6_wp_mid"]    },
    { id: "f6_pg_lab2",   name: "PG Lab 2",      center: [  6,    5.25], connectedTo: ["f6_wp_mid"]    },
    { id: "f6_server",    name: "Server Room",   center: [ 18,    5.25], connectedTo: ["f6_wp_r"]      },
  ],
  waypoints: [
    { id: "f6_wp_lift",   position: [-24, 0], connectedTo: ["f6_wp_stairs"]               },
    { id: "f6_wp_stairs", position: [-19, 0], connectedTo: ["f6_wp_lift",   "f6_wp_l"]   },
    { id: "f6_wp_l",      position: [-10, 0], connectedTo: ["f6_wp_stairs", "f6_wp_mid"] },
    { id: "f6_wp_mid",    position: [  0, 0], connectedTo: ["f6_wp_l",      "f6_wp_r"]   },
    { id: "f6_wp_r",      position: [ 16, 0], connectedTo: ["f6_wp_mid"]                 },
  ],
  walls: [
    { p1: [-26, -9], p2: [ 26, -9] }, { p1: [ 26, -9], p2: [ 26,  9] },
    { p1: [ 26,  9], p2: [-26,  9] }, { p1: [-26,  9], p2: [-26, -9] },
    { p1: [-26, -1.5], p2: [ 26, -1.5] }, { p1: [-26,  1.5], p2: [ 26,  1.5] },
    { p1: [-19, -9], p2: [-19, -1.5] }, { p1: [ -5, -9], p2: [ -5, -1.5] },
    { p1: [  1, -9], p2: [  1, -1.5] }, { p1: [ 14, -9], p2: [ 14, -1.5] },
    { p1: [-22,  1.5], p2: [-22,  9] }, { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] }, { p1: [ -2,  1.5], p2: [ -2,  9] },
    { p1: [ 12,  1.5], p2: [ 12,  9] },
  ],
  wallHeight: 3, wallThickness: 0.2, planSize: { width: 52, height: 18 },
};
