# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Robot Lab — Milestone 5 prototype

Run `npm run dev`, then open the Local URL printed by Vite with
`?prototype=robot-lab` appended (normally
`http://localhost:5173/capstone-thesis/?prototype=robot-lab`).
You can also open **M5 — Prototype & Design Rationale** in the thesis site and
choose **Open Robot Lab prototype**. The prototype has its own full-screen view;
its code and styles load separately from the thesis pages.

Select a part from the inventory, choose a socket, and press **Install component**.
Switch between Player A and Player B to consult complementary field notes.
The shared robot stays assembled across switches. Components can be removed or
replaced. Once four modules are installed, use **Activate & test** to run the
cargo mission. Successful activation reveals three reflection questions.

- **Player A** knows functions, energy output, and energy demand.
- **Player B** knows chassis interfaces and installation dependencies.
- Parts that fit may still fail the mission; a valid connection is not sufficient.
- This is a one-device view simulation, not authenticated or online multiplayer.
  State is in memory and resets on page reload. No accounts or backend are needed.
- Completion is a gameplay outcome, not evidence of improved CPS skills.

### Code organization

- `src/data/robotLab.js`: fictional parts, role-specific notes, sockets, and prompts.
- `src/game/robotLabLogic.js`: pure connector validation and mission acceptance tests.
- `src/composables/useRobotLab.js`: shared assembly state and gameplay actions.
- `src/components/RobotLab.vue`: interface, role switching, and reflection panel.
- `src/components/RobotIllustration.vue`: modular SVG robot and activation animation.
- `src/components/RobotModuleIcon.vue`: small inventory icons.

Run the gameplay and Vue control tests with:

```sh
node --test tests/robotLab.test.js tests/robotLab-ui.test.js
```

Build for the existing static hosting setup with `npm run build`.

<details>
<summary>Presenter walkthrough (contains the solution)</summary>

1. Compare A’s functions and energy with B’s interface and installation rules.
2. Try the high-output **Zyron Core** in Body / Power. Its P1 connector is rejected
   by the P2 chassis; output alone is not enough.
3. Install **Volt Cell → Body / Power**, **Orbi Motor → Legs / Movement**,
   **Flux Stabilizer → Arms / Tools**, then **Nexo Sensor → Head / Control**.
   View switches may happen at any time and are not part of a forced turn order.
4. Use **Activate & test**. The modules demand seven energy units and Volt supplies
   eight. The robot detects obstacles, brakes gently, and protects the cargo.
5. Discuss the three reflection questions.

For an alternative demonstration, begin with **Luma Capsule** instead of Volt.
All connectors fit, but the field test reports insufficient energy. Replace it
with Volt without rebuilding the other modules, then test again.

</details>
