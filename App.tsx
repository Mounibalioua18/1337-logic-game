
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, CellType, Level, CommandInstance, ExecutionState, ActionType, ConditionType } from './types';
import { LEVELS, CELL_COLORS } from './constants';

const CursorArrow = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);

const App: React.FC = () => {
  // Game State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [functions, setFunctions] = useState<Record<string, (CommandInstance | null)[]>>({
    F1: [], F2: [], F3: [], F4: [], F5: []
  });
  const [selectedSlot, setSelectedSlot] = useState<{ fn: string, idx: number } | null>(null);
  
  // Execution UI State
  const [execState, setExecState] = useState<ExecutionState>({
    pos: [0, 0],
    dir: Direction.UP,
    collectedStars: new Set(),
    history: [],
    status: 'IDLE'
  });
  
  const stopRef = useRef(false);
  const isRunningRef = useRef(false);
  const level = LEVELS[currentLevelIdx] || LEVELS[0];

  useEffect(() => {
    const saved = localStorage.getItem('1337_logic_unlocked');
    if (saved) setUnlockedLevel(parseInt(saved, 10));
  }, []);

  // Initialize slots
  useEffect(() => {
    const init: Record<string, (CommandInstance | null)[]> = {};
    ['F1', 'F2', 'F3', 'F4', 'F5'].forEach((f, i) => {
      const limit = level.functionLimits[i] || 0;
      init[f] = new Array(limit).fill(null);
    });
    setFunctions(init);
    setExecState({
      pos: [level.start[0], level.start[1]],
      dir: level.start[2],
      collectedStars: new Set(),
      history: [],
      status: 'IDLE'
    });
    
    // Find first available function to select
    const firstFn = Object.keys(init).sort().find(k => (level.functionLimits[parseInt(k[1])-1] || 0) > 0);
    setSelectedSlot(firstFn ? { fn: firstFn, idx: 0 } : null);
  }, [level]);

  const handleActionClick = (action: ActionType) => {
    if (!selectedSlot) return;
    const newFns = { ...functions };
    const current = newFns[selectedSlot.fn][selectedSlot.idx];
    newFns[selectedSlot.fn][selectedSlot.idx] = { 
      action, 
      condition: current ? current.condition : null 
    };
    setFunctions(newFns);
    const limit = level.functionLimits[parseInt(selectedSlot.fn[1]) - 1];
    if (selectedSlot.idx < limit - 1) {
      setSelectedSlot({ fn: selectedSlot.fn, idx: selectedSlot.idx + 1 });
    }
  };

  const handleConditionClick = (condition: ConditionType) => {
    if (!selectedSlot) return;
    const newFns = { ...functions };
    const current = newFns[selectedSlot.fn][selectedSlot.idx];
    if (current) {
      newFns[selectedSlot.fn][selectedSlot.idx] = { 
        ...current, 
        condition: current.condition === condition ? null : condition 
      };
      setFunctions(newFns);
    }
  };

  const clearSlot = (fn: string, idx: number) => {
    const newFns = { ...functions };
    newFns[fn][idx] = null;
    setFunctions(newFns);
    setSelectedSlot({ fn, idx });
  };

  const run = async () => {
    if (isRunningRef.current) {
      stopRef.current = true;
      await new Promise(r => setTimeout(r, 100));
    }

    stopRef.current = false;
    isRunningRef.current = true;
    
    let currentPos: [number, number] = [level.start[0], level.start[1]];
    let currentDir = level.start[2];
    let starsSet = new Set<string>();
    let totalStepsExecuted = 0;
    const MAX_TOTAL_STEPS = 1000;
    const history: CommandInstance[] = [];

    setExecState({
      pos: currentPos,
      dir: currentDir,
      collectedStars: new Set(),
      history: [],
      status: 'RUNNING'
    });

    const executeRecursive = async (fnName: string): Promise<boolean> => {
      const cmds = functions[fnName];
      if (!cmds) return false;

      for (const cmd of cmds) {
        if (stopRef.current) return false;
        if (!cmd) continue;
        
        // Loop for conditional commands (While logic)
        // If no condition, it runs exactly once.
        // If condition exists, it loops until the condition fails.
        let iteration = 0;
        while (true) {
          if (stopRef.current) return false;
          
          // EVAL CONDITION: Check current tile color
          if (cmd.condition) {
            const currentCell = level.grid[currentPos[0]][currentPos[1]] as CellType;
            const match = (cmd.condition === 'RED' && currentCell === CellType.RED) ||
                          (cmd.condition === 'BLUE' && currentCell === CellType.BLUE) ||
                          (cmd.condition === 'GREEN' && currentCell === CellType.GREEN);
            if (!match) break; // Condition not met (or no longer met), move to next command slot
          } else {
            // No condition: only run once
            if (iteration > 0) break;
          }
          iteration++;

          if (cmd.action.startsWith('F') && cmd.action.length === 2) {
            const won = await executeRecursive(cmd.action);
            if (won) return true;
          } else {
            // Atomic Action
            if (totalStepsExecuted++ > MAX_TOTAL_STEPS) return false;

            if (cmd.action === 'FORWARD') {
              let nr = currentPos[0], nc = currentPos[1];
              if (currentDir === Direction.UP) nr--;
              else if (currentDir === Direction.RIGHT) nc++;
              else if (currentDir === Direction.DOWN) nr++;
              else if (currentDir === Direction.LEFT) nc--;

              // Collision check
              if (nr < 0 || nr >= level.grid.length || nc < 0 || nc >= level.grid[0].length || level.grid[nr][nc] === CellType.WALL) {
                return false;
              }
              currentPos = [nr, nc];
              level.stars.forEach(([sr, sc]) => {
                if (sr === currentPos[0] && sc === currentPos[1]) starsSet.add(`${sr},${sc}`);
              });
            } else if (cmd.action === 'LEFT') {
              currentDir = (currentDir + 3) % 4;
            } else if (cmd.action === 'RIGHT') {
              currentDir = (currentDir + 1) % 4;
            }

            history.push(cmd);
            setExecState(s => ({ 
              ...s, 
              pos: [...currentPos], 
              dir: currentDir, 
              collectedStars: new Set(starsSet),
              history: [...history]
            }));
            
            await new Promise(r => setTimeout(r, 150));

            if (starsSet.size === level.stars.length) {
              setExecState(s => ({ ...s, status: 'WON' }));
              if (level.id >= unlockedLevel) {
                const nextUnlock = level.id + 1;
                setUnlockedLevel(nextUnlock);
                localStorage.setItem('1337_logic_unlocked', nextUnlock.toString());
              }
              return true;
            }
          }
          
          if (!cmd.condition) break; // Break loop if no condition was set
        }
      }
      return false;
    };

    try {
      const won = await executeRecursive('F1');
      if (!won && !stopRef.current) {
        setExecState(s => ({ ...s, status: 'IDLE' }));
      }
    } catch (e) {
      setExecState(s => ({ ...s, status: 'IDLE' }));
    } finally {
      isRunningRef.current = false;
    }
  };

  const reset = () => {
    stopRef.current = true;
    setExecState({
      pos: [level.start[0], level.start[1]],
      dir: level.start[2],
      collectedStars: new Set(),
      history: [],
      status: 'IDLE'
    });
  };

  const handleSpy = () => {
    const solution = level.solutions;
    if (!solution) return;
    const newFns = { ...functions };
    Object.keys(solution).forEach(fnKey => {
      const fnIdx = parseInt(fnKey[1]) - 1;
      const limit = level.functionLimits[fnIdx];
      const sol = solution[fnKey];
      newFns[fnKey] = new Array(limit).fill(null);
      sol.forEach((c, idx) => { if (idx < limit) newFns[fnKey][idx] = c; });
    });
    setFunctions(newFns);
  };

  const renderIcon = (action: ActionType, size: string = "w-6 h-6") => {
    switch (action) {
      case 'FORWARD': return (
        <svg className={size} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
        </svg>
      );
      case 'LEFT': return (
        <svg className={size} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M3 10h10a8 8 0 018 8v2M3 10l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case 'RIGHT': return (
        <svg className={size} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M21 10H11a8 8 0 00-8 8v2m18-10l-4 4m4-4l-4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      default: return <span className="text-[14px] font-black text-blue-600">{action}</span>;
    }
  };

  const CommandBox = ({ cmd, isSelected, onClick, onClear }: { cmd: CommandInstance | null, isSelected?: boolean, onClick?: () => void, onClear?: () => void }) => {
    return (
      <div 
        onClick={onClick}
        onContextMenu={(e) => { e.preventDefault(); onClear?.(); }}
        className={`w-10 h-10 rounded border-2 flex items-center justify-center cursor-pointer transition-all relative flex-shrink-0
          ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-105' : 'border-slate-200 bg-white hover:border-slate-300'}
          ${!cmd ? 'dashed opacity-50' : ''}`}
      >
        {cmd && (
          <div className={`w-full h-full flex items-center justify-center ${cmd.condition === 'RED' ? 'bg-red-500/20' : cmd.condition === 'BLUE' ? 'bg-blue-500/20' : cmd.condition === 'GREEN' ? 'bg-emerald-500/20' : ''}`}>
             {renderIcon(cmd.action, "w-6 h-6")}
             {cmd.condition && (
               <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border border-white shadow-sm ${cmd.condition === 'RED' ? 'bg-red-500' : cmd.condition === 'BLUE' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
             )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-slate-800 uppercase tracking-tighter">1337 Logic Test</h1>
          <div className="w-48 md:w-96 h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${(unlockedLevel / LEVELS.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="text-sm font-bold text-slate-500 uppercase flex items-center gap-4">
          <button onClick={handleSpy} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition">Spy Solution</button>
          <span>Level: {level.id}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-x-hidden">
        <div className="bg-slate-100 rounded-3xl p-4 md:p-8 shadow-inner flex flex-col items-center gap-6 border border-slate-200/50">
          <div 
            className="grid gap-px bg-slate-300 rounded-xl overflow-hidden shadow-2xl border-4 border-white"
            style={{ 
              gridTemplateColumns: `repeat(${level.grid[0].length}, 1fr)`,
              width: 'min(50vh, 100%)',
              aspectRatio: '1/1'
            }}
          >
            {level.grid.map((row, r) => row.map((cell, c) => {
              const hasStar = level.stars.some(([sr, sc]) => sr === r && sc === c);
              const isCollected = execState.collectedStars.has(`${r},${c}`);
              return (
                <div key={`${r}-${c}`} className={`relative flex items-center justify-center transition-colors w-full h-full aspect-square ${CELL_COLORS[cell as CellType]}`}>
                  {hasStar && !isCollected && (
                    <svg className="w-1/2 h-1/2 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  )}
                  {execState.pos[0] === r && execState.pos[1] === c && (
                    <div 
                      className="w-[70%] h-[70%] text-slate-900 transition-all duration-200"
                      style={{ transform: `rotate(${execState.dir * 90}deg)` }}
                    >
                      <CursorArrow className="w-full h-full drop-shadow-md" />
                    </div>
                  )}
                </div>
              );
            }))}
          </div>

          <div className="w-full max-w-4xl">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 tracking-widest">Execution History</h3>
            <div className="bg-white rounded-2xl p-3 flex items-center gap-2 overflow-x-auto min-h-[72px] shadow-sm border border-slate-200">
               <div className="px-3 text-slate-300 opacity-50 flex-shrink-0">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
               </div>
               {execState.history.map((cmd, i) => (
                 <div key={i} className="flex-shrink-0 scale-90 opacity-80 animate-in fade-in slide-in-from-right-2">
                   <CommandBox cmd={cmd} />
                 </div>
               ))}
               {execState.history.length === 0 && <span className="text-slate-300 text-xs font-bold italic ml-2">Idle...</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full mb-32">
          <div className="flex flex-col gap-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Palette</h3>
              <div className="flex flex-wrap gap-4">
                {(['FORWARD', 'LEFT', 'RIGHT', 'F1', 'F2', 'F3', 'F4', 'F5'] as ActionType[]).map(a => {
                  if (a.length === 2 && a.startsWith('F')) {
                    const fnIdx = parseInt(a[1]) - 1;
                    if (!level.functionLimits[fnIdx]) return null;
                  }
                  return (
                    <button 
                      key={a} 
                      onClick={() => handleActionClick(a)} 
                      className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 hover:bg-white transition-all shadow-sm active:scale-90"
                      title={a}
                    >
                      {renderIcon(a, "w-8 h-8")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Conditions</h3>
              <div className="flex gap-4">
                {(['RED', 'BLUE', 'GREEN'] as ConditionType[]).map(c => (
                  <button key={c} onClick={() => handleConditionClick(c)} className={`w-14 h-14 rounded-2xl border-4 transition-all transform active:scale-95 ${c === 'RED' ? 'bg-red-500' : c === 'BLUE' ? 'bg-blue-500' : 'bg-emerald-500'} border-white ring-2 ring-transparent hover:ring-slate-200 ${selectedSlot && functions[selectedSlot.fn][selectedSlot.idx]?.condition === c ? 'ring-slate-800 scale-110' : ''}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 overflow-y-auto max-h-[400px]">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Logic Slots</h3>
            <div className="space-y-6">
              {Object.keys(functions).map((fn, i) => {
                const limit = level.functionLimits[i];
                if (!limit) return null;
                return (
                  <div key={fn} className="flex flex-col md:flex-row md:items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-xs uppercase shadow-lg flex-shrink-0">
                      {fn}
                    </div>
                    <div className="flex flex-wrap gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 w-full min-h-[60px]">
                      {functions[fn].map((cmd, idx) => (
                        <CommandBox key={idx} cmd={cmd} isSelected={selectedSlot?.fn === fn && selectedSlot?.idx === idx} onClick={() => setSelectedSlot({ fn, idx })} onClear={() => clearSlot(fn, idx)} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 flex items-center justify-center gap-4 md:gap-8 z-30">
        <button onClick={() => setCurrentLevelIdx(Math.max(0, currentLevelIdx - 1))} className="px-4 md:px-6 py-3 rounded-2xl bg-white border border-slate-200 font-bold text-slate-400 hover:text-slate-800 transition disabled:opacity-30" disabled={currentLevelIdx === 0}>PREV</button>
        <div className="flex gap-4">
          <button onClick={reset} className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition active:rotate-180 duration-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
          <button onClick={run} className={`w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all transform active:scale-90 relative ${execState.status === 'RUNNING' ? 'bg-red-500 text-white ring-8 ring-red-100 scale-105' : 'bg-blue-600 text-white ring-8 ring-blue-100 hover:scale-105'}`}>
            {execState.status === 'RUNNING' ? <svg className="w-10 h-10 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
          </button>
        </div>
        <button onClick={() => currentLevelIdx < LEVELS.length - 1 && level.id < unlockedLevel && setCurrentLevelIdx(currentLevelIdx + 1)} className="px-4 md:px-6 py-3 rounded-2xl bg-white border border-slate-200 font-bold text-slate-400 hover:text-slate-800 transition disabled:opacity-30" disabled={currentLevelIdx === LEVELS.length - 1 || level.id >= unlockedLevel}>NEXT</button>
      </div>

      {execState.status === 'WON' && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full shadow-2xl font-black text-sm tracking-widest z-50 border-4 animate-bounce bg-emerald-500 text-white border-emerald-300">
          SUCCESS!
        </div>
      )}
    </div>
  );
};

export default App;
