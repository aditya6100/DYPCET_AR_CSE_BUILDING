// =============================================================
// MULTI-FLOOR PATHFINDING
// Builds a unified graph from all floor waypoints + vertical
// connectors (lift/stairs/ramp), then runs A* to find the
// shortest cross-floor path.
// =============================================================

import type { FloorData, Waypoint } from '../data/floorTypes';
import { verticalConnectors } from '../data/floorRegistry';

// ── Unified waypoint (floor-prefixed ID) ─────────────────────
interface UnifiedWaypoint {
  id: string;
  position: [number, number, number]; // [X, Z, floorNumber] for heuristic
  connectedTo: string[];
  floorId: string;
}

// ── Result: a path segment on one floor ──────────────────────
export interface PathSegment {
  floorId: string;
  waypointIds: string[];       // waypoint IDs on this floor (floor-prefixed)
  positions: [number, number][]; // [X, Z] for each waypoint
  transition?: {
    type: 'lift' | 'stairs' | 'ramp';
    name: string;
    fromFloor: string;
    toFloor: string;
  };
}

// ── Build unified waypoint graph ─────────────────────────────
function buildUnifiedGraph(allFloorData: FloorData[]): UnifiedWaypoint[] {
  const unified: UnifiedWaypoint[] = [];

  // Add all floor waypoints (already floor-prefixed by convention)
  for (const floor of allFloorData) {
    for (const wp of floor.waypoints) {
      unified.push({
        id: wp.id,
        position: [wp.position[0], wp.position[1], floor.floorId.replace('f','') as unknown as number],
        connectedTo: [...wp.connectedTo],
        floorId: floor.floorId,
      });
    }
  }

  // Add vertical connector edges
  for (const connector of verticalConnectors) {
    const floorIds = Object.keys(connector.floorWaypoints);
    // Connect adjacent floors through this connector
    for (let i = 0; i < floorIds.length; i++) {
      const floorA = floorIds[i];
      const wpA = connector.floorWaypoints[floorA];
      const nodeA = unified.find(u => u.id === wpA);
      if (!nodeA) continue;

      // Connect to floors above and below
      for (let j = 0; j < floorIds.length; j++) {
        if (i === j) continue;
        const floorB = floorIds[j];
        const wpB = connector.floorWaypoints[floorB];
        if (unified.find(u => u.id === wpB)) {
          if (!nodeA.connectedTo.includes(wpB)) {
            nodeA.connectedTo.push(wpB);
          }
        }
      }
    }
  }

  return unified;
}

// ── Distance heuristic (3D, penalises floor changes) ─────────
function distance3D(a: UnifiedWaypoint, b: UnifiedWaypoint): number {
  const dx = a.position[0] - b.position[0];
  const dz = a.position[1] - b.position[1];
  const df = (a.position[2] - b.position[2]) * 15; // floor penalty
  return Math.sqrt(dx * dx + dz * dz + df * df);
}

// ── A* on unified graph ───────────────────────────────────────
function findUnifiedPath(
  startId: string,
  endId: string,
  graph: UnifiedWaypoint[]
): string[] {
  const openSet = [startId];
  const cameFrom: Record<string, string> = {};
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};

  const endNode = graph.find(w => w.id === endId);
  if (!endNode) return [];

  for (const wp of graph) {
    gScore[wp.id] = Infinity;
    fScore[wp.id] = Infinity;
  }
  gScore[startId] = 0;

  const startNode = graph.find(w => w.id === startId);
  fScore[startId] = startNode ? distance3D(startNode, endNode) : Infinity;

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[a] - fScore[b]);
    const current = openSet.shift()!;
    if (current === endId) {
      // Reconstruct
      const path = [current];
      let c = current;
      while (cameFrom[c]) { c = cameFrom[c]; path.unshift(c); }
      return path;
    }

    const currentNode = graph.find(w => w.id === current);
    if (!currentNode) continue;

    for (const neighborId of currentNode.connectedTo) {
      const neighbor = graph.find(w => w.id === neighborId);
      if (!neighbor) continue;

      // Extra cost for vertical transitions
      let extraCost = 0;
      if (currentNode.floorId !== neighbor.floorId) {
        const connector = verticalConnectors.find(c =>
          Object.values(c.floorWaypoints).includes(current) &&
          Object.values(c.floorWaypoints).includes(neighborId)
        );
        extraCost = connector?.costPerFloor ?? 20;
      }

      const tentative = gScore[current] + distance3D(currentNode, neighbor) + extraCost;
      if (tentative < (gScore[neighborId] ?? Infinity)) {
        cameFrom[neighborId] = current;
        gScore[neighborId] = tentative;
        fScore[neighborId] = tentative + distance3D(neighbor, endNode);
        if (!openSet.includes(neighborId)) openSet.push(neighborId);
      }
    }
  }
  return [];
}

