<h1 align="center">Acoustics</h1>

<p align="center"><a href="README.md">All case studies</a> · <a href="#s13">S13</a> · <a href="#s14">S14</a> · <a href="#s15">S15</a> · <a href="#s16">S16</a></p>

<a name="s13"></a>

## S13 · Standing waves

A transparent horizontal tube has a vibrating diaphragm on the left and a closed piston on the right. Cork granules lie along the bottom. A microphone near the right end feeds a detector that drives an orange marker vertically along a fixed rail. The front-facing camera shows the cork pattern along the tube and the position of the marker in the same image.

The spacing of the cork accumulations reflects the standing wave in the tube. Changing the driving frequency shifts its wavelength and where the standing wave has high or low sound pressure. The orange marker measures local sound pressure near the microphone, so its height can change when the wave pattern shifts or the diaphragm drive becomes stronger. Compare the granules and marker together in the observation period after each adjustment, taking account of the preceding pattern and of granules that continue to move.

Which settings changed? The frequency wheel steps up with IncreaseFrequency and down with DecreaseFrequency. The amplitude lever steps up with IncreaseDrive and down with DecreaseDrive. Either control may move alone, or each can move in a chosen direction at the same event. Return the complete event sets in chronological order under the sole JSON key “operations”.

[View prompt figure](S13-prompt.webp)

<details><summary>Legal control sets</summary>

