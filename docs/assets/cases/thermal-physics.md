<h1 align="center">Thermal Physics</h1>

<p align="center"><a href="README.md">All case studies</a> · <a href="#s05">S05</a> · <a href="#s06">S06</a> · <a href="#s07">S07</a> · <a href="#s08">S08</a></p>

<a name="s05"></a>

## S05 · Moving heat source

A fixed camera looks down from the near edge of a conductive plate. A heater travels underneath on a gantry, while stationary heaters lie near the far-left, far-right and near-right regions. They share the same power and footprint. The moving heater’s starting position can vary. Image-right follows the horizontal axis of the plate, and image-up points toward the far edge. The straight grey seams across the coating remain fixed as the heater moves.

The near, middle and far coating bands use the same colours for temperature, but their response becomes progressively slower from near to far. Each band also cools more slowly than it warms. A hot patch can therefore remain behind after the gantry leaves, and its leading edge can fade or appear late as it crosses a seam. Compare successive views against the stationary warm regions. Each image after the initial view is taken after the mobile heater has finished its movement, while both the plate and its coating retain a thermal history.

Which direction did the heater travel? MoveLeft and MoveRight describe the horizontal axis; MoveUp goes toward the far edge and MoveDown toward the near edge. A diagonal movement uses a horizontal command and a near or far command simultaneously. Report all active labels for each movement in chronological order under the single JSON key “operations”.

[View prompt figure](S05-prompt.webp)

<details><summary>Legal control sets</summary>

