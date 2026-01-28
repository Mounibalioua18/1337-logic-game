
import React, { useState, useEffect, useRef } from 'react';
import { Direction, CellType, Level, CommandInstance, ExecutionState, ActionType, ConditionType } from './types';
import { LEVELS, CELL_COLORS } from './constants';

const CursorArrow = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);

const App: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [functions, setFunctions] = useState<Record<string, (CommandInstance | null)[]>>({
    F1: [], F2: [], F3: [], F4: [], F5: []
  });
  const [selectedSlot, setSelectedSlot] = useState<{ fn: string, idx: number } | null>(null);
  
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
    const savedUnlock = localStorage.getItem('1337_unlocked_max');
    if (savedUnlock) {
      const unlock = parseInt(savedUnlock, 10);
      setUnlockedLevel(unlock);
      setCurrentLevelIdx(unlock - 1);
    }
  }, []);

  useEffect(() => {
    const savedFns = localStorage.getItem(`1337_fns_level_${level.id}`);
    const init: Record<string, (CommandInstance | null)[]> = {};
    const parsedSaved = savedFns ? JSON.parse(savedFns) : null;

    ['F1', 'F2', 'F3', 'F4', 'F5'].forEach((f, i) => {
      const limit = level.functionLimits[i] || 0;
      if (parsedSaved && parsedSaved[f]) {
        init[f] = parsedSaved[f].slice(0, limit);
        while (init[f].length < limit) init[f].push(null);
      } else {
        init[f] = new Array(limit).fill(null);
      }
    });

    setFunctions(init);
    setExecState({
      pos: [level.start[0], level.start[1]],
      dir: level.start[2],
      collectedStars: new Set(),
      history: [],
      status: 'IDLE'
    });
    
    setSelectedSlot({ fn: 'F1', idx: 0 });
  }, [level]);

  const updateFunctions = (newFns: Record<string, (CommandInstance | null)[]>) => {
    setFunctions(newFns);
    localStorage.setItem(`1337_fns_level_${level.id}`, JSON.stringify(newFns));
  };

  const handleActionClick = (action: ActionType) => {
    if (!selectedSlot) return;
    const newFns = { ...functions };
    const current = newFns[selectedSlot.fn][selectedSlot.idx];
    newFns[selectedSlot.fn][selectedSlot.idx] = { 
      action, 
      condition: current ? current.condition : null 
    };
    updateFunctions(newFns);
    
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
      updateFunctions(newFns);
    }
  };

  const clearSlot = (fn: string, idx: number) => {
    const newFns = { ...functions };
    newFns[fn][idx] = null;
    updateFunctions(newFns);
    setSelectedSlot({ fn, idx });
  };

  const run = async () => {
    if (isRunningRef.current) {
      stopRef.current = true;
      return;
    }

    stopRef.current = false;
    isRunningRef.current = true;
    
    let currentPos: [number, number] = [level.start[0], level.start[1]];
    let currentDir = level.start[2];
    let starsSet = new Set<string>();
    let totalStepsExecuted = 0;
    const MAX_TOTAL_STEPS = 8000;
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
        
        let iteration = 0;
        while (true) {
          if (stopRef.current) return false;
          
          if (cmd.condition) {
            const currentCell = level.grid[currentPos[0]][currentPos[1]] as CellType;
            const match = (cmd.condition === 'RED' && currentCell === CellType.RED) ||
                          (cmd.condition === 'BLUE' && currentCell === CellType.BLUE) ||
                          (cmd.condition === 'GREEN' && currentCell === CellType.GREEN);
            if (!match) break;
          } else if (iteration > 0) {
            break;
          }
          iteration++;

          if (cmd.action.startsWith('F') && cmd.action.length === 2) {
            if (totalStepsExecuted++ > MAX_TOTAL_STEPS) return false;
            const won = await executeRecursive(cmd.action);
            if (won) return true;
          } else {
            if (totalStepsExecuted++ > MAX_TOTAL_STEPS) return false;

            if (cmd.action === 'FORWARD') {
              let nr = currentPos[0], nc = currentPos[1];
              if (currentDir === Direction.UP) nr--;
              else if (currentDir === Direction.RIGHT) nc++;
              else if (currentDir === Direction.DOWN) nr++;
              else if (currentDir === Direction.LEFT) nc--;

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
              history: [...history].slice(-20)
            }));
            
            await new Promise(r => setTimeout(r, 40));

            if (starsSet.size === level.stars.length) {
              setExecState(s => ({ ...s, status: 'WON' }));
              const nextUnlock = Math.max(unlockedLevel, level.id + 1);
              setUnlockedLevel(nextUnlock);
              localStorage.setItem('1337_unlocked_max', nextUnlock.toString());
              return true;
            }
          }
          if (!cmd.condition) break;
          if (iteration > 500) break; 
        }
      }
      return false;
    };

    try {
      await executeRecursive('F1');
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
    if (!solution || Object.keys(solution).length === 0) {
      alert("Search for the sequence yourself!");
      return;
    }
    const newFns = { ...functions };
    Object.keys(solution).forEach(fnKey => {
      const fnIdx = parseInt(fnKey[1]) - 1;
      const limit = level.functionLimits[fnIdx];
      const sol = solution[fnKey];
      newFns[fnKey] = new Array(limit).fill(null);
      sol.forEach((c, idx) => { if (idx < limit) newFns[fnKey][idx] = c; });
    });
    updateFunctions(newFns);
  };

  const renderIcon = (action: ActionType, size: string = "w-5 h-5") => {
    switch (action) {
      case 'FORWARD': return <svg className={size} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>;
      case 'LEFT': return <svg className={size} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
      case 'RIGHT': return <svg className={size} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21 10H11a8 8 0 00-8 8v2m18-10l-4 4m4-4l-4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
      default: return <span className="text-[10px] font-black">{action}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-y-auto">
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between shadow-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black italic tracking-tighter text-blue-400">1337_PRO</h1>
          <div className="hidden sm:flex flex-col gap-1">
             <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(unlockedLevel / LEVELS.length) * 100}%` }}></div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSpy} className="text-[9px] bg-slate-700 px-2 py-1 rounded border border-slate-600 hover:bg-slate-600 transition font-bold uppercase text-slate-400">Hint</button>
          <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-xs font-black">
             LVL <span className="text-blue-400">{level.id}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 lg:p-6 gap-6 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl border border-slate-700 flex flex-col items-center relative overflow-hidden">
              <div 
                className="grid gap-px bg-slate-700 rounded-lg overflow-hidden shadow-inner border-4 border-slate-900"
                style={{ 
                  gridTemplateColumns: `repeat(${level.grid[0].length}, 1fr)`,
                  width: 'min(45vh, 100%)',
                  aspectRatio: '1/1'
                }}
              >
                {level.grid.map((row, r) => row.map((cell, c) => {
                  const hasStar = level.stars.some(([sr, sc]) => sr === r && sc === c);
                  const isCollected = execState.collectedStars.has(`${r},${c}`);
                  return (
                    <div key={`${r}-${c}`} className={`relative flex items-center justify-center w-full h-full aspect-square ${CELL_COLORS[cell as CellType]}`}>
                      {hasStar && !isCollected && (
                        <div className="w-1/2 h-1/2 text-yellow-300 animate-pulse drop-shadow-[0_0_5px_rgba(253,224,71,0.6)]">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        </div>
                      )}
                      {execState.pos[0] === r && execState.pos[1] === c && (
                        <div 
                          className="w-[80%] h-[80%] text-white transition-all duration-150 z-10"
                          style={{ transform: `rotate(${execState.dir * 90}deg)` }}
                        >
                          <CursorArrow className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />
                        </div>
                      )}
                    </div>
                  );
                }))}
              </div>
              <div className="mt-4 text-center text-slate-400 text-[11px] font-medium leading-tight">
                {level.instructions.en}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl">
              <h3 className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-widest">Ops</h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {(['FORWARD', 'LEFT', 'RIGHT', 'F1', 'F2', 'F3', 'F4', 'F5'] as ActionType[]).map(a => {
                  if (a.length === 2 && a.startsWith('F')) {
                    const fnIdx = parseInt(a[1]) - 1;
                    if (!level.functionLimits[fnIdx]) return null;
                  }
                  return (
                    <button 
                      key={a} 
                      onClick={() => handleActionClick(a)} 
                      className="aspect-square rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:border-blue-500 hover:text-blue-400 transition-all active:scale-90 group"
                    >
                      {renderIcon(a, "w-6 h-6 group-hover:scale-110 transition")}
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-slate-700 my-4"></div>

              <h3 className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-widest">Cond</h3>
              <div className="flex gap-2">
                {(['RED', 'BLUE', 'GREEN'] as ConditionType[]).map(c => (
                  <button 
                    key={c} 
                    onClick={() => handleConditionClick(c)} 
                    className={`w-11 h-11 rounded-xl border-2 transition-all transform active:scale-90 shadow-lg
                      ${c === 'RED' ? 'bg-red-500 border-red-400' : c === 'BLUE' ? 'bg-blue-600 border-blue-400' : 'bg-emerald-600 border-emerald-400'}
                      ${selectedSlot && functions[selectedSlot.fn][selectedSlot.idx]?.condition === c ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl overflow-y-visible">
              <h3 className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest">Logic</h3>
              <div className="space-y-4">
                {Object.keys(functions).map((fn, i) => {
                  const limit = level.functionLimits[i];
                  if (!limit) return null;
                  return (
                    <div key={fn} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[9px] font-black text-slate-600 uppercase">
                         <span className="text-blue-400">{fn}</span>
                         <span>{functions[fn].filter(c => c !== null).length}/{limit}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 min-h-[48px]">
                        {functions[fn].map((cmd, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setSelectedSlot({ fn, idx })}
                            onContextMenu={(e) => { e.preventDefault(); clearSlot(fn, idx); }}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center cursor-pointer transition-all relative flex-shrink-0
                              ${selectedSlot?.fn === fn && selectedSlot?.idx === idx ? 'border-blue-500 bg-blue-500/10 shadow-lg scale-105 z-10' : 'border-slate-700 bg-slate-900 hover:border-slate-600'}
                              ${!cmd ? 'dashed opacity-20' : ''}`}
                          >
                            {cmd && (
                              <div className={`w-full h-full flex items-center justify-center rounded ${cmd.condition === 'RED' ? 'bg-red-500/20' : cmd.condition === 'BLUE' ? 'bg-blue-500/20' : cmd.condition === 'GREEN' ? 'bg-emerald-500/20' : ''}`}>
                                 {renderIcon(cmd.action, "w-6 h-6")}
                                 {cmd.condition && (
                                   <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900 shadow ${cmd.condition === 'RED' ? 'bg-red-500' : cmd.condition === 'BLUE' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                 )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-md border-t border-slate-700 p-4 flex items-center justify-center gap-6 z-50">
        <button 
          onClick={() => setCurrentLevelIdx(Math.max(0, currentLevelIdx - 1))} 
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition disabled:opacity-20" 
          disabled={currentLevelIdx === 0}
        >
          <svg className="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>

        <div className="flex gap-4">
          <button onClick={reset} className="w-12 h-12 rounded-2xl bg-slate-700 border border-slate-600 shadow-lg flex items-center justify-center text-slate-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
          
          <button 
            onClick={run} 
            className={`w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center transition-all transform active:scale-95 relative
              ${execState.status === 'RUNNING' ? 'bg-red-600 ring-4 ring-red-600/20' : 'bg-blue-600 ring-4 ring-blue-600/20 hover:bg-blue-500'}`}
          >
            {execState.status === 'RUNNING' 
              ? <div className="w-6 h-6 bg-white rounded-sm animate-pulse"></div> 
              : <svg className="w-8 h-8 ml-1 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
          </button>
        </div>

        <button 
          onClick={() => currentLevelIdx < LEVELS.length - 1 && level.id < unlockedLevel && setCurrentLevelIdx(currentLevelIdx + 1)} 
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition disabled:opacity-20" 
          disabled={currentLevelIdx === LEVELS.length - 1 || level.id >= unlockedLevel}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>

      {execState.status === 'WON' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-blue-500 p-8 rounded-3xl shadow-2xl text-center max-w-xs w-full mx-4 flex flex-col items-center gap-6 scale-in-center">
             <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
             </div>
             <div>
                <h2 className="text-2xl font-black italic tracking-tighter mb-1">SUCCESS</h2>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Memory Access Granted</p>
             </div>
             <button 
                onClick={() => {
                  if (currentLevelIdx < LEVELS.length - 1) {
                    setCurrentLevelIdx(currentLevelIdx + 1);
                    reset();
                  } else {
                    reset();
                  }
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 transition rounded-xl font-black text-sm shadow-xl uppercase tracking-widest"
             >
                Continue
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