// ── Main export: find multi-floor path ───────────────────────
export function findMultiFloorPath(
  startRoomId: string,
  endRoomId: string,
  allFloorData: FloorData[]
): PathSegment[] {
  // Find which waypoint each room connects to
  let startWpId = '';
  let endWpId = '';
  let startFloorId = '';
  let endFloorId = '';

  for (const floor of allFloorData) {
    const startRoom = floor.rooms.find(r => r.id === startRoomId);
    if (startRoom?.connectedTo[0]) {
      startWpId = startRoom.connectedTo[0];
      startFloorId = floor.floorId;
    }
    const endRoom = floor.rooms.find(r => r.id === endRoomId);
    if (endRoom?.connectedTo[0]) {
      endWpId = endRoom.connectedTo[0];
      endFloorId = floor.floorId;
    }
  }

  if (!startWpId || !endWpId) return [];

  const graph = buildUnifiedGraph(allFloorData);
  const pathIds = findUnifiedPath(startWpId, endWpId, graph);
  if (pathIds.length === 0) return [];

  // Split path into per-floor segments
  const segments: PathSegment[] = [];
  let currentSegment: PathSegment | null = null;

  for (let i = 0; i < pathIds.length; i++) {
    const wpId = pathIds[i];
    const node = graph.find(n => n.id === wpId)!;

    if (!currentSegment || currentSegment.floorId !== node.floorId) {
      // Detect transition type
      let transition: PathSegment['transition'] | undefined;
      if (currentSegment && i > 0) {
        const prevId = pathIds[i - 1];
        const connector = verticalConnectors.find(c =>
          Object.values(c.floorWaypoints).includes(prevId) &&
          Object.values(c.floorWaypoints).includes(wpId)
        );
        if (connector) {
          transition = {
            type: connector.type,
            name: connector.name,
            fromFloor: currentSegment.floorId,
            toFloor: node.floorId,
          };
        }
        if (currentSegment) {
          currentSegment.transition = transition;
        }
      }

      currentSegment = {
        floorId: node.floorId,
        waypointIds: [wpId],
        positions: [[node.position[0], node.position[1]]],
      };
      segments.push(currentSegment);
    } else {
      currentSegment.waypointIds.push(wpId);
      currentSegment.positions.push([node.position[0], node.position[1]]);
    }
  }

  // Tag start/end floor IDs for context
  if (segments.length > 0) {
    (segments[0] as any)._startFloor = startFloorId;
    (segments[segments.length - 1] as any)._endFloor = endFloorId;
  }

  return segments;
}

// ── Helper: get all rooms across all floors (for UI dropdowns) ─
export function getAllRooms(allFloorData: FloorData[]) {
  return allFloorData.flatMap(floor =>
    floor.rooms
      .filter(r => r.connectedTo?.length > 0 && !r.id.endsWith('_corridor'))
      .map(r => ({
        ...r,
        floorId: floor.floorId,
        floorLabel: floor.floorId, // resolved in UI via floorRegistry
      }))
  );
}