MoveLeft · MoveRight · MoveUp · MoveDown · MoveLeft + MoveUp · MoveDown + MoveLeft · MoveRight + MoveUp · MoveDown + MoveRight

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["MoveLeft"], ["MoveLeft", "MoveUp"], ["MoveDown"], ["MoveRight", "MoveUp"], ["MoveDown", "MoveRight"], ["MoveDown", "MoveLeft"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
APPARATUS
A fixed camera looks down from the near edge of a rectangular conductive plate. Plate x points toward image-right; plate z points toward the far/top edge. One heater beneath the plate moves on a two-axis gantry. Three other heaters are stationary beneath the plate, approximately at the far-left, far-right and near-right. Their installation positions and the moving heater's initial position vary between experiments. All four heaters have the same constant power and heating footprint. The interior images show a temperature-sensitive coating and warm-air haze above the plate, but not the underside heaters or gantry.

The coating has three horizontal bands separated by two narrow grey installation seams: a broad near band, a narrow middle band, and a broad far band. All bands use the same temperature-to-colour scale. Their nominal heating-response times are 0.35, 1.80 and 4.20 seconds respectively; their cooling-response times are 1.55 times those values. These are properties of the installed coating, not additional controls. The experiment runs continuously without resetting positions, temperature or coating state between events.

CONTROLS
MoveLeft moves the mobile heater toward decreasing plate x; MoveRight moves it toward increasing plate x. MoveUp moves it toward increasing plate z, toward the far edge; MoveDown moves it toward decreasing plate z, toward the near edge. Each active gantry axis has a nominal motor speed of 0.30 metres per second during the 2.6-second command, with smooth motor start and stop. An event can be one control or two controls applied simultaneously. Infer the complete set of controls for each event.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event moves the heater for 2.6 s and is followed by 2.9 s of observation. Its evidence image is a native interior frame after that movement has finished and before the next movement begins. Residual heat and coating response remain visible.
Capture times (physical simulation clock; the F0 image precedes event 1): F1=7.433306 s; F2=12.799891 s; F3=18.433138 s; F4=23.933054 s; F5=29.432970 s; F6=34.833534 s.
Supplied event start times: 2 s, 7.5 s, 13 s, 18.5 s, 24 s, 29.5 s.

ALLOWED ATOMIC LABELS
MoveLeft, MoveRight, MoveUp, MoveDown

ALLOWED EVENT LABEL SETS
[["MoveLeft"],["MoveRight"],["MoveUp"],["MoveDown"],["MoveLeft","MoveUp"],["MoveDown","MoveLeft"],["MoveRight","MoveUp"],["MoveDown","MoveRight"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["MoveLeft"], ["MoveRight"], ["MoveUp"], ["MoveDown"], ["MoveLeft", "MoveUp"], ["MoveDown", "MoveLeft"], ["MoveRight", "MoveUp"], ["MoveDown", "MoveRight"]].

</details>

[![Moving heat source. Seven observations and Qwen3.8-27B’s response.](S05.webp)](S05.webp)

[Complete model response and source](../../examples/S05/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S05) · [Watch the episode](../../examples/S05/dual_view.mp4)

### Model Response · Qwen3.8-27B

Honestly, the streaks/elongations indicate motion direction during the 2.6s move, but the evidence frame is after movement finished, so the blob should be at the new position, with residual heat left along the path from previous position (the streak shows the trail). So the trail direction = from old position to new position. The hot core is at new position; the fading tail is at old position.

F2: core at top-left? tail to middle? Or core middle tail top-left? Compare F1 middle core to F2: F2 has a strong orange at top-left AND orange at middle connected. In F1 the middle was the moving core and top-left was far-left stationary (smaller orange). In F2 top-left became bigger and connected to middle. So moving heater moved from middle toward far-left (up-left). So event 2 (F2) = MoveLeft + MoveUp? Because far-left is up and left relative to middle. Middle is center; far-left is left and up (far). So moving to far-left = MoveLeft + MoveUp.

F3: now core at top-left (far-left) strong, middle has a tail. So between F2 and F3 it continued? F2 core was top-left-ish, F3 core top-left even more? Hmm. This is too uncertain. Let's look at overall pattern: The moving heater seems to go: middle (F0) -> middle (F1) -> left-up (F2) -> left-up more (F3) -> middle-left (F4) -> middle (F5) -> middle-down (F6). Transitions (events 1-6 correspond to F1..F6): Event1 (F0->F1): middle -> middle? maybe slight left? Not clear. Event2 (F1->F2): middle -> up-left Event3 (F2->F3): up-left -> up-left (more up?) Event4 (F3->F4): up-left -> middle (right-down) Event5 (F4->F5): middle-left -> middle (right) Event6 (F5->F6): middle -> middle-down (down)

Hmm allowed sets include diagonals only: [MoveLeft,MoveUp], [MoveDown,MoveLeft], [MoveRight,MoveUp], [MoveDown,MoveRight]. So diagonals are only these four combinations (no MoveUp+MoveRight? actually MoveRight+MoveUp is allowed; MoveLeft+MoveDown not allowed; MoveUp+MoveRight allowed). Wait list: ["MoveLeft","MoveUp"],["MoveDown","MoveLeft"],["MoveRight","MoveUp"],["MoveDown","MoveRight"]. So allowed diagonals: LU, DL, RU, DR. Not allowed: LD, UR. So moving up-left = LU allowed. moving down-right = DR allowed. moving up-right = RU allowed. moving down-left = DL allowed. Now my transitions: Event2: up-left = LU. Event4: middle (right-down) from up-left = DR. Event5: right = MoveRight (or right+up?). Event6: down = MoveDown. Event1: ? maybe MoveLeft (middle to slightly left). Event3: up = MoveUp? or up-left again.

Let's look more carefully at the cores. I'll commit to a plausible sequence: Event1: MoveLeft (F0 middle -> F1 slightly left middle) Event2: MoveUp? or MoveLeft+MoveUp? F2 shows trail to far-left/up. Hmm F2's elongation is horizontal-ish toward left. So MoveLeft. Event3: MoveUp (F3 core higher, at far-left top) Event4: MoveRight (F4 core moved right to middle-left) Event5: MoveRight (F5 middle) Event6: MoveDown (F6 down) But I need 6 events each from allowed sets. Let's look at F6: the moving core is at middle but lower (near band), there's a tail up to middle. So F6 = MoveDown from F5.

Let's look at F5: core at middle (center) with tail left to far-left. So from F4 (middle-left) to F5 (middle) = MoveRight. F4: core middle-left with tail left. from F3 (far-left top) to F4 (middle-left) = MoveRight + MoveDown? That's not allowed! DR is down-right allowed. F3 top-left to F4 middle-left is right and down = DR allowed! Yes. F3: core top-left. from F2 (top-left but lower?) to F3 (top) = MoveUp. F2: core middle-left with trail. from F1 (middle) to F2 (left) = MoveLeft.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | MoveLeft | MoveLeft |
| 2 | MoveLeft | MoveLeft + MoveUp |
| 3 | MoveLeft + MoveUp | MoveDown |
| 4 | MoveDown + MoveRight | MoveRight + MoveUp |
| 5 | MoveRight | MoveDown + MoveRight |
| 6 | MoveDown | MoveDown + MoveLeft |

<a name="s06"></a>

## S06 · Layered liquids

A fixed camera looks slightly down into an upright glass vessel. Water fills the lower part and silicone fluid floats above it. Each layer has its own external temperature-control jacket. Sealed floats with coloured cores move freely through the vessel; each core colour identifies a family with a particular density. Use the initial image to locate the vessel rim, the free surface and the interface, then identify floats in each family on either side of the interface.

The liquids start cold. Over the range of temperatures used here, warming the water increases its density, whereas warming the silicone fluid decreases its density. Cooling changes the densities in the reverse directions. A float’s buoyancy therefore depends on the liquid around it and on its own density family. Compare the heights of several floats relative to the interface across successive observations. Each image follows the start of the new valve setting, while the temperatures continue to change and floats displaced by an earlier setting may still be moving.

Which jacket was connected to which source at each event? LowerLayer and UpperLayer select the jacket; Heat and Cool select the supply connected to it. Every event requires a choice from each group, even when it uses the same jacket or source as a previous event. Return the paired labels in chronological event order under the single JSON key “operations”.

[View prompt figure](S06-prompt.webp)

<details><summary>Legal control sets</summary>

Heat + LowerLayer · Cool + LowerLayer · Heat + UpperLayer · Cool + UpperLayer

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["Cool", "LowerLayer"], ["Cool", "UpperLayer"], ["Heat", "LowerLayer"], ["Cool", "LowerLayer"], ["Heat", "UpperLayer"], ["Heat", "LowerLayer"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
Apparatus: a clear upright cylindrical vessel contains two liquid layers: air-free water below and Shin-Etsu KF-96L-2cs dimethyl silicone fluid above. Both are initially at 2.0 degrees Celsius. Each layer is connected to a separate external temperature-control jacket. The jackets, source valves and layer selector are outside the supplied interior view. The camera looks slightly down from the front at the vessel, its lower rim, the liquid interface, the upper free surface and fifteen freely moving sealed floats. Image-up is approximately vertical up. The vessel and camera remain fixed during a sample.

Each float has a transparent spherical envelope, a coloured core and a small metal ballast. There are three floats of each core family. Their calibrated effective densities are: amber flattened core, 999.93 kg/m3; copper-red capsule, 999.95 kg/m3; green cylinder, 896.00 kg/m3; pale-blue rounded core, 896.20 kg/m3; violet capsule, 950.00 kg/m3. Colours identify fixed float families and do not change with temperature. This simulation treats the floats as rigid, constant-volume objects and the two liquids as well-mixed layers. It models bulk buoyancy, drag and solid contact, but does not resolve interfacial capillary forces or convection. Float positions, velocities and both liquid temperatures are not reset between controls.

There are four complete control choices. UpperLayer+Heat connects the upper layer's jacket to the 3.8 degrees Celsius source. UpperLayer+Cool connects that jacket to the 0.2 degrees Celsius source. LowerLayer+Heat and LowerLayer+Cool make the corresponding source connections for the lower layer. Each event selects exactly one of these four layer-and-source combinations; the mechanical valves take finite time to change over.

OBSERVATION PROTOCOL FOR THIS PREFIX
The initial image is captured immediately before the first valve command. Each event image is a single original frame five seconds after the corresponding command begins. Commands are 6.0 s apart, and liquid temperatures and float motion continue evolving.
Capture times (physical/native capture time in seconds): F0=2.000000 s; F1=7.000000 s; F2=13.000000 s; F3=19.000000 s; F4=25.000000 s; F5=31.000000 s; F6=37.000000 s.
Supplied event start times: 2 s, 8 s, 14 s, 20 s, 26 s, 32 s.

ALLOWED ATOMIC LABELS
LowerLayer, UpperLayer, Heat, Cool

ALLOWED EVENT LABEL SETS
[["Heat","LowerLayer"],["Cool","LowerLayer"],["Heat","UpperLayer"],["Cool","UpperLayer"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["Heat", "LowerLayer"], ["Cool", "LowerLayer"], ["Heat", "UpperLayer"], ["Cool", "UpperLayer"]].

</details>

[![Layered liquids. Seven observations and Qwen3.8-27B’s response.](S06.webp)](S06.webp)

[Complete model response and source](../../examples/S06/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S06) · [Watch the episode](../../examples/S06/dual_view.mp4)

### Model Response · Qwen3.8-27B

Consider heating the upper layer (oil). Oil density decreases. Floats that were floating in oil (density 896-950) remain floating (still < oil density? if oil density decreases below 950, violet 950 might sink). Hmm. Alternatively consider the high-density floats in water. If we heat water, water density decreases, eventually below 999.95, then copper-red (999.95) and amber (999.93) would become denser than water and sink to bottom? They're already near bottom-ish. This is too complex to simulate precisely. The problem likely expects a simpler reasoning: look at which layer's floats move. Let's look at changes between frames: F0 -> F1: Very similar. Upper floats same. Lower floats same. Maybe slight. Hard.

F1 -> F2: Big change! Upper floats moved to top (green, pale-blue now at very top near rim). Violet capsules now straddling interface (lower). Lower layer: copper-red and amber still at bottom. The interface white disc moved down a bit? In F2 the white disc is at ~y=300 but upper region bigger. Actually the upper floats at top suggests upper layer got taller? Or the floats rose. Hold on, maybe the camera/vessel fixed, so the interface position in image reflects volume. If upper layer heated, it expands, pushing interface down, upper layer thicker, upper floats near top. In F2 upper floats near top and interface lower (white disc at y~300 vs F0 y~300? similar). Hmm.

Let's look more carefully at vertical positions. In F0, top of upper layer (free surface) is at rim ~y=60. Interface white disc center ~y=300. In F2, free surface at rim ~y=60, interface white disc ~y=300. Same. But upper floats in F2 are at y~100-200 (higher) while in F0 at y~250-350. So within the upper layer, floats moved up to near the free surface. That means they became less buoyant relative to oil? No—floating objects sit at free surface if density much less? Actually a floating object with density much less than fluid sits mostly above fluid? No, it's sealed sphere with ballast; effective density 896 vs oil 965: it floats with part above. As oil density decreases (heating), the float sinks deeper in oil (submerges more), i.e., moves down. As oil density increases (cooling), float rises. So floats rising to top = oil cooling? But cooling oil increases density, float rises. Hmm but also water.

Wait, but in F2 the violet capsules (950) moved down to straddle interface. In F0 violet were in upper layer middle. If oil cooled (density up to ~970+), violet 950 still floats in oil, would rise. Not match. If oil heated (density down toward 950), violet 950 ~ neutral, could sink to interface. And green/pale-blue (896) still float but more submerged (deeper). But they appear higher (top). Contradiction. I think I'm overanalyzing pixel positions. The intended solution likely is a known sequence. Let's think of typical puzzle: 6 events, each one of 4 combos. The images show gradual changes. Possibly the sequence alternates or follows pattern. Given uncertainty, maybe the answer is something like: event1 Heat UpperLayer, event2 Cool UpperLayer, etc. But need best-supported.

Let's look at lower layer floats across frames: In F0 copper-red capsules at mid-lower, amber at bottom. F1 similar. F2 lower: copper-red at left and right mid, amber cluster bottom center, one copper-red near bottom center. F3 lower similar to F2 but copper-red right moved down. F4 lower: copper-red right at bottom near amber. F5 lower: copper-red right back up a bit? F6 similar to F5. Upper floats: F0 mid-upper. F1 same. F2 top. F3 top. F4 top. F5 mid-upper (like F0). F6 mid-upper. So between F4 and F5, upper floats moved from top back to mid-upper. That suggests a change reversing.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | Cool + LowerLayer | Cool + LowerLayer |
| 2 | Cool + UpperLayer | Cool + UpperLayer |
| 3 | Heat + LowerLayer | Heat + LowerLayer |
| 4 | Heat + UpperLayer | Cool + LowerLayer |
| 5 | Cool + UpperLayer | Heat + UpperLayer |
| 6 | Heat + LowerLayer | Heat + LowerLayer |

<a name="s07"></a>

## S07 · Heated gas bulbs

A fixed oblique camera shows connected glass bulbs arranged on the left, in the middle and on the right. Each has a visible liquid meniscus. Trace its height against the envelope of its own bulb and use the backboard and rigid supports as fixed references. Warm-water caps outside the view supply heat to individual bulbs.

Heating changes the state of gas in the connected apparatus, so a thermal contact at one location can shift liquid levels elsewhere. Begin with the menisci in the initial image and compare their movements across each subsequent observation. The bulbs can retain heat from an earlier contact, and the oblique view can make equal heights in different envelopes look different on screen.

Which bulbs received heat during each contact? HeatLeftBulb, HeatMiddleBulb and HeatRightBulb refer to their positions in the camera view. A contact can heat a bulb on its own or a pair of distinct bulbs together. Return the full set for every contact in chronological order under the single JSON key “operations”.

[View prompt figure](S07-prompt.webp)

<details><summary>Legal control sets</summary>

HeatLeftBulb · HeatMiddleBulb · HeatRightBulb · HeatLeftBulb + HeatMiddleBulb · HeatLeftBulb + HeatRightBulb · HeatMiddleBulb + HeatRightBulb

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["HeatLeftBulb", "HeatMiddleBulb"], ["HeatRightBulb"], ["HeatLeftBulb", "HeatRightBulb"], ["HeatMiddleBulb"], ["HeatMiddleBulb", "HeatRightBulb"], ["HeatLeftBulb"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
A fixed oblique camera shows three connected glass bulbs arranged left, middle, and right, each with a visible meniscus. Bulb envelopes, glass network, backboard and supports are fixed references. Warm-water contact caps are outside the interior view. Gas composition can vary between experiments; do not assume a sample-specific gas identity that is not visible. heat_bulb_1, heat_bulb_2 and heat_bulb_3 mean heating the left, middle and right bulb respectively. An event heats one or two bulbs simultaneously. The apparatus is continuous and thermal states are not reset.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event image shows the active response after one thermal-contact event. Compare each meniscus with its own glass envelope, accounting for the oblique view and retained thermal history. No unobserved gas assignment is supplied.
Capture times (physical/native capture time in seconds): F0=1.966667 s; F1=7.300000 s; F2=12.800000 s; F3=18.300000 s; F4=23.800000 s; F5=29.300000 s; F6=34.800000 s.

ALLOWED ATOMIC LABELS
heat_bulb_1, heat_bulb_2, heat_bulb_3

ALLOWED EVENT LABEL SETS
[["heat_bulb_1"],["heat_bulb_2"],["heat_bulb_3"],["heat_bulb_1","heat_bulb_2"],["heat_bulb_1","heat_bulb_3"],["heat_bulb_2","heat_bulb_3"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["heat_bulb_1"], ["heat_bulb_2"], ["heat_bulb_3"], ["heat_bulb_1", "heat_bulb_2"], ["heat_bulb_1", "heat_bulb_3"], ["heat_bulb_2", "heat_bulb_3"]].

</details>

[![Heated gas bulbs. Seven observations and Qwen3.8-27B’s response.](S07.webp)](S07.webp)

[Complete model response and source](../../examples/S07/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S07) · [Watch the episode](../../examples/S07/dual_view.mp4)

### Model Response · Qwen3.8-27B

When a bulb is heated, the gas inside expands, pushing the liquid (blue) down in that bulb's tube. So the tube where the liquid level drops corresponds to the heated bulb. Wait, let me think carefully. The apparatus is like a gas thermometer / manometer. Heating a bulb increases gas pressure in that bulb, which pushes the liquid column down in that bulb's vertical tube (the liquid is displaced). Actually in these connected glass bulb manometers, heating one bulb causes its liquid level to fall (gas expands, pushes liquid down) and the others to rise? Or the liquid in the heated bulb's tube drops.

Let me look at the frames carefully and compare meniscus heights in each of the three vertical tubes (left, middle, right). Let me define levels by reading the blue column top in each tube relative to scale marks. Frame F0: left tube blue top around middle-low; middle tube blue top similar; right tube blue top similar. Let's look at pixel positions. The tubes have horizontal scale marks on the right side of each tube. Let's estimate the blue liquid top height. F0: Left tube blue top ~ y=470 (roughly). Middle tube blue top ~ y=470. Right tube blue top ~ y=470. They look similar, all near same level.

F1: Right tube blue top appears higher? In F1 the right tube blue column top is around y=420 (higher), while left and middle remain ~470. Hmm. Actually let's look more systematically. I'll compare each frame. F0: left blue top ~ 475, middle ~ 475, right ~ 475. F1: left ~ 475, middle ~ 475, right ~ 420 (the blue in right tube is taller/higher). F2: left ~ 475, middle ~ 475, right ~ 475 (back to similar? right blue top ~470). F3: middle blue top ~ 440 (higher), others ~475. F4: left ~ 475, middle ~ 475, right ~ 475? maybe slight. F5: left blue top ~ 440 (higher), others ~475. F6: all ~475.

Hmm this is too noisy. Let's think about the physics: heating a bulb expands gas, pushing liquid DOWN in that bulb's tube (meniscus falls) and the connected tubes rise? Actually it's a connected system with a common liquid reservoir? The three vertical tubes are connected at the bottom by a horizontal blue tube. So it's like a U-tube network. If one bulb's gas expands, it pushes its tube's liquid down, and that liquid must go somewhere - into the other tubes, raising them. So heated bulb => its tube liquid level decreases; unheated => increase.

But the frames show mostly small changes. Let's look at the relative heights. I think the intended reading: the meniscus that drops indicates heating. Let's look at each frame's "active response after one thermal-contact event." So each frame shows the result after that event (plus retained history). Since thermal states not reset, but each event heats one or two bulbs. This is quite ambiguous from images. Let's look very carefully at the blue levels. I'll describe each frame's three tube blue-top y-coordinates by eye: F0: L ~ 478, M ~ 478, R ~ 478 (all equal baseline) F1: L ~ 478, M ~ 478, R ~ 425 (R higher) -> but if heating causes drop, then R higher means R not heated and some other heated? Hmm.

Wait maybe I have the direction wrong. Let's consider that heating a bulb makes the gas expand and the meniscus in that bulb's tube goes DOWN (lower blue column). The other tubes' blue columns go up because liquid is pushed from the heated tube into them. So a heated bulb shows a LOWER blue top.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | heat_bulb_3 | heat_bulb_1 + heat_bulb_2 |
| 2 | heat_bulb_1 | heat_bulb_3 |
| 3 | heat_bulb_2 | heat_bulb_1 + heat_bulb_3 |
| 4 | heat_bulb_3 | heat_bulb_2 |
| 5 | heat_bulb_1 | heat_bulb_2 + heat_bulb_3 |
| 6 | heat_bulb_2 | heat_bulb_1 |

<a name="s08"></a>

## S08 · Bimetal supports

A brass ring is supported by ceramic balls at the inner ends of radial strips. Each strip is clamped to the base at its outer end. From the camera’s slightly elevated front view, the aluminium-backed strip is on the left, the stainless-steel strip at the rear and the copper-backed strip on the right. Each lower metal is bonded to an upper layer of Invar. A rigid pointer is attached to the ring, whose central bearing lets it rise and tilt.

An external lamp is aimed at each strip. When a strip warms, the bonded layers expand by different amounts and bend the free end, changing the height at which it supports the ring. Read both the ring’s tilt and the inclination of its pointer relative to the fixed clamps. Each observation follows establishment of the current lamp setting; a strip that was heated earlier can still be warm, while a newly heated strip can still be bending.

Which lamps are powered in each setting? SelectLeftLamp, SelectRearLamp and SelectRightLamp refer to the aluminium-, stainless-steel- and copper-backed strips respectively. A lamp may act alone or with any other lamp. A selection specifies the complete set that is powered until the next event, so a previously selected lamp may switch off. Return the chronological event sets under the sole JSON key “operations”.

[View prompt figure](S08-prompt.webp)

<details><summary>Legal control sets</summary>

SelectLeftLamp · SelectRearLamp · SelectRightLamp · SelectLeftLamp + SelectRearLamp · SelectLeftLamp + SelectRightLamp · SelectRearLamp + SelectRightLamp

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["SelectLeftLamp", "SelectRearLamp"], ["SelectLeftLamp"], ["SelectRearLamp", "SelectRightLamp"], ["SelectLeftLamp", "SelectRightLamp"], ["SelectRightLamp"], ["SelectLeftLamp", "SelectRightLamp"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
Apparatus and view: three radial bonded-metal strips surround a central brass annulus. The left-front strip has a lower layer of 6061-T6 aluminium, the right-front strip a lower layer of C110 half-hard copper, and the rear strip a lower layer of 304 stainless steel. All three have an Invar 36 upper layer bonded to the lower layer. Their outer ends are clamped to the fixed base; their inner free ends support the annulus through three small ceramic balls. The annulus and its ungraduated central pointer form one rigid assembly. A central sliding/tilting bearing allows its height and tilt to vary while keeping its centre horizontally located. The base and outer clamps remain fixed. The camera is inside the observation area, above and in front of the apparatus, with a small rightward offset; rear means farther from the camera. The strips, ceramic supports, ring and pointer are visible. The exposed metal finishes are fixed, not temperature colours.

Three external radiant heaters stand to the left, behind, and to the right of the apparatus. Each is directed at the corresponding strip: left at the aluminium strip, rear at the stainless-steel strip, and right at the copper strip. The heaters and power sliders are outside the supplied interior view. The three lamps have identical nominal radiant output when fully on. The initial apparatus temperature is 22 degrees Celsius. Physical temperatures, positions and loads are not reset between events. Small installation-angle and radius differences can occur between experiments, but the installation stays fixed within one sequence.

Controls: SelectLeftLamp selects only the left heater; SelectRearLamp selects only the rear heater; SelectRightLamp selects only the right heater. SelectLeftLamp+SelectRearLamp, SelectLeftLamp+SelectRightLamp and SelectRearLamp+SelectRightLamp select the named two heaters simultaneously. Each event specifies the complete set of powered heaters; the other heater or heaters are off. The selected setting remains until the next event. Events may mix single-heater and two-heater settings.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event image is one actual frame from that event's 4.0-6.15 s response window, with the selected heater setting established. Event commands are 6.2 s apart. Temperatures and support/ring motion continue evolving.
Capture times (physical/native capture time in seconds): F0=2.383333 s; F1=8.550000 s; F2=14.733335 s; F3=20.933334 s; F4=27.133335 s; F5=33.333336 s; F6=39.533337 s.
Supplied event start times: 2.4 s, 8.6 s, 14.8 s, 21 s, 27.2 s, 33.4 s.

ALLOWED ATOMIC LABELS
SelectLeftLamp, SelectRearLamp, SelectRightLamp

ALLOWED EVENT LABEL SETS
[["SelectLeftLamp"],["SelectRearLamp"],["SelectRightLamp"],["SelectLeftLamp","SelectRearLamp"],["SelectLeftLamp","SelectRightLamp"],["SelectRearLamp","SelectRightLamp"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["SelectLeftLamp"], ["SelectRearLamp"], ["SelectRightLamp"], ["SelectLeftLamp", "SelectRearLamp"], ["SelectLeftLamp", "SelectRightLamp"], ["SelectRearLamp", "SelectRightLamp"]].

</details>

[![Bimetal supports. Seven observations and Qwen3.8-27B’s response.](S08.webp)](S08.webp)

[Complete model response and source](../../examples/S08/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S08) · [Watch the episode](../../examples/S08/dual_view.mp4)

### Model Response · Qwen3.8-27B

Let me think about the apparatus. Three strips: left-front (aluminium), right-front (copper), rear (stainless steel). Invar on top. Heaters direct at corresponding strips. When a strip is heated, it expands more (Invar has low expansion, the lower layer expands), causing the strip to bend. The inner free ends push on the ring via ceramic balls. Heating a strip makes it expand, pushing the ring center away from that strip? Actually the strip's inner end moves; the ring sits on three balls. If one strip expands (its free end moves outward/away from center? No, the strip is clamped at outer end, free inner end at center). Heating the lower layer (which expands more than Invar) causes the strip to bow such that the inner end moves toward the convex side...

Let's think: bimetallic strip, one side expands more. The strip curves toward the side that expands less (Invar). So the convex side is the expanding metal. The free end moves relative to the clamped end. The clamped end is at outer radius. The free end is at inner (center). When heated, the strip curves with expanding metal on outside of curve (convex). Hmm. Honestly, this is too detailed. The visual differences between frames are subtle. The pointer angle and ring tilt change slightly. Let me look at the pointer direction. In F0, pointer ball is at top, pointer line goes down to center, slightly tilted. The pointer appears to point up and slightly right.

Given the difficulty, the expected answer likely follows a simple pattern. Many of these synthetic tasks expect a specific sequence. Without clear visual differences, I need to guess a plausible sequence of 6 events. Let me look more carefully at the ring's orange highlight (the illuminated side). The orange glow is on the left side of the ring in all frames. That's just lighting. The pointer: F0 pointer top ball at approx (483,178). F1 (485,177). F2 (487,177). F3 (487,177). F4 (487,177). F5 (487,177). F6 (487,177). Very little change. This is too subtle to differentiate. The task is essentially a guess among 6 allowed sets. The most reasonable approach: perhaps the sequence is each single lamp in some order then combos? But 6 events.

Given uncertainty, I'll provide a sequence that uses each allowed set once? There are 6 allowed sets exactly. So the 6 events could be each of the 6 allowed sets in some order. That's a clean mapping! The allowed event label set has exactly 6 entries. So likely each event is one distinct allowed set. I need to assign them in chronological order. But which order? Hard. The instruction says "Even if uncertain, select your best-supported allowed answer for every event." So I can pick a reasonable order. Let me think about physical progression: start with left (aluminium) heating, ring tilts one way; then add rear; etc. But events are complete sets (the setting changes entirely each event). So each event is a fresh configuration.

Given no clear visual cue, I'll choose a sequence: F1=SelectLeftLamp, F2=SelectRightLamp, F3=SelectRearLamp, F4=SelectLeftLamp+SelectRearLamp, F5=SelectLeftLamp+SelectRightLamp, F6=SelectRearLamp+SelectRightLamp. That's one plausible ordering covering all six. But maybe the pointer tilt indicates direction. Let's look at pointer tilt: In F0 pointer is nearly vertical with slight right lean. As frames progress, does the pointer lean more left or right? F0 ball x~483, center x~493, so ball left of center => pointer leans left at top. F1 ball 485, center 493. F2 ball 487. F3 487. F4 487. F5 487.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | SelectLeftLamp | SelectLeftLamp + SelectRearLamp |
| 2 | SelectRightLamp | SelectLeftLamp |
| 3 | SelectRearLamp | SelectRearLamp + SelectRightLamp |
| 4 | SelectLeftLamp + SelectRearLamp | SelectLeftLamp + SelectRightLamp |
| 5 | SelectLeftLamp + SelectRightLamp | SelectRightLamp |
| 6 | SelectRearLamp + SelectRightLamp | SelectLeftLamp + SelectRightLamp |
