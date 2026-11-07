import { useSyncExternalStore } from 'react'

// Game phases. Phase 1 boots straight into INTRO; MAIN_MENU is wired up for later.
export const PHASES = {
  MAIN_MENU: 'mainMenu',
  INTRO: 'intro',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
}

const TRANSITIONS = {
  [PHASES.MAIN_MENU]: [PHASES.INTRO],
  [PHASES.INTRO]: [PHASES.PLAYING],
  [PHASES.PLAYING]: [PHASES.PAUSED, PHASES.GAME_OVER],
  [PHASES.PAUSED]: [PHASES.PLAYING, PHASES.MAIN_MENU],
  [PHASES.GAME_OVER]: [PHASES.MAIN_MENU, PHASES.INTRO],
}

let phase = PHASES.INTRO
const listeners = new Set()

export function getPhase() {
  return phase
}

export function setPhase(next) {
  if (next === phase) return
  if (!TRANSITIONS[phase]?.includes(next)) {
    console.warn(`[gameState] invalid transition ${phase} -> ${next}`)
    return
  }
  phase = next
  listeners.forEach((fn) => fn(phase))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// React hook for UI that needs to re-render on phase changes.
// Game-loop code should call getPhase() inside useFrame instead.
export function useGamePhase() {
  return useSyncExternalStore(subscribe, getPhase)
}
