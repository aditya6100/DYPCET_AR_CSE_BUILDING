import { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import ARScene from './components/ARScene';
import NavigationUI from './components/NavigationUI';
import { ALL_FLOORS } from './data/floorRegistry';
import { findMultiFloorPath } from './utils/multiFloorPathfinding';
import type { PathSegment } from './utils/multiFloorPathfinding';

function App() {
  // Default: start on floor 3 (CSE — your real floor)
  const defaultFloor = 'f3';
  const defaultStart = ALL_FLOORS.find(f => f.floorId === defaultFloor)?.rooms.find(r => !r.id.endsWith('_corridor'))?.id ?? '';
  const defaultEnd   = ALL_FLOORS.find(f => f.floorId === defaultFloor)?.rooms.filter(r => !r.id.endsWith('_corridor'))[1]?.id ?? '';

  const [startFloorId, setStartFloorId] = useState(defaultFloor);
  const [startRoomId,  setStartRoomId]  = useState(defaultStart);
  const [endFloorId,   setEndFloorId]   = useState(defaultFloor);
  const [endRoomId,    setEndRoomId]    = useState(defaultEnd);

  // The floor currently rendered in 3D
  const [activeFloorId, setActiveFloorId] = useState(defaultFloor);

  const [pathSegments, setPathSegments] = useState<PathSegment[]>([]);
  const [isARActive,   setIsARActive]   = useState(false);
  const [isMenuOpen,   setIsMenuOpen]   = useState(false);

  const handleFindPath = useCallback(() => {
    const segments = findMultiFloorPath(startRoomId, endRoomId, ALL_FLOORS);
    setPathSegments(segments);

    // Auto-switch view to the start floor
    if (segments.length > 0) {
      setActiveFloorId(segments[0].floorId);
    }
    setIsMenuOpen(false);
  }, [startRoomId, endRoomId]);

  const handleStartChange = (floorId: string, roomId: string) => {
    setStartFloorId(floorId);
    setStartRoomId(roomId);
  };

  const handleEndChange = (floorId: string, roomId: string) => {
    setEndFloorId(floorId);
    setEndRoomId(roomId);
  };

  // Active floor data for 3D rendering
  const activeFloorData = ALL_FLOORS.find(f => f.floorId === activeFloorId);

  // Path segment to render on the active floor
  const activeSegment = pathSegments.find(s => s.floorId === activeFloorId) ?? null;

  return (
    <main>
      {/* Hamburger menu button */}
      {!isARActive && !isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-6 left-6 z-20 bg-slate-900/90 border border-purple-500/30 p-3 rounded-full shadow-lg text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu">
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Floor indicator badge */}
      {!isARActive && !isMenuOpen && (
        <div className="fixed top-6 left-20 z-20 bg-slate-900/90 border border-purple-500/30 px-3 py-2 rounded-full text-xs text-purple-300 font-medium">
          {ALL_FLOORS.find(f => f.floorId === activeFloorId) && (
            <>Viewing: <span className="text-white font-bold">
              {activeFloorId === 'f1' ? 'Ground' :
               activeFloorId === 'f2' ? '1st' :
               activeFloorId === 'f3' ? '2nd (CSE)' :
               activeFloorId === 'f4' ? '3rd' :
               activeFloorId === 'f5' ? '4th' : '5th'} Floor
            </span></>
          )}
        </div>
      )}

      {/* Navigation UI */}
      {!isARActive && isMenuOpen && (
        <NavigationUI
          startRoomId={startRoomId}
          startFloorId={startFloorId}
          endRoomId={endRoomId}
          endFloorId={endFloorId}
          activeFloorId={activeFloorId}
          pathSegments={pathSegments}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          onFloorChange={setActiveFloorId}
          onFindPath={handleFindPath}
          onClose={() => setIsMenuOpen(false)}
        />
      )}

      {/* 3D Scene — always rendered, floor switches dynamically */}
      {activeFloorData && (
        <ARScene
          floorData={activeFloorData}
          activeSegment={activeSegment}
          startRoomId={startFloorId === activeFloorId ? startRoomId : null}
          endRoomId={endFloorId === activeFloorId ? endRoomId : null}
          onSessionStateChange={setIsARActive}
          showARButton={!isMenuOpen}
          showUIView={!isMenuOpen}
        />
      )}
    </main>
  );
}

export default App;
