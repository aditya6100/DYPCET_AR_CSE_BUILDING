import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createWalls } from './Walls';
import { findPath } from '../utils/pathfinding';
import type { FloorData } from '../data/floorTypes';
import type { PathSegment } from '../utils/multiFloorPathfinding';

interface ArrowElement {
  cone: THREE.Mesh;
  shaft: THREE.Mesh;
  ring: THREE.Mesh;
  coneGeo: THREE.ConeGeometry;
  coneMat: THREE.MeshPhysicalMaterial;
  shaftGeo: THREE.CylinderGeometry;
  shaftMat: THREE.MeshPhysicalMaterial;
  ringGeo: THREE.RingGeometry;
  ringMat: THREE.MeshBasicMaterial;
}

interface ArrowSample {
  point: THREE.Vector3;
  direction: THREE.Vector3;
}

interface ARSceneProps {
  floorData: FloorData;
  activeSegment: PathSegment | null;
  startRoomId: string | null;
  endRoomId: string | null;
  onSessionStateChange?: (active: boolean) => void;
  showARButton: boolean;
  showUIView: boolean;
}

export default function ARScene({ floorData, activeSegment, startRoomId, endRoomId, onSessionStateChange, showARButton, showUIView }: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floorPlanGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const spheresRef = useRef<ArrowElement[]>([]);
  const animationIndexRef = useRef(0);
  const arrowSamplesRef = useRef<ArrowSample[]>([]);
  const arButtonRef = useRef<HTMLElement | null>(null);
  const wallGroupRef = useRef<THREE.Group | null>(null);
  const floorMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const labelsGroupRef = useRef<THREE.Group | null>(null);
  const floorRef = useRef<THREE.Mesh | null>(null);
  const startRoomRef = useRef(startRoomId);
  const floorDataRef = useRef(floorData);

  const [isFarView, setIsFarView] = useState(false);
  const [isARSessionActive, setIsARSessionActive] = useState(false);

  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      const targetY = isFarView ? 70 : 38;
      cameraRef.current.position.y = targetY;
      controlsRef.current.update();
    }
  }, [isFarView]);

  useEffect(() => {
    startRoomRef.current = startRoomId ?? '';
  }, [startRoomId]);

  useEffect(() => {
    floorDataRef.current = floorData;
  }, [floorData]);

  const clearPathVisuals = (floorPlanGroup: THREE.Group) => {
    spheresRef.current.forEach(entry => {
      floorPlanGroup.remove(entry.cone);
      floorPlanGroup.remove(entry.shaft);
      entry.cone.geometry.dispose();
      entry.shaft.geometry.dispose();
      entry.ring.geometry.dispose();
      entry.cone.material.dispose();
      entry.shaft.material.dispose();
      entry.ring.material.dispose();
    });
    spheresRef.current = [];
    animationIndexRef.current = 0;
    arrowSamplesRef.current = [];
  };

  const buildArrowSamples = (pathPoints: THREE.Vector3[]): ArrowSample[] => {
    if (pathPoints.length < 2) return [];

    const spacing = 0.55;
    const samples: ArrowSample[] = [];

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const from = pathPoints[i];
      const to = pathPoints[i + 1];
      const segment = new THREE.Vector3().subVectors(to, from);
      const length = segment.length();
      if (length < 0.001) continue;

      const direction = segment.clone().normalize();
      const steps = Math.max(1, Math.floor(length / spacing));
      const startStep = i === 0 ? 0 : 1;

      for (let step = startStep; step <= steps; step++) {
        const t = step / steps;
        const point = from.clone().lerp(to, t);
        point.y = 0.1;
        samples.push({ point, direction: direction.clone() });
      }
    }

    return samples;
  };

  const drawPathFromWaypointIds = (waypointIds: string[], floorPlanGroup: THREE.Group) => {
    clearPathVisuals(floorPlanGroup);

    const pathPoints = waypointIds
      .map(id => {
        const wp = floorData.waypoints.find(w => w.id === id);
        if (!wp) return null;
        return new THREE.Vector3(wp.position[0], 0.1, wp.position[1]);
      })
      .filter((v): v is THREE.Vector3 => v !== null);

    if (pathPoints.length < 2) {
      return;
    }

    arrowSamplesRef.current = buildArrowSamples(pathPoints);
  };

  const drawPathFromRooms = (startId: string, endId: string, floorPlanGroup: THREE.Group) => {
    const startRoomObj = floorData.rooms.find(r => r.id === startId);
    const endRoomObj = floorData.rooms.find(r => r.id === endId);

    if (!startRoomObj?.connectedTo?.[0] || !endRoomObj?.connectedTo?.[0]) {
      clearPathVisuals(floorPlanGroup);
      return;
    }

    const pathIds = findPath(startRoomObj.connectedTo[0], endRoomObj.connectedTo[0], floorData.waypoints);
    if (pathIds.length === 0) {
      clearPathVisuals(floorPlanGroup);
      return;
    }

    drawPathFromWaypointIds(pathIds, floorPlanGroup);
  };

  const redrawPath = () => {
    const floorPlanGroup = floorPlanGroupRef.current;
    if (!floorPlanGroup) return;

    if (activeSegment?.waypointIds?.length) {
      drawPathFromWaypointIds(activeSegment.waypointIds, floorPlanGroup);
      return;
    }

    if (startRoomId && endRoomId) {
      drawPathFromRooms(startRoomId, endRoomId, floorPlanGroup);
      return;
    }

    clearPathVisuals(floorPlanGroup);
  };

  const calibrateToStartWaypoint = (alignHeading: boolean) => {
    const floorPlanGroup = floorPlanGroupRef.current;
    const camera = cameraRef.current;
    const latestFloorData = floorDataRef.current;
    const startRoom = startRoomRef.current;

    if (!floorPlanGroup || !camera || !startRoom) return;

    const startRoomObj = latestFloorData.rooms.find(r => r.id === startRoom);
    const startWpId = startRoomObj?.connectedTo?.[0];
    if (!startWpId) return;

    const startWp = latestFloorData.waypoints.find(w => w.id === startWpId);
    if (!startWp) return;

    const cameraWorld = new THREE.Vector3();
    camera.getWorldPosition(cameraWorld);

    if (alignHeading) {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      if (forward.lengthSq() > 1e-6) {
        forward.normalize();
        const cameraYaw = Math.atan2(forward.x, forward.z);
        floorPlanGroup.rotation.set(0, cameraYaw + Math.PI, 0);
      }
    }

    const waypointLocal = new THREE.Vector3(startWp.position[0], 0, startWp.position[1]);
    const waypointWorldAfterRotation = waypointLocal.clone().applyQuaternion(floorPlanGroup.quaternion);

    floorPlanGroup.position.set(
      cameraWorld.x - waypointWorldAfterRotation.x,
      0,
      cameraWorld.z - waypointWorldAfterRotation.z,
    );
  };

  // When floorData prop changes (user switches floor): rebuild walls + labels
  useEffect(() => {
    if (!floorPlanGroupRef.current) return;

    if (wallGroupRef.current) {
      floorPlanGroupRef.current.remove(wallGroupRef.current);
      wallGroupRef.current.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose();
          ((child as THREE.Mesh).material as THREE.Material).dispose();
        }
      });
    }

    if (labelsGroupRef.current) {
      floorPlanGroupRef.current.remove(labelsGroupRef.current);
      labelsGroupRef.current.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose();
          ((child as THREE.Mesh).material as THREE.Material).dispose();
        }
      });
    }

    clearPathVisuals(floorPlanGroupRef.current);

    const { wallGroup } = createWalls(floorData);
    floorPlanGroupRef.current.add(wallGroup);
    wallGroupRef.current = wallGroup;

    const newLabels = new THREE.Group();
    labelsGroupRef.current = newLabels;
    floorPlanGroupRef.current.add(newLabels);
    drawRoomLabels(newLabels);

    if (floorRef.current) {
      floorPlanGroupRef.current.remove(floorRef.current);
    }
    drawFloor(floorPlanGroupRef.current, wallGroup);
    redrawPath();
  }, [floorData]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0f0f1e, 10, 60);

    const floorPlanGroup = new THREE.Group();
    floorPlanGroupRef.current = floorPlanGroup;
    scene.add(floorPlanGroup);

    const labelsGroup = new THREE.Group();
    labelsGroupRef.current = labelsGroup;
    floorPlanGroup.add(labelsGroup);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 50);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    const arButton = ARButton.createButton(renderer);
    arButtonRef.current = arButton;
    containerRef.current.appendChild(arButton);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    const accentLight1 = new THREE.PointLight(0xa78bfa, 0.5);
    accentLight1.position.set(-10, 10, -10);
    accentLight1.castShadow = true;
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xc792ea, 0.5);
    accentLight2.position.set(10, 10, 10);
    accentLight2.castShadow = true;
    scene.add(accentLight2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const { wallGroup } = createWalls(floorDataRef.current);
    floorPlanGroup.add(wallGroup);
    wallGroupRef.current = wallGroup;

    const handleSessionStart = () => {
      if (onSessionStateChange) onSessionStateChange(true);
      setIsARSessionActive(true);

      if (labelsGroupRef.current) labelsGroupRef.current.visible = false;

      if (wallGroupRef.current) {
        wallGroupRef.current.traverse(child => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshStandardMaterial).colorWrite = false;
          }
        });
      }

      if (floorMaterialRef.current) {
        floorMaterialRef.current.colorWrite = false;
      }

      spheresRef.current.forEach(arrow => {
        arrow.cone.visible = true;
        arrow.shaft.visible = true;
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          calibrateToStartWaypoint(true);
        });
      });
    };

    const handleSessionEnd = () => {
      if (onSessionStateChange) onSessionStateChange(false);
      setIsARSessionActive(false);

      if (labelsGroupRef.current) labelsGroupRef.current.visible = true;

      if (wallGroupRef.current) {
        wallGroupRef.current.traverse(child => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshStandardMaterial).colorWrite = true;
          }
        });
      }

      if (floorMaterialRef.current) {
        floorMaterialRef.current.colorWrite = true;
      }

      if (floorPlanGroupRef.current) {
        floorPlanGroupRef.current.position.set(0, 0, 0);
        floorPlanGroupRef.current.rotation.set(0, 0, 0);
      }
    };

    renderer.xr.addEventListener('sessionstart', handleSessionStart);
    renderer.xr.addEventListener('sessionend', handleSessionEnd);

    drawFloor(floorPlanGroup, wallGroup);
    drawRoomLabels(labelsGroup);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      controls.update();

      if (animationIndexRef.current < arrowSamplesRef.current.length) {
        const sample = arrowSamplesRef.current[animationIndexRef.current];
        const pt = sample.point;
        const tangent = sample.direction;

        const coneGeo = new THREE.ConeGeometry(0.05, 0.12, 32);
        const coneMat = new THREE.MeshPhysicalMaterial({
          color: 0xc792ea,
          emissive: 0xc792ea,
          emissiveIntensity: 2.5,
          metalness: 0.9,
          roughness: 0.1,
          transmission: 0.6,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          transparent: true,
          opacity: 0.95,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.copy(pt);

        const lookAtPoint = new THREE.Vector3().copy(pt).add(tangent);
        cone.lookAt(lookAtPoint);
        cone.rotateX(Math.PI / 2);

        const shaftGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.10, 24);
        const shaftMat = new THREE.MeshPhysicalMaterial({
          color: 0xc792ea,
          emissive: 0xc792ea,
          emissiveIntensity: 1.6,
          metalness: 0.8,
          roughness: 0.25,
          transmission: 0.4,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
          transparent: true,
          opacity: 0.9,
        });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);

        shaft.position.copy(pt);
        shaft.quaternion.copy(cone.quaternion);
        shaft.translateY(-0.08);

        const ringGeo = new THREE.RingGeometry(0.07, 0.10, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc792ea,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(pt);

        floorPlanGroup.add(cone, shaft);
        spheresRef.current.push({ cone, shaft, ring, coneGeo, coneMat, shaftGeo, shaftMat, ringGeo, ringMat });

        cone.userData.baseY = cone.position.y;
        shaft.userData.baseY = shaft.position.y;
        ring.userData.baseY = ring.position.y;

        animationIndexRef.current += 1;
      }

      const time = performance.now() * 0.001;
      spheresRef.current.forEach((entry, i) => {
        const { cone, shaft, ring } = entry;

        const floatOffset = Math.sin(time * 2 + i) * 0.02;
        if (cone.userData.baseY !== undefined) cone.position.y = cone.userData.baseY + floatOffset;
        if (shaft.userData.baseY !== undefined) shaft.position.y = shaft.userData.baseY + floatOffset;
        if (ring.userData.baseY !== undefined) ring.position.y = ring.userData.baseY;

        const pulse = 1.5 + Math.sin(time * 3 + i) * 0.8;
        [cone, shaft].forEach(mesh => {
          if (mesh.material && (mesh.material as THREE.MeshPhysicalMaterial).emissive !== undefined) {
            (mesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = pulse;
          }
        });

        const scale = 1 + Math.sin(time * 2 + i) * 0.03;
        cone.scale.set(scale, scale, scale);
        shaft.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.xr.removeEventListener('sessionstart', handleSessionStart);
      renderer.xr.removeEventListener('sessionend', handleSessionEnd);
      renderer.setAnimationLoop(null);
      clearPathVisuals(floorPlanGroup);
      renderer.dispose();
      controls.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (containerRef.current && arButton.parentNode) {
        containerRef.current.removeChild(arButton);
      }
    };
  }, [onSessionStateChange]);

  useEffect(() => {
    redrawPath();
  }, [activeSegment, startRoomId, endRoomId, floorData]);

  useEffect(() => {
    if (arButtonRef.current) {
      arButtonRef.current.style.display = showARButton ? 'block' : 'none';
    }
  }, [showARButton]);

  const drawFloor = (floorPlanGroup: THREE.Group, wallGroup: THREE.Group) => {
    const boundingBox = new THREE.Box3().setFromObject(wallGroup);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const padding = 4;
    const floorGeo = new THREE.PlaneGeometry(size.x + padding, size.z + padding);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.copy(center);
    floor.position.y = 0;
    floor.receiveShadow = true;
    floorMaterialRef.current = floorMat;
    floorRef.current = floor;
    floorPlanGroup.add(floor);
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(center.x, 38, center.z + 0.001);
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  };

  const drawRoomLabels = (floorPlanGroup: THREE.Group) => {
    const roomWidths: Record<string, number> = {
      hod: 6, dept_lib: 4, server: 7, tutorial: 3.5, lab10: 6, stairs_top: 3,
      lab9: 14, corridor: 20,
      lift: 3, stairs_bot: 3, lab7: 14, lab8: 5, women: 6, gents: 6,
    };

    const roomDepths: Record<string, number> = {
      hod: 6, dept_lib: 6, server: 6, tutorial: 6, lab10: 6, stairs_top: 6,
      lab9: 6, corridor: 2,
      lift: 6, stairs_bot: 6, lab7: 6, lab8: 6, women: 6, gents: 6,
    };

    floorData.rooms.forEach(room => {
      if (!room.center) return;

      const rw = roomWidths[room.id] ?? 6;
      const rd = roomDepths[room.id] ?? 7.5;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = 512;
      canvas.height = 512;

      const maxFontPx = 96;
      const minFontPx = 28;
      let fontSize = maxFontPx;
      context.font = `bold ${fontSize}px Arial`;
      while (context.measureText(room.name).width > canvas.width * 0.88 && fontSize > minFontPx) {
        fontSize -= 4;
        context.font = `bold ${fontSize}px Arial`;
      }

      const words = room.name.split(' ');
      const lines: string[] = [];
      if (words.length > 1 && context.measureText(room.name).width > canvas.width * 0.85) {
        const mid = Math.ceil(words.length / 2);
        lines.push(words.slice(0, mid).join(' '));
        lines.push(words.slice(mid).join(' '));

        for (const line of lines) {
          while (context.measureText(line).width > canvas.width * 0.88 && fontSize > minFontPx) {
            fontSize -= 4;
            context.font = `bold ${fontSize}px Arial`;
          }
        }
      } else {
        lines.push(room.name);
      }

      const lineH = fontSize * 1.25;
      const totalTextH = lines.length * lineH;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(8, 8, 18, 0.82)';
      const rx = 32;
      context.beginPath();
      context.moveTo(rx, 0);
      context.lineTo(canvas.width - rx, 0);
      context.quadraticCurveTo(canvas.width, 0, canvas.width, rx);
      context.lineTo(canvas.width, canvas.height - rx);
      context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - rx, canvas.height);
      context.lineTo(rx, canvas.height);
      context.quadraticCurveTo(0, canvas.height, 0, canvas.height - rx);
      context.lineTo(0, rx);
      context.quadraticCurveTo(0, 0, rx, 0);
      context.closePath();
      context.fill();

      context.strokeStyle = 'rgba(199, 146, 234, 0.85)';
      context.lineWidth = 8;
      context.stroke();

      context.font = `bold ${fontSize}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.shadowColor = 'rgba(199, 146, 234, 1)';
      context.shadowBlur = 24;
      context.fillStyle = '#ffffff';

      const startY = canvas.height / 2 - totalTextH / 2 + lineH / 2;
      lines.forEach((line, i) => {
        context.fillText(line, canvas.width / 2, startY + i * lineH);
      });

      context.shadowBlur = 10;
      context.fillStyle = '#eedeff';
      lines.forEach((line, i) => {
        context.fillText(line, canvas.width / 2, startY + i * lineH);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const margin = 0.7;
      const planeW = Math.min(rw - margin, rw * 0.85);
      const planeD = Math.min(rd - margin, rd * 0.75);

      const labelGeometry = new THREE.PlaneGeometry(planeW, planeD);
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

      labelMesh.position.set(room.center[0], 0.06, room.center[1]);
      labelMesh.rotation.x = -Math.PI / 2;

      floorPlanGroup.add(labelMesh);
    });
  };

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 z-0" />
      {showUIView && (
        <button
          onClick={() => setIsFarView(!isFarView)}
          className="fixed top-20 left-6 z-20 bg-white/95 p-3 rounded-full shadow-lg text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Far View"
        >
          {isFarView ? 'Default View' : 'Far View'}
        </button>
      )}
      {showUIView && isARSessionActive && (
        <button
          onClick={() => calibrateToStartWaypoint(true)}
          className="fixed top-20 right-6 z-20 bg-emerald-500/95 p-3 rounded-full shadow-lg text-white hover:bg-emerald-400 transition-colors"
          aria-label="Recalibrate AR"
        >
          Recalibrate
        </button>
      )}
    </>
  );
}
