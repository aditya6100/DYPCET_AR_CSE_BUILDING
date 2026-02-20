export interface Room {
  id: string;
  name: string;
  center: [number, number];
  connectedTo: string[];
}

export interface Waypoint {
  id: string;
  position: [number, number];
  connectedTo: string[];
}

export interface Wall {
  p1: [number, number];
  p2: [number, number];
}

export interface FloorData {
  floorId: string;
  floorNumber: number;
  floorName: string;
  rooms: Room[];
  waypoints: Waypoint[];
  walls: Wall[];
  wallHeight: number;
  wallThickness: number;
  planSize?: { width: number; height: number };
}
