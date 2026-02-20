// =============================================================
// floorRegistry.ts — Single source of truth for all floors
// Exports: floors (UI labels), verticalConnectors, ALL_FLOORS
// =============================================================

import { floor1Data } from './floors/floor1Data';
import { floor2Data } from './floors/floor2Data';
import { floor3Data } from './floors/floor3Data';
import { floor4Data } from './floors/floor4Data';
import { floor5Data } from './floors/floor5Data';
import { floor6Data } from './floors/floor6Data';
import type { FloorData } from './floorTypes';

// ── Floor label registry (used in NavigationUI dropdowns & route summary) ──
export const floors: { id: string; number: number; label: string }[] = [
  { id: 'f1', number: 1, label: 'Ground Floor'       },
  { id: 'f2', number: 2, label: '1st Floor'           },
  { id: 'f3', number: 3, label: '2nd Floor (CSE)'     },
  { id: 'f4', number: 4, label: '3rd Floor'           },
  { id: 'f5', number: 5, label: '4th Floor'           },
  { id: 'f6', number: 6, label: '5th Floor'           },
];

// ── All floor data in order ───────────────────────────────────────────────
export const ALL_FLOORS: FloorData[] = [
  floor1Data as FloorData,
  floor2Data as FloorData,
  floor3Data as FloorData,
  floor4Data as FloorData,
  floor5Data as FloorData,
  floor6Data as FloorData,
];

// ── Vertical connectors: lift/stairs/ramp linking waypoints across floors ─
// Each entry says "this connector exists at these waypoint IDs per floor"
export const verticalConnectors: {
  name: string;
  type: 'lift' | 'stairs' | 'ramp';
  costPerFloor: number;               // extra A* cost per floor jump
  floorWaypoints: Record<string, string>; // floorId → waypointId
}[] = [
  {
    name: 'Main Lift',
    type: 'lift',
    costPerFloor: 5,
    floorWaypoints: {
      f1: 'f1_wp_lift',
      f2: 'f2_wp_lift',
      f3: 'f3_wp_lift',
      f4: 'f4_wp_lift',
      f5: 'f5_wp_lift',
      f6: 'f6_wp_lift',
    },
  },
  {
    name: 'Main Stairs (Bottom)',
    type: 'stairs',
    costPerFloor: 10,
    floorWaypoints: {
      f1: 'f1_wp_stairs_bot',
      f2: 'f2_wp_stairs_bot',
      f3: 'f3_wp_stairs_bot',
      f4: 'f4_wp_stairs_bot',
      f5: 'f5_wp_stairs_bot',
      f6: 'f6_wp_stairs_bot',
    },
  },
  {
    name: 'Side Stairs (Top)',
    type: 'stairs',
    costPerFloor: 10,
    floorWaypoints: {
      f1: 'f1_wp_stairs_top',
      f2: 'f2_wp_stairs_top',
      f3: 'f3_wp_stairs_top',
      f4: 'f4_wp_stairs_top',
      f5: 'f5_wp_stairs_top',
      f6: 'f6_wp_stairs_top',
    },
  },
];

// ── Helper: get label for a floor ID ─────────────────────────────────────
export function getFloorLabel(floorId: string): string {
  return floors.find(f => f.id === floorId)?.label ?? floorId;
}