IncreaseFrequency · DecreaseFrequency · IncreaseDrive · DecreaseDrive · IncreaseDrive + IncreaseFrequency · DecreaseDrive + IncreaseFrequency · DecreaseFrequency + IncreaseDrive · DecreaseDrive + DecreaseFrequency

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["DecreaseDrive", "DecreaseFrequency"], ["DecreaseFrequency", "IncreaseDrive"], ["DecreaseDrive", "IncreaseFrequency"], ["IncreaseDrive"], ["IncreaseDrive", "IncreaseFrequency"], ["DecreaseDrive"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
APPARATUS
A horizontal transparent tube contains loose cork granules along its bottom. The tube is 1.80 m long with an internal radius of 0.105 m. Its left end has an externally driven diaphragm; its right end is closed by a fixed piston. The camera looks into the tube from the front side. The external frequency wheel and diaphragm-drive lever are outside this view. No piston or camera movement is a control in this experiment.

A microphone samples the tube near the right end, approximately five-sixths of the distance from the left diaphragm. The black powered RMS detector and its orange spring-loaded indicator are visible on the right/front side of the tube. The orange marker travels vertically on its fixed black rail. The detector converts local RMS sound pressure into coil force with a gain of 0.00066 N/Pa; the return spring is 18 N/m. The indicator has 0.12 m of travel, with zero at its lower rest position. Air density is 1.2 kg/m^3 and nominal sound speed is 343 m/s. The simulated tube uses a uniform linear acoustic momentum-loss rate of 150/s and a 0.115 s field-envelope relaxation. These are apparatus/model parameters, not additional hidden controls. Particle sizes, initial pour and initial frequency may differ between experiments. Positions and physical states are not reset between events.

CONTROLS
IncreaseFrequency moves the external frequency wheel one setting higher; DecreaseFrequency moves it one setting lower. Its three allowed frequency settings are 381.11, 476.39 and 571.67 Hz. IncreaseDrive moves the external drive lever one setting higher, increasing diaphragm displacement amplitude; DecreaseDrive moves it one setting lower. The three displacement-amplitude settings are 0.420, 0.733 and 1.150 mm. An event may apply one control or two controls simultaneously. Infer the complete set of controls for each event.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event occupies 6.1 s, including 1.1 s for control motion and 5.0 s for observation. Its native evidence frame comes from the mature response window. Residual particle motion and sound-envelope response can persist.
Capture times (physical simulation clock; the F0 image precedes event 1): F1=4.600000 s; F2=10.700000 s; F3=16.800001 s; F4=22.900000 s; F5=29.000000 s; F6=35.100002 s.

ALLOWED ATOMIC LABELS
IncreaseFrequency, DecreaseFrequency, IncreaseDrive, DecreaseDrive

ALLOWED EVENT LABEL SETS
[["IncreaseFrequency"],["DecreaseFrequency"],["IncreaseDrive"],["DecreaseDrive"],["IncreaseDrive","IncreaseFrequency"],["DecreaseDrive","IncreaseFrequency"],["DecreaseFrequency","IncreaseDrive"],["DecreaseDrive","DecreaseFrequency"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["IncreaseFrequency"], ["DecreaseFrequency"], ["IncreaseDrive"], ["DecreaseDrive"], ["IncreaseDrive", "IncreaseFrequency"], ["DecreaseDrive", "IncreaseFrequency"], ["DecreaseFrequency", "IncreaseDrive"], ["DecreaseDrive", "DecreaseFrequency"]].

</details>

[![Standing waves. Seven observations and Qwen3.8-27B’s response.](S13.webp)](S13.webp)

[Complete model response and source](../../examples/S13/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S13) · [Watch the episode](../../examples/S13/dual_view.mp4)

### Model Response · Qwen3.8-27B

The indicator travel 0.12 m, zero at lower rest. So higher = more force = higher sound pressure.

Now the granule pattern: In F1-F4 the granules are in dense flat horizontal bands (nodes of standing wave where pressure node? Actually in acoustic standing wave in a tube closed at one end and open/driven at other, the pressure antinode is at closed end (piston, right). Particles (cork) are driven by acoustic radiation force toward pressure nodes? Actually acoustic streaming / radiation force pushes particles to pressure antinodes or nodes? In typical "acoustic granular" experiments, particles accumulate at pressure antinodes? Hmm.

[…]

Heaps height (spray) indicates drive: tall = high drive, flat = low drive.

F0: tall heaps (medium-high spray). F1: flat (low drive). F2: flat low. F3: flat low. F4: tall high. F5: medium. F6: medium-high.

Hmm F0 tall, F1 flat -> decrease drive at event1? But indicator also decreased (mid->low) consistent with decrease drive. So event1 = DecreaseDrive? But then heaps flat.

F1->F2 flat->flat: indicator low->low. Could be a frequency change that keeps microphone at node (indicator stays low) but changes pattern. So event2 = IncreaseFrequency or DecreaseFrequency.

F2->F3 flat->flat low->low: another frequency change? event3.

F3->F4 flat->tall low->low?? indicator still low but heaps tall. That's weird: tall heaps means high drive but indicator low? If frequency such that microphone at node, indicator low regardless of drive. So event4 = IncreaseDrive (heaps get tall, indicator stays low because node).

F4->F5 tall->medium indicator low->high: frequency change to antinode at mic? event5 = IncreaseFrequency or DecreaseFrequency (now mic at antinode so indicator high). Also heaps reduced (medium).

[…]

Given F0 already shows activity, maybe initial frequency is middle (476.39) and drive middle (0.733). Then events change.

I'll finalize:
[["DecreaseDrive"],["IncreaseFrequency"],["IncreaseFrequency"],["IncreaseDrive"],["DecreaseFrequency"],["DecreaseDrive"]]

Wait event5 I said decrease frequency to get antinode at mic and high indicator. But drive also high in F5 (tall spray) while F4 also tall. So drive same high, indicator went low->high due to frequency change. Good, single control DecreaseFrequency or IncreaseFrequency. Choose DecreaseFrequency.

Event6 indicator high->mid and spray tall->medium: DecreaseDrive.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | DecreaseDrive | DecreaseDrive + DecreaseFrequency |
| 2 | IncreaseFrequency | DecreaseFrequency + IncreaseDrive |
| 3 | IncreaseFrequency | DecreaseDrive + IncreaseFrequency |
| 4 | IncreaseDrive | IncreaseDrive |
| 5 | DecreaseFrequency | IncreaseDrive + IncreaseFrequency |
| 6 | DecreaseDrive | DecreaseDrive |

<a name="s14"></a>

## S14 · Wave scattering

An overhead camera looks down on a rectangular elastic membrane with stationary cylindrical columns inside its rim. Image-left and image-right are the side edges, the near edge is at the bottom and the far edge is at the top. External strikers make brief contacts at these edges. Establish the arrangement of the columns in the initial image so their positions can be used as landmarks in the later views.

A contact launches a pulse inward across the membrane. Its wavefront splits around columns and is reflected by both the columns and the rim. When strikers act together, their waves can pass through the same region, while reflections from an earlier event can remain visible. The event image is captured after the last actual contact, once the fronts have travelled into the interior. Compare the orientation, curvature and position of the fronts against the columns and against the previous observation when identifying their edges of origin.

Which edges were struck? pulse_left, pulse_right, pulse_front and pulse_back refer to the left, right, near and far edges in the overhead image. A striker can act alone or alongside any other striker, including the one on the opposite edge. Return the complete sets in chronological order under the sole JSON key “operations”.

[View prompt figure](S14-prompt.webp)

<details><summary>Legal control sets</summary>

pulse_left · pulse_right · pulse_front · pulse_back · pulse_back + pulse_front · pulse_back + pulse_left · pulse_back + pulse_right · pulse_front + pulse_left · pulse_front + pulse_right · pulse_left + pulse_right

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["pulse_back", "pulse_left"], ["pulse_front"], ["pulse_back"], ["pulse_back", "pulse_right"], ["pulse_front", "pulse_right"], ["pulse_back", "pulse_right"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
APPARATUS
A fixed overhead camera views a rectangular blue-grey elastic-wave surface, 5.4 m wide and 4.6 m from near to far. Image-right is +x and image-up is +z. Two to four stationary cylindrical columns stand inside it. The surface is a damped elastic membrane represented by a scalar wave model, not a liquid flow simulation. Its calibrated propagation speed is 1.8 m/s and velocity-damping coefficient is 0.08 per second; its rim and column boundaries are reflective. The interior camera shows the surface, rim and columns. Four mechanical strikers are outside the left, right, near/bottom and far/top edges; they are outside the interior camera view. Each strike applies one short inward mechanical pulse lasting approximately 0.4 s. The surface is not reset between events.

CONTROLS
pulse_left: activate the striker at the left edge.
pulse_right: activate the striker at the right edge.
pulse_front: activate the striker at the near/bottom edge.
pulse_back: activate the striker at the far/top edge.
An event may activate one striker or two strikers simultaneously. Return all activated controls for each event.

OBSERVATION PROTOCOL FOR THIS PREFIX
Commands are spaced 5.0 s apart. Each event image is the first native 30-fps interior frame at least 1.4 s after the latest actual striker contact in that event and before the next event. These are post-contact response images, not images taken at the instant of impact.
Capture times (physical/native capture time in seconds): F0=2.333333 s; F1=4.200000 s; F2=9.233334 s; F3=14.233334 s; F4=19.233334 s; F5=24.233334 s; F6=29.233334 s.
Supplied event start times: 2.4 s, 7.4 s, 12.4 s, 17.4 s, 22.4 s, 27.4 s.

ALLOWED ATOMIC LABELS
pulse_left, pulse_right, pulse_front, pulse_back

ALLOWED EVENT LABEL SETS
[["pulse_left"],["pulse_right"],["pulse_front"],["pulse_back"],["pulse_back","pulse_front"],["pulse_back","pulse_left"],["pulse_back","pulse_right"],["pulse_front","pulse_left"],["pulse_front","pulse_right"],["pulse_left","pulse_right"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["pulse_left"], ["pulse_right"], ["pulse_front"], ["pulse_back"], ["pulse_back", "pulse_front"], ["pulse_back", "pulse_left"], ["pulse_back", "pulse_right"], ["pulse_front", "pulse_left"], ["pulse_front", "pulse_right"], ["pulse_left", "pulse_right"]].

</details>

[![Wave scattering. Seven observations and Qwen3.8-27B’s response.](S14.webp)](S14.webp)

[Complete model response and source](../../examples/S14/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S14) · [Watch the episode](../../examples/S14/dual_view.mp4)

### Model Response · Qwen3.8-27B

In F1 (1.8 s after start, but contact maybe at 2.4-2.8, image at 4.2 so ~1.4-1.8 s after contact). The wavefront from a single edge would be a curved line near the center. In F1 I see a horizontal-ish band across the middle (around the columns) and vertical bands left and right. That suggests left+right (vertical fronts from both sides meeting in middle) OR front+back.

[…]

Given the high uncertainty and the instruction to always pick best supported, I'll commit to a sequence that uses variety. But I must pick from allowed sets.

Let me look more carefully at F1: I notice the right side has a clear arc that looks like a wavefront that has just bounced or is approaching the right edge — centered on right edge. The left side also has an arc near left edge. The top has an arc. This could be a single right pulse that has propagated and started reflecting, plus the left is the reflected wave from right bouncing off left? A right pulse front traveling left reaches left edge at x=0 after 5.4/1.8=3 s. At 1.8 s it's at x=5.4-3.2=2.2 from left (center-ish). Not left edge.

I think I'm overanalyzing. Let me just produce a consistent answer. The grader likely expects specific labels. Without clear signal, I'll choose based on subtle cues:

F1: arcs strongest at right and left → ["pulse_left","pulse_right"]
F2: arcs at top and bottom → ["pulse_back","pulse_front"]
F3: left → ["pulse_left"]
F4: right → ["pulse_right"]
F5: front → ["pulse_front"]
F6: back → ["pulse_back"]

Hmm but that's 6 events with 6 distinct-ish. Let's double check event count: events at 2.4,7.4,12.4,17.4,22.4,27.4 = 6 events, images F1..F6. Yes.

I'll commit to this. Actually F1 left+right, F2 front+back, then singles. That's a reasonable pattern.

Let me look F3: I see a vertical-ish band on left and a horizontal band middle. F4: vertical band left and right. F5: top and bottom bands. F6: scattered.

Given everything, I'll finalize:
E1: ["pulse_left","pulse_right"]
E2: ["pulse_back","pulse_front"]
E3: ["pulse_left"]
E4: ["pulse_right"]
E5: ["pulse_front"]
E6: ["pulse_back"]

I'll output that.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | pulse_left + pulse_right | pulse_back + pulse_left |
| 2 | pulse_back + pulse_front | pulse_front |
| 3 | pulse_left | pulse_back |
| 4 | pulse_right | pulse_back + pulse_right |
| 5 | pulse_front | pulse_front + pulse_right |
| 6 | pulse_back | pulse_back + pulse_right |

<a name="s15"></a>

## S15 · Doppler response

A cart outside the view carries a siren along a straight rail toward or away from a fixed receiving horn. Its emitted tone stays constant. The camera faces an enclosed bank of tuned rods carrying orange flags. Identify the rods by their heights relative to their individual supports in the initial image. Their arrangement from left to right need not follow their tuning order, and neighbouring rods can stand at different depths.

The cart begins at rest. Motion toward the horn raises the received frequency and motion away lowers it; the shift grows with the cart’s speed. The shorter rods are tuned to higher frequencies and the longer ones to lower frequencies. The middle of the tuning range corresponds to the stationary siren. Compare the strongest moving flags and their neighbours across successive images. Each flag shows a rod’s slowly varying response amplitude, so the pattern can retain some motion from a previous setting.

Which cart setting produced each response? SlowApproach and FastApproach move the cart toward the horn; SlowRecede and FastRecede move it away. Direction and speed are selected together. Use a single combined label for each event and return the chronological one-label sets under the sole JSON key “operations”.

[View prompt figure](S15-prompt.webp)

<details><summary>Legal control sets</summary>

SlowApproach · FastApproach · FastRecede · SlowRecede

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["FastApproach"], ["SlowApproach"], ["SlowRecede"], ["SlowApproach"], ["SlowRecede"], ["FastRecede"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
Apparatus: a siren mounted on a rail cart emits a steady 100 Hz tone. A stationary receiving horn is beyond one end of the straight rail; the cart stays on the same side of this horn throughout the experiment. The cart, rail and control lever are outside the interior camera view. The camera faces a fixed listening cabinet containing either 9 or 11 vertical, narrow-band indicator rods with orange paper flags, fixed bottom supports and a back wall. Rod heights are not ordered from left to right; alternate supports occupy slightly different depths. Count the installed rods in the initial image. From shortest rod to longest rod, a 9-rod bank is calibrated at 100.8, 100.6, 100.4, 100.2, 100.0, 99.8, 99.6, 99.4, 99.2 Hz; an 11-rod bank is calibrated at 101.0, 100.8, 100.6, 100.4, 100.2, 100.0, 99.8, 99.6, 99.4, 99.2, 99.0 Hz. Do not assume frequency order follows left-to-right screen position. These are calibrated amplitude indicators: their slow, camera-visible motion displays each channel's response envelope, rather than literal 100 Hz displacement. There is no audio input. The cart is stationary before the first event. The apparatus state is not reset between events.

External controls: each event selects exactly one of four cart settings. SlowApproach means low-speed travel toward the receiving horn; FastApproach means high-speed travel toward the horn; SlowRecede means low-speed travel away from the horn; FastRecede means high-speed travel away from the horn. Low and high nominal speeds are approximately 0.64 and 2.15 m/s. The source tone itself is unchanged.

OBSERVATION PROTOCOL FOR THIS PREFIX
The initial image is taken before the first cart setting; the cart is initially stationary. Each later image is one native response frame for the next cart setting. Indicator rods display slow response envelopes, with previous envelope motion retained. No audio or exterior cart image is supplied.
Capture times (physical/native capture time in seconds): F0=2.383333 s; F1=8.533334 s; F2=14.433334 s; F3=18.566668 s; F4=26.933334 s; F5=30.916668 s; F6=37.116669 s.

ALLOWED ATOMIC LABELS
SlowApproach, FastApproach, FastRecede, SlowRecede

ALLOWED EVENT LABEL SETS
[["SlowApproach"],["FastApproach"],["FastRecede"],["SlowRecede"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["SlowApproach"], ["FastApproach"], ["FastRecede"], ["SlowRecede"]].

</details>

[![Doppler response. Seven observations and Qwen3.8-27B’s response.](S15.webp)](S15.webp)

[Complete model response and source](../../examples/S15/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S15) · [Watch the episode](../../examples/S15/dual_view.mp4)

### Model Response · Qwen3.8-27B

First, I need to count the rods in F0. Looking at F0, I see vertical rods with orange flags. Let me count them: 1, 2, 3, 4, 5, 6, 7, 8, 9. Yes, 9 rods. So it's a 9-rod bank calibrated from shortest to longest: 100.8, 100.6, 100.4, 100.2, 100.0, 99.8, 99.6, 99.4, 99.2 Hz.

The source emits 100 Hz steady tone. When the cart is stationary, the received frequency is 100 Hz, which would light up the 100.0 Hz rod (the 5th rod in calibration order). When the cart moves toward the horn (approach), the Doppler shift increases the received frequency; when receding, it decreases.

Low speed ~0.64 m/s, high speed ~2.15 m/s. Speed of sound ~343 m/s. Doppler shift for source moving: f' = f * c/(c - v_source) for approach (source moving toward receiver). Actually the source (cart) moves. For source moving toward stationary observer: f' = f * c/(c - v). For v=0.64: f' = 100 * 343/(343-0.64) ≈ 100 * 343/342.36 ≈ 100.187 Hz. For v=2.15: 100*343/340.85 ≈ 100.628 Hz. For recede: f' = f * c/(c+v). v=0.64: 100*343/343.64 ≈ 99.813. v=2.15: 100*343/345.15 ≈ 99.377.

So the response envelope peaks near these frequencies. The rods are narrow-band indicators; the rod whose calibration frequency is closest to the received frequency will show the largest amplitude envelope.

[…]

Honestly any is a guess. Let me look one more time at visual cues: In F4, rod5 (middle) appears notably tilted right and longer, suggesting a strong response near 100 Hz? In F3 rod3 tilted. In F6 rod9 tilted (rightmost). In F1 rod6,7 tilted.

If rightmost rods = high frequency (100.8) and leftmost = low (99.2) or vice versa...

I'll finalize with a reasonable sequence. I'll choose:
[["SlowApproach"],["FastApproach"],["FastRecede"],["SlowRecede"],["SlowApproach"],["FastApproach"]]

No, let me think about typical experiment: start stationary, then approach slowly, then faster, then recede slowly, then faster, then... but we have 6 events. Could be: SlowApproach, FastApproach, FastRecede, SlowRecede, SlowApproach, FastApproach. Eh.

I'll commit to: SlowApproach, FastApproach, SlowRecede, FastRecede, SlowApproach, FastRecede? Not.

Given the lack of reliable visual discrimination, I'll provide a clean sequence that uses each label at least once and is plausible:
1 SlowApproach
2 FastApproach
3 FastRecede
4 SlowRecede
5 SlowApproach
6 FastApproach

Final.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | SlowApproach | FastApproach |
| 2 | FastApproach | SlowApproach |
| 3 | FastRecede | SlowRecede |
| 4 | SlowRecede | SlowApproach |
| 5 | SlowApproach | SlowRecede |
| 6 | FastApproach | FastRecede |

<a name="s16"></a>

## S16 · Two-source ripples

Look down into a rectangular ripple tank. A blue plunger on the left, called A, and an orange plunger on the right, called B, move vertically at the same steady frequency. The initial view shows the flat surface before they are powered. Their external actuators have different controls: the left plunger takes its phase from a clock running throughout the experiment, while the right plunger takes its phase relative to the left. The body colours identify the plungers; the colour in the surrounding water shows surface height.

In the water, orange or brown indicates a surface above the mean level, blue a surface below it and grey a surface near the mean. Compare the bands close to each plunger and the pattern where waves from the sources meet. A setting can shift the motion of both sources together or change their timing relative to one another. Every event image catches the running clock at the same point, with the unshifted reference below its midpoint and still falling. Earlier waves continue across the tank and reflect from its walls.

Recover the settings of both controls. For A, use AInPhase, AAtQuadrature or AInAntiphase relative to the running clock. For B, use BInPhaseWithA, BAtQuadratureToA or BInAntiphaseWithA relative to A. In phase means moving together; in antiphase the motions oppose each other. The quadrature option leads its reference, reaching the upper turning point as the reference rises through its middle position. Include both settings even when a control retains its previous value, and return the chronological event sets under the sole JSON key “operations”.

[View prompt figure](S16-prompt.webp)

<details><summary>Legal control sets</summary>

BInPhaseWithA + AInPhase · BAtQuadratureToA + AInPhase · BInAntiphaseWithA + AInPhase · BInPhaseWithA + AAtQuadrature · BAtQuadratureToA + AAtQuadrature · BInAntiphaseWithA + AAtQuadrature · BInPhaseWithA + AInAntiphase · BAtQuadratureToA + AInAntiphase · BInAntiphaseWithA + AInAntiphase

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["BInAntiphaseWithA", "AInAntiphase"], ["BInAntiphaseWithA", "AInPhase"], ["BInAntiphaseWithA", "AAtQuadrature"], ["BInPhaseWithA", "AInPhase"], ["BAtQuadratureToA", "AInPhase"], ["BAtQuadratureToA", "AAtQuadrature"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
Apparatus: a rectangular 4.8 m by 3.6 m ripple tank contains two fixed, circular, vertically moving plungers. Node A is the left-hand blue plunger and node B is the right-hand orange plunger in the overhead interior view; their positions and body colours do not exchange. Each plunger is connected to its own supported external actuator. Two external knobs set the phase of A and the phase difference B minus A. The knobs and actuator housings are outside the interior view. Both nodes run at 1.00 Hz with 0.021 m displacement amplitude. This is a calibrated linear surface-wave analogue with wave speed 0.66 m/s, damping and reflecting tank boundaries, not a calibrated simulation of sound propagating through water. The surrounding surface uses one continuous signed-height colour display: orange/brown is above mean height, blue is below, and grey is near mean height. Colours do not identify control labels. The state is not reset between events.

Controls: every event sets two values simultaneously. PhaseA_0deg, PhaseA_90deg and PhaseA_180deg set A's absolute phase offset to 0, 90 and 180 degrees. DeltaBA_0deg, DeltaBA_90deg and DeltaBA_180deg set B's phase minus A's phase to 0, 90 and 180 degrees. Either value may equal its previous setting. To specify the phase convention, after the actuator's 1.00 s smooth transition its vertical displacement is y_A(t)=0.021 sin(2*pi*t+phi_A), y_B(t)=0.021 sin(2*pi*t+phi_A+delta_BA), in metres, with upward positive, angles in radians in these formulas, and t the global elapsed time in seconds. The phase clock is not restarted at event boundaries. These formulas define the actuator commands, not the water-surface response.

OBSERVATION PROTOCOL FOR THIS PREFIX
The initial image is the unpowered flat surface at physical time zero. Commands are 6.0 s apart. Each event image is sampled at physical time 5.64 s after its command begins. The phase formulas use the global physical clock printed below, never a clock restarted at event boundaries. The wave field retains its physical history.
Capture times (physical/native capture time in seconds): F0=0.000000 s; F1=7.640000 s; F2=13.640000 s; F3=19.639999 s; F4=25.639999 s; F5=31.639999 s; F6=37.639999 s.
Supplied event start times: 2 s, 8 s, 14 s, 20 s, 26 s, 32 s.

ALLOWED ATOMIC LABELS
PhaseA_0deg, PhaseA_90deg, PhaseA_180deg, DeltaBA_0deg, DeltaBA_90deg, DeltaBA_180deg

ALLOWED EVENT LABEL SETS
[["DeltaBA_0deg","PhaseA_0deg"],["DeltaBA_90deg","PhaseA_0deg"],["DeltaBA_180deg","PhaseA_0deg"],["DeltaBA_0deg","PhaseA_90deg"],["DeltaBA_90deg","PhaseA_90deg"],["DeltaBA_180deg","PhaseA_90deg"],["DeltaBA_0deg","PhaseA_180deg"],["DeltaBA_90deg","PhaseA_180deg"],["DeltaBA_180deg","PhaseA_180deg"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["DeltaBA_0deg", "PhaseA_0deg"], ["DeltaBA_90deg", "PhaseA_0deg"], ["DeltaBA_180deg", "PhaseA_0deg"], ["DeltaBA_0deg", "PhaseA_90deg"], ["DeltaBA_90deg", "PhaseA_90deg"], ["DeltaBA_180deg", "PhaseA_90deg"], ["DeltaBA_0deg", "PhaseA_180deg"], ["DeltaBA_90deg", "PhaseA_180deg"], ["DeltaBA_180deg", "PhaseA_180deg"]].

</details>

[![Two-source ripples. Seven observations and Qwen3.8-27B’s response.](S16.webp)](S16.webp)

[Complete model response and source](../../examples/S16/illustrated_response.json) · [Solve the question](https://pier-lab.github.io/CaveBench/#try-S16) · [Watch the episode](../../examples/S16/dual_view.mp4)

### Model Response · Qwen3.8-27B

Upward positive. Colors: orange/brown = above mean height (positive displacement), blue = below mean height (negative displacement), grey = near mean height.

Wait, but the plungers are the sources. The color at the plunger location reflects the local water surface height, which is driven by the plunger. So at the plunger position, if the plunger is pushing down (negative y), the water is depressed (blue). If pushing up (positive y), water is elevated (orange).

[…]

Let me compute carrier at t=7.64: 2π*7.64 rad. 7.64 mod 1 = 0.64 (since period 1s). So fractional part 0.64 s → phase 0.64*360 = 230.4°. So carrier ≈ 230.4° (or -129.6°). Let's define carrier C = 230.4°.

Now at each frame, A's displacement sign/color = sin(C + phi_A). B = sin(C + phi_A + delta).

We need to read colors at the plunger centers. Let's look:

F1: At blue plunger (A) center, I see a dark blue ring around it → below mean → negative. At orange plunger (B) center, orange → positive. So A negative, B positive → opposite signs → 180° out of phase? Possibly delta=180.

F2: At A center, orange (positive). At B center, dark blue (negative). Opposite again.

F3: At A center, blue-ish? The plunger has a grey/blue small ring, surrounded by orange. Hmm hard. At B center, orange with grey ring. Let's look more carefully.

[…]

Now maybe the plunger color isn't exactly the instantaneous y but the wave field near it; but near the plunger it's dominated by plunger motion. Good.

Let's look at F3 again: maybe A down, B up? F3 A has a blue inner? The dot is blue with a grey ring then orange ring. B has white inner then grey then orange. If white = high positive, then B up; A maybe near zero or down. So F3 A down/zero, B up. That matches phiA=90 delta=90? That gives A neg, B pos. Yes.

[…]

Given the requirement to just produce best guess, and that exact matching is hard, I'll commit to a plausible sequence that matches sign observations:

E1 (F1): A neg, B pos → PhaseA_0deg, DeltaBA_180deg
E2 (F2): A pos, B neg → PhaseA_180deg, DeltaBA_180deg
E3 (F3): A neg, B pos (with B near zero?) → PhaseA_90deg, DeltaBA_90deg
E4 (F4): A pos, B pos → PhaseA_180deg, DeltaBA_0deg
E5 (F5): A pos, B pos → PhaseA_90deg, DeltaBA_180deg? that gives A neg B pos, no. For A pos B pos with phiA=180 delta0 or90. Use PhaseA_180deg, DeltaBA_90deg.
E6 (F6): A neg, B neg → PhaseA_0deg, DeltaBA_0deg.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | PhaseA_0° + DeltaBA_180° | DeltaBA_180° + PhaseA_180° |
| 2 | PhaseA_180° + DeltaBA_180° | DeltaBA_180° + PhaseA_0° |
| 3 | PhaseA_90° + DeltaBA_90° | DeltaBA_180° + PhaseA_90° |
| 4 | PhaseA_180° + DeltaBA_0° | DeltaBA_0° + PhaseA_0° |
| 5 | PhaseA_180° + DeltaBA_90° | DeltaBA_90° + PhaseA_0° |
| 6 | PhaseA_0° + DeltaBA_0° | DeltaBA_90° + PhaseA_90° |
