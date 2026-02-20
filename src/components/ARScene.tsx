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
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floorPlanGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const spheresRef = useRef<ArrowElement[]>([]);
  const lineRef = useRef<THREE.Line | null>(null);
  const animationIndexRef = useRef(0);
  const curvePointsGlobalRef = useRef<THREE.Vector3[]>([]);
  const pathCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const arButtonRef = useRef<HTMLElement | null>(null);
  const wallGroupRef = useRef<THREE.Group | null>(null);
  const floorMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const labelsGroupRef = useRef<THREE.Group | null>(null);
  const floorRef = useRef<THREE.Mesh | null>(null);
  const startRoomRef = useRef(startRoomId);
  
  const [isFarView, setIsFarView] = useState(false);


  useEffect(() => {
    console.log("isFarView changed:", isFarView);
    if (cameraRef.current && controlsRef.current) {
      const targetY = isFarView ? 70 : 38;
      cameraRef.current.position.y = targetY;
      controlsRef.current.update();
    }
  }, [isFarView]);

  useEffect(() => {
    startRoomRef.current = startRoomId ?? '';
  }, [startRoomId]);

  // When floorData prop changes (user switches floor): rebuild walls + labels
  useEffect(() => {
    if (!floorPlanGroupRef.current) return;

    // Clear old walls
    if (wallGroupRef.current) {
      floorPlanGroupRef.current.remove(wallGroupRef.current);
      wallGroupRef.current.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose();
          ((child as THREE.Mesh).material as THREE.Material).dispose();
        }
      });
    }
    // Clear old labels
    if (labelsGroupRef.current) {
      floorPlanGroupRef.current.remove(labelsGroupRef.current);
      labelsGroupRef.current.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose();
          ((child as THREE.Mesh).material as THREE.Material).dispose();
        }
      });
    }
    // Clear path arrows
    spheresRef.current.forEach(e => {
      floorPlanGroupRef.current!.remove(e.cone, e.shaft);
      e.cone.geometry.dispose(); e.shaft.geometry.dispose();
    });
    spheresRef.current = [];
    animationIndexRef.current = 0;
    curvePointsGlobalRef.current = [];
    pathCurveRef.current = null;

    // Rebuild for new floor
    const { wallGroup } = createWalls(floorData);
    floorPlanGroupRef.current.add(wallGroup);
    wallGroupRef.current = wallGroup;

    const newLabels = new THREE.Group();
    labelsGroupRef.current = newLabels;
    floorPlanGroupRef.current.add(newLabels);
    drawRoomLabels(newLabels);

    // Redraw floor plane
    if (floorRef.current) {
      floorPlanGroupRef.current.remove(floorRef.current);
    }
    drawFloor(floorPlanGroupRef.current, wallGroup);

    // Redraw path if applicable
    if (startRoomId && endRoomId && floorPlanGroupRef.current) {
      drawPath(startRoomId, endRoomId, floorPlanGroupRef.current);
    }
  }, [floorData]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0f0f1e, 10, 60);
    sceneRef.current = scene;

    const floorPlanGroup = new THREE.Group();
    floorPlanGroupRef.current = floorPlanGroup;
    scene.add(floorPlanGroup);

    const labelsGroup = new THREE.Group();
    labelsGroupRef.current = labelsGroup;
    floorPlanGroup.add(labelsGroup);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
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

    // --- NEW LIGHTING SETUP ---
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

    const accentLight2 = new THREE.PointLight(0xC792EA, 0.5); // Changed to light purple
    accentLight2.position.set(10, 10, 10);
    accentLight2.castShadow = true;
    scene.add(accentLight2);
    // --- END NEW LIGHTING SETUP ---

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // --- NEW WALL RENDERING (active floor) ---
    // floorData comes from props
    const { wallGroup } = createWalls(floorData);
    floorPlanGroup.add(wallGroup);
    wallGroupRef.current = wallGroup;

    renderer.xr.addEventListener('sessionstart', () => {
      if (onSessionStateChange) onSessionStateChange(true);
      if (floorPlanGroupRef.current && startRoomRef.current) {
        
        const startRoomObj = floorData.rooms.find(r => r.id === startRoomId);
        if (startRoomObj?.connectedTo?.[0]) {
          const startWpId = startRoomObj.connectedTo[0];
          const startWp = floorData.waypoints.find(w => w.id === startWpId);
          if (startWp) {
            floorPlanGroupRef.current.position.set(
              -startWp.position[0],
              0,
              -startWp.position[1]
            );
          }
        }
      }
      
      // --- AR Mode Setup ---
      if (labelsGroupRef.current) labelsGroupRef.current.visible = false;
      
      if (wallGroupRef.current) {
        wallGroupRef.current.traverse((child) => {
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
    });

    renderer.xr.addEventListener('sessionend', () => {
      if (onSessionStateChange) onSessionStateChange(false);
      
      // --- Exit AR Mode ---
      if (labelsGroupRef.current) labelsGroupRef.current.visible = true;

      if (wallGroupRef.current) {
        wallGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshStandardMaterial).colorWrite = true;
          }
        });
      }
      if (floorMaterialRef.current) {
        floorMaterialRef.current.colorWrite = true;
      }

      if (floorPlanGroupRef.current) floorPlanGroupRef.current.position.set(0, 0, 0);
    });

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
    
        // Create glowing, shiny arrows along the path (preserve old orientation)
        if (pathCurveRef.current && animationIndexRef.current < curvePointsGlobalRef.current.length) {
            if (animationIndexRef.current % 4 === 0) { // spacing between arrows
                const t = animationIndexRef.current / (curvePointsGlobalRef.current.length - 1);
                const pt = curvePointsGlobalRef.current[animationIndexRef.current];
                const tangent = pathCurveRef.current.getTangent(t).normalize();
    
                // --- Arrow Tip (cone) ---
                const coneGeo = new THREE.ConeGeometry(0.05, 0.12, 32);
                const coneMat = new THREE.MeshPhysicalMaterial({
                    color: 0xC792EA, // Changed to light purple
                    emissive: 0xC792EA, // Changed to light purple
                    emissiveIntensity: 2.5,
                    metalness: 0.9,
                    roughness: 0.1,
                    transmission: 0.6,
                    clearcoat: 1,
                    clearcoatRoughness: 0.05,
                    transparent: true,
                    opacity: 0.95
                });
                const cone = new THREE.Mesh(coneGeo, coneMat);
                cone.position.copy(pt);
    
                // Orient the arrow to point along the path's tangent.
                const lookAtPoint = new THREE.Vector3().copy(pt).add(tangent);
                cone.lookAt(lookAtPoint);
                cone.rotateX(Math.PI / 2);
    
                // --- Shaft (aligned to cone) ---
                const shaftGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.10, 24);
                const shaftMat = new THREE.MeshPhysicalMaterial({
                    color: 0xC792EA, // Changed to light purple
                    emissive: 0xC792EA, // Changed to light purple
                    emissiveIntensity: 1.6,
                    metalness: 0.8,
                    roughness: 0.25,
                    transmission: 0.4,
                    clearcoat: 0.8,
                    clearcoatRoughness: 0.1,
                    transparent: true,
                    opacity: 0.9
                });
                const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    
                // Position and align the shaft with the cone.
                shaft.position.copy(pt);
                shaft.quaternion.copy(cone.quaternion);
                shaft.translateY(-0.08); // adjust to visually attach shaft to cone
    
                // --- Optional glowing ring under arrow for extra visibility ---
                const ringGeo = new THREE.RingGeometry(0.07, 0.10, 32);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: 0xC792EA, // Changed to light purple
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.45
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = -Math.PI / 2;
                ring.position.copy(pt);
    
                // Add the arrow components to the scene and store them for animation.
                floorPlanGroup.add(cone, shaft); // Only cone and shaft are added to the scene
                spheresRef.current.push({ cone, shaft, ring, coneGeo, coneMat, shaftGeo, shaftMat, ringGeo, ringMat });
    
                // Store the base Y position for the floating animation.
                cone.userData.baseY = cone.position.y;
                shaft.userData.baseY = shaft.position.y;
                ring.userData.baseY = ring.position.y;
            }
            animationIndexRef.current++;
        }
    
        // Animate all created arrows with a floating and glowing pulse effect.
        const time = performance.now() * 0.001; // seconds
        spheresRef.current.forEach((entry, i) => {
            const { cone, shaft, ring } = entry;
    
            // Subtle floating up/down animation.
            const floatOffset = Math.sin(time * 2 + i) * 0.02; // adjust amplitude/speed
            if (cone.userData.baseY !== undefined) cone.position.y = cone.userData.baseY + floatOffset;
            if (shaft.userData.baseY !== undefined) shaft.position.y = shaft.userData.baseY + floatOffset;
            if (ring.userData.baseY !== undefined) ring.position.y = ring.userData.baseY; // keep ring on ground
    
            // pulse emissive intensity for glow
            const pulse = 1.5 + Math.sin(time * 3 + i) * 0.8; // adjust for stronger/weaker pulse
            [cone, shaft].forEach(mesh => {
                if (mesh.material && (mesh.material as THREE.MeshPhysicalMaterial).emissive !== undefined) {
                    (mesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = pulse;
                }
            });
    
            // optional small scale breathing
            const scale = 1 + Math.sin(time * 2 + i) * 0.03;
            cone.scale.set(scale, scale, scale);
            shaft.scale.set(scale, scale, scale);
        });
    
        // Render the scene.
        renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      controls.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (containerRef.current && arButton.parentNode) {
        containerRef.current.removeChild(arButton);
      }
    };
  }, []);

  useEffect(() => {
    if (startRoomId && endRoomId && floorPlanGroupRef.current) {
      drawPath(startRoomId, endRoomId, floorPlanGroupRef.current);
    }
  }, [startRoomId, endRoomId]);

  useEffect(() => {
    if (arButtonRef.current) {
      arButtonRef.current.style.display = showARButton ? 'block' : 'none';
    }
  }, [showARButton]);

  const drawFloor = (floorPlanGroup: THREE.Group, wallGroup: THREE.Group) => {
    // Calculate the bounding box of the walls to size the floor accordingly
    const boundingBox = new THREE.Box3().setFromObject(wallGroup);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const padding = 4; // Add some padding around the model
    const floorGeo = new THREE.PlaneGeometry(size.x + padding, size.z + padding);
    const floorMat = new THREE.MeshStandardMaterial({
      color:0x08080a, // A very dark color to make other elements pop
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.copy(center);
    floor.position.y = 0; // Ensure floor is at ground level
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
    if (!floorData) return;
    // Room width in world units — used to scale the label plane so it fits inside the room
    // roomWidths: label plane width in world units (fits inside each room)
    const roomWidths: Record<string, number> = {
      hod: 6,    dept_lib: 4,   server: 7,   tutorial: 3.5, lab10: 6,   stairs_top: 3,
      lab9: 14,  corridor: 20,
      lift: 3,   stairs_bot: 3, lab7: 14,    lab8: 5,       women: 6,   gents: 6,
    };
    // roomDepths: label plane depth in world units
    const roomDepths: Record<string, number> = {
      hod: 6,    dept_lib: 6,   server: 6,   tutorial: 6,   lab10: 6,   stairs_top: 6,
      lab9: 6,   corridor: 2,
      lift: 6,   stairs_bot: 6, lab7: 6,     lab8: 6,       women: 6,   gents: 6,
    };

    floorData.rooms.forEach((room) => {
      if (!room.center) return;

      const rw = roomWidths[room.id] ?? 6;
      const rd = roomDepths[room.id] ?? 7.5;

      // Canvas: fixed resolution, text scaled to fit
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width  = 512;
      canvas.height = 512;

      // Measure text to pick font size
      const maxFontPx = 96;
      const minFontPx = 28;
      let fontSize = maxFontPx;
      context.font = `bold ${fontSize}px Arial`;
      while (context.measureText(room.name).width > canvas.width * 0.88 && fontSize > minFontPx) {
        fontSize -= 4;
        context.font = `bold ${fontSize}px Arial`;
      }

      // For multi-word names, split into lines
      const words = room.name.split(' ');
      const lines: string[] = [];
      if (words.length > 1 && context.measureText(room.name).width > canvas.width * 0.85) {
        // Try 2-line split
        const mid = Math.ceil(words.length / 2);
        lines.push(words.slice(0, mid).join(' '));
        lines.push(words.slice(mid).join(' '));
        // Adjust font so both lines fit
        for (const l of lines) {
          while (context.measureText(l).width > canvas.width * 0.88 && fontSize > minFontPx) {
            fontSize -= 4;
            context.font = `bold ${fontSize}px Arial`;
          }
        }
      } else {
        lines.push(room.name);
      }

      const lineH = fontSize * 1.25;
      const totalTextH = lines.length * lineH;

      // Dark semi-transparent background
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

      // Border
      context.strokeStyle = 'rgba(199, 146, 234, 0.85)';
      context.lineWidth = 8;
      context.stroke();

      // Draw text lines centered
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
      // Second pass — brighter core
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

      // Scale plane to fit inside the room cell (leave a small margin)
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

  const drawPath = (startRoomId: string, endRoomId: string, floorPlanGroup: THREE.Group) => {
    spheresRef.current.forEach(entry => {
      floorPlanGroup.remove(entry.cone);
      floorPlanGroup.remove(entry.shaft);
      entry.cone.geometry.dispose();
      // entry.cone.material.dispose();
      entry.shaft.geometry.dispose();
      // entry.shaft.material.dispose();
      entry.ring.geometry.dispose();
      // entry.ring.material.dispose();
    });
    spheresRef.current = [];
    animationIndexRef.current = 0;
    curvePointsGlobalRef.current = [];
    pathCurveRef.current = null;

    if (lineRef.current) {
      floorPlanGroup.remove(lineRef.current);
      lineRef.current.geometry.dispose();
      (lineRef.current.material as THREE.Material).dispose();
    }

    const startRoomObj = floorData.rooms.find(r => r.id === startRoomId);
    const endRoomObj   = floorData.rooms.find(r => r.id === endRoomId);

    if (!startRoomObj || !startRoomObj.connectedTo || startRoomObj.connectedTo.length === 0) {
      return;
    }

    if (!endRoomObj || !endRoomObj.connectedTo || endRoomObj.connectedTo.length === 0) {
      return;
    }

    const startWP = startRoomObj.connectedTo[0];
    const endWP = endRoomObj.connectedTo[0];

    const pathIds = findPath(startWP, endWP, floorData.waypoints);

    if (pathIds.length === 0) {
      return;
    }

    // floor context from floorData prop
    const pathPoints = pathIds
      .map(id => {
        const wp = floorData.waypoints.find(w => w.id === id);
        if (!wp) { console.warn("Missing waypoint:", id); return null; }
        return new THREE.Vector3(wp.position[0], 0.1, wp.position[1]);
      })
      .filter((v): v is THREE.Vector3 => v !== null);

    // Need at least 2 points for a curve
    if (pathPoints.length < 2) {
      console.warn("Not enough valid waypoints to draw path");
      return;
    }

    const curve = new THREE.CatmullRomCurve3(pathPoints);
    pathCurveRef.current = curve;
    const curvePoints = curve.getPoints(200);
    curvePointsGlobalRef.current = curvePoints;
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({ color: 0xC792EA }); // Changed to light purple
    const line = new THREE.Line(geometry, material);
    line.visible = false;
    line.position.y = -1.5;
    floorPlanGroup.add(line);
    lineRef.current = line;
  };

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 z-0" />
      {showUIView && (
        <button
            onClick={() => {
                console.log("Button clicked!");
                setIsFarView(!isFarView)
            }}
            className="fixed top-20 left-6 z-20 bg-white/95 p-3 rounded-full shadow-lg text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Far View"
        >
            {isFarView ? 'Default View' : 'Far View'}
        </button>
      )}
    </>
  );
}