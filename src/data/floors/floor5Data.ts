// =============================================================
// Floor 5 — Placeholder (add your actual layout here)
// Cross-connected via Lift, Stairs, and Ramp
// =============================================================

export const floor5Data = {
  floorId: 'f5',
  floorNumber: 5,
  floorName: "Floor 5 (Placeholder)",

  rooms: [
    // TOP ROW
    { id: "f5_classA",  name: "Classroom A",  center: [-20,  -5.25], connectedTo: ["f5_wp_stairs_bot"] },
    { id: "f5_classB",  name: "Classroom B",  center: [-10,  -5.25], connectedTo: ["f5_wp_mid"]        },
    { id: "f5_classC",  name: "Classroom C",  center: [  0,  -5.25], connectedTo: ["f5_wp_mid"]        },
    { id: "f5_stairs_top", name: "Stairs",    center: [  7,  -5.25], connectedTo: ["f5_wp_stairs_top"] },
    { id: "f5_lab_a",   name: "Lab A",        center: [ 17.5,-5.25], connectedTo: ["f5_wp_right"]      },
    // CORRIDOR
    { id: "f5_corridor", name: "Corridor",    center: [  0,   0],    connectedTo: ["f5_wp_mid"]        },
    // BOTTOM ROW
    { id: "f5_lift",    name: "Lift",         center: [-24,   5.25], connectedTo: ["f5_wp_lift"]       },
    { id: "f5_stairs_bot", name: "Stairs",    center: [-20,   5.25], connectedTo: ["f5_wp_stairs_bot"] },
    { id: "f5_seminar", name: "Seminar Hall", center: [ -8,   5.25], connectedTo: ["f5_wp_mid"]        },
    { id: "f5_faculty", name: "Faculty Room", center: [  6,   5.25], connectedTo: ["f5_wp_right"]      },
    { id: "f5_ramp",    name: "Ramp",         center: [ 14.5, 5.25], connectedTo: ["f5_wp_ramp"]       },
  ],

  waypoints: [
    { id: "f5_wp_lift",       position: [-24, 0], connectedTo: ["f5_wp_stairs_bot", "f4_wp_lift", "f6_wp_lift"]   },
    { id: "f5_wp_stairs_bot", position: [-19, 0], connectedTo: ["f5_wp_lift", "f5_wp_mid", "f4_wp_stairs_bot", "f6_wp_stairs_bot"] },
    { id: "f5_wp_mid",        position: [  0, 0], connectedTo: ["f5_wp_stairs_bot", "f5_wp_right"] },
    { id: "f5_wp_right",      position: [ 12, 0], connectedTo: ["f5_wp_mid", "f5_wp_ramp"]   },
    { id: "f5_wp_ramp",       position: [ 14, 0], connectedTo: ["f5_wp_right", "f4_wp_ramp", "f6_wp_ramp"]        },
    { id: "f5_wp_stairs_top", position: [  7,-5], connectedTo: ["f5_wp_mid", "f4_wp_stairs_top", "f6_wp_stairs_top"] },
  ],

  walls: [
    { p1: [-26, -9], p2: [ 26, -9] },
    { p1: [ 26, -9], p2: [ 26,  1.5] },
    { p1: [ 26,  1.5], p2: [ 18,  1.5] },
    { p1: [ 18,  1.5], p2: [ 18,  9] },
    { p1: [ 18,  9],  p2: [-26,  9] },
    { p1: [-26,  9],  p2: [-26, -9] },
    { p1: [-26, -1.5], p2: [ 26, -1.5] },
    { p1: [-26,  1.5], p2: [ 26,  1.5] },
    { p1: [-14, -9], p2: [-14, -1.5] },
    { p1: [ -4, -9], p2: [ -4, -1.5] },
    { p1: [  4, -9], p2: [  4, -1.5] },
    { p1: [  9, -9], p2: [  9, -1.5] },
    { p1: [-22,  1.5], p2: [-22,  9] },
    { p1: [-18,  1.5], p2: [-18,  9] },
    { p1: [-20,  1.5], p2: [-20,  9] },
    { p1: [  2,  1.5], p2: [  2,  9] },
    { p1: [ 12,  1.5], p2: [ 12,  9] },
  ],

  wallHeight: 3,
  wallThickness: 0.2,
};
