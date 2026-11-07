# 🧠 SYSTEM RULES & PROTOCOLS

## 1. Token & Cost Reduction Rules
- Always use Plan Mode (`/plan`) first: do not write code or edit files until you reach 95% confidence. Ask clarifying questions first.
- Provide succinct, direct answers without meta-preambles, summaries of instructions, or redundant code blocks.
- For heavy codebase exploration, web research, or file scanning, spawn a subagent using Haiku or Sonnet to keep the parent context clean.
- Recommend `/compact` or a session handoff at 60% context capacity.
- Disconnect unused MCP servers during standard coding tasks to avoid re-sending tool definitions on every turn.

## 2. Session Handoff Protocol
When context grows large, compile a high-density summary using this format:

```markdown
# 🔄 Session Handoff Brief
### 1. What Shipped & Completed
### 2. Key Workspace Files & State
### 3. Decisions Locked
### 4. Pick Up Here (Immediate Next Tasks)
```

## 3. Web Dev, UI & Design (For Menus/Portfolio)
- **UI Stack:** Tailwind CSS, HTML, Webflow, 21st.dev components.
- **Design Tools:** Figma, Lovable, Gamma (decks), Miro (wireframes), Canva (brand kits). Keep tokens consistent with `DESIGN.md`.
- **Firecrawl:** Extract design language, typography, and layout from reference sites into `DESIGN.md` before scaffolding. Use screenshot verification loops to match visual fidelity.

---

# 🎮 GAME DEVELOPMENT CORE RULES (PROJECT: "SKY BROOM")

## 4. Technical Stack & Architecture
- **Engine Focus:** Vanilla HTML5 Canvas (for 2D) and Three.js + React Three Fiber + Rapier Physics (for 3D). Vite for bundling.
- **The Game Loop:** Structure code using a strict `Input -> Update (deltaTime) -> Render` loop. Never tie movement or physics to frame rate; always multiply by `deltaTime`.
- **Performance (Object Pooling):** For projectiles, particles, or enemies, use object pooling. Never constantly instantiate and destroy objects in the loop.
- **State Machines:** Always separate game phases (Main Menu, Playing, Paused, Game Over) using a clear state machine.

## 5. "Sky Broom" Game Design & Visuals
- **The Pitch:** A 3D fast-paced flying sports game based on Quidditch rules but with original branding/copyright-safe assets.
- **Visual Style:** Smooth, high-quality 3D (NOT pixelated). Anti-aliasing enabled. Soft lighting, MeshStandardMaterial, low-poly capsule characters (color-coded Red vs. Blue) on cylinder brooms.
- **Camera:** Elevated, zoomed-out third-person view that smoothly follows the player. Cinematic intro: Camera swoops in from far away over 3 seconds on load.
- **Core Rules to Implement:**
  1. **The Quaffle:** Grab it, shoot through golden hoops to score 10 points.
  2. **The Bludgers:** 2 rogue metal balls that hunt players. Getting hit stuns and drops the ball.
  3. **The Snitch:** Spawns after a team hits 50 points. Catching it ends the game.
- **Animation:** Use simple procedural animations (e.g., capsule tilts/leans when turning).

## 6. Immediate Development Roadmap (Do not skip ahead)
- **Phase 1 (Current):** Blank grid, one player, flight physics (WASD + Space/Shift), cinematic intro camera, visual leaning.
- **Phase 2:** Add AI (1 enemy chaser, 1 goalie).
- **Phase 3:** Add Quidditch rules (Quaffle, Bludgers, Snitch, timer).
- **Phase 4:** Polish (sound effects, particles, trails, UI scoreboard).
