<h1 align="center">Optics</h1>

<p align="center"><a href="README.md">All case studies</a> · <a href="#s17">S17</a> · <a href="#s18">S18</a> · <a href="#s19">S19</a> · <a href="#s20">S20</a></p>

<a name="s17"></a>

## S17 · Photoelastic load

The specimen responds to compression and to a rotating optical control. Which loading or rotation controls produced each observed fringe pattern?

[![Photoelastic load. Seven chronological observations, the recorded controls and a response by Claude Sonnet 5.5.](S17.webp)](S17.webp)

[Solve the six-event question](https://pier-lab.github.io/CaveBench/#try-S17) · [Watch the episode](../../examples/S17/dual_view.mp4)

<details><summary>Full evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
The complete optical calibration module is mounted 0.50 m forward of its original backplate plane so that the opaque loading beams do not block it. This is a fixed physical installation, not a display overlay or selectively hidden beam. The camera framing includes this upper reference and all three specimens.

Apparatus and camera. A fixed camera inside the enclosure faces the rear optical bench nearly straight on, from a slightly elevated position. Apparatus +x is image-right, +y is upward, and +z points away from the camera. Three separate framed transparent specimens stand between upper and lower loading pads: a narrow-waisted dogbone, an arch with two legs, and a circular disk with a central hole. All three are present, but their left-to-right order varies between samples. Identify them by shape in F0 rather than assuming a fixed order. A shared upper press crosshead moves their upper pads; their lower pads remain on the fixed anvil. A fourth, narrow horizontal optical calibration strip is mounted above the crosshead, centred over the specimens. It is not a fourth specimen under the press. Brass frames, the dark backplate, the bench, and fixed guide columns provide stationary references.

The optical arrangement uses a crossed polarizer/analyzer pair rotating together. The upper calibration strip has fixed birefringent retardance independent of press load, and a known slowly varying principal-axis direction from about 10 to 40 degrees counterclockwise from image-right across its left-to-right extent. Its changing brightness pattern is therefore a passive optical reference for the common polarizer angle, not a control lamp or answer display. The three loaded specimens additionally have shape-dependent stress concentration, principal-axis patterns and stress-relaxation histories. A material color is not a fixed operation code. In a plane polariscope, transmitted intensity depends on both the angle factor sin^2(2(theta-alpha)) and the stress-dependent retardance factor sin^2(delta/2), where theta is the local material principal-axis angle and alpha is the common optical-pair angle. Thus brightness or a particular hue alone is not a monotonic measure of load.

Allowed operations. each event applies exactly ONE of IncreaseLoad, DecreaseLoad, RotateClockwise, or RotateCounterclockwise. The first two increase or decrease the compressive load by moving the common press linkage. The last two turn the external right-wall optical-pair control wheel clockwise or counterclockwise as viewed from outside on the apparatus +x side, looking inward along -x. This is a side-view wheel convention, not clockwise motion of a specimen in the supplied camera image. The known linkage maps RotateClockwise to increasing alpha and RotateCounterclockwise to decreasing alpha; positive alpha is counterclockwise from image-right in the front-facing specimen optical coordinates. The initial alpha is 12 degrees. Each rotation changes it by approximately 38 degrees, including the short drive ramp, without wrapping. Each load command changes the normalized load by approximately 0.29, starting from 0.32. No specimen is translated to encode a rotation, and no event directly repaints an object. 

Physical response and model scope. The press is an ideal prescribed mechanical linkage, not a simulation of hydraulic-fluid flow. Load is measured from its actual crosshead displacement. This load drives a reduced-order viscoelastic response with different loading, unloading and memory time scales for the three shapes, and a shape-dependent analytical photoelastic rendering model; this is not a resolved finite-element stress solution. The dogbone responds fastest, the arch is intermediate and the perforated disk retains stress longest. Unloading need not instantly erase a colored pattern. The specimens also shorten slightly under compression while remaining seated between their pads. The upper reference strip has fixed retardance, so load-only operations do not change its optical state. Rotating the common optical pair affects both the reference strip and all three specimens, while retained specimen stress can continue relaxing. Compare the independent reference and loaded-specimen changes across frames rather than equating one object's color with a command. All states evolve continuously; neither press nor material memory is reset between events.

OBSERVATION PROTOCOL FOR THIS PREFIX
The first operation follows a 1.2 s initial hold. Each event has a 1.2 s drive and a 3.8 s observation period. The evidence image is selected from 0.5 s after that drive ends until shortly before the next drive. Frames need not represent mechanical or optical equilibrium; older stress can remain.
Capture times (physical simulation clock; the F0 image precedes event 1): F1=2.900010 s; F2=11.099916 s; F3=15.933176 s; F4=21.133097 s; F5=22.933069 s; F6=31.132944 s.
Supplied event start times: 1.2 s, 6.2 s, 11.2 s, 16.2 s, 21.2 s, 26.2 s.

ALLOWED ATOMIC LABELS
IncreaseLoad, DecreaseLoad, RotateClockwise, RotateCounterclockwise

ALLOWED EVENT LABEL SETS
[["IncreaseLoad"],["DecreaseLoad"],["RotateClockwise"],["RotateCounterclockwise"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["IncreaseLoad"], ["DecreaseLoad"], ["RotateClockwise"], ["RotateCounterclockwise"]].

</details>

### Model Response · Claude Sonnet 5.5

Reading the frames: the reference strip looks alike in F0, F1, F3 and F6 (a gray/dark band). It looks bright and white in F2, F4 and F5. The strip changes only with rotation, so I infer the rotation state from it and treat the other events as load changes.

Strip states: F0 is dark (alpha 12), F1 is dark, F2 is bright, F3 is dark, F4 is bright, F5 is bright, F6 is dark.

The strip's intensity depends on sin²(2(θ−α)). Its axis runs from 10 to 40 degrees, so at α=12 it is near extinction on the left. At α=50 or 88 it would look different. A rotation of 38 degrees shifts 2α by 76 degrees. Dark-versus-bright is therefore not a simple function of α, so I use the sequence of changes.

Event 1 (F0 to F1): the strip is unchanged and the specimens change only slightly. The dogbone gains some color and the disk is similar. This is a load event, most likely IncreaseLoad (load 0.32 to 0.61).

Event 2 (F1 to F2): the strip changes from dark to bright, so this is a rotation. The specimen patterns change a lot.

Event 3 (F2 to F3): the strip returns to dark, so this is a rotation. F3 looks much like F1, which suggests the alpha is back at 12 and the event is the reverse rotation. If event 2 was clockwise (alpha 50), event 3 is counterclockwise (alpha 12). F3 resembling F1 is consistent with this.

Event 4 (F3 to F4): the strip turns bright again and F4 looks identical to F2, so alpha is back at 50. This is RotateClockwise.

Event 5 (F4 to F5): the strip stays bright, so this is a load event. The specimens look slightly less colored in the dogbone, with a lower retardance. This suggests DecreaseLoad (load 0.61 to 0.32).

Event 6 (F5 to F6): the strip turns dark, so this is a rotation back to alpha 12, which is RotateCounterclockwise.

For event 2, going from 12 to 50 requires clockwise, since the alternative of 12 to −26 would also give a bright strip. I choose clockwise. Events 3 and 4 follow from that choice. Event 6 returns to alpha 12 from 50 by counterclockwise rotation.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | IncreaseLoad | IncreaseLoad |
| 2 | RotateClockwise | RotateCounterclockwise |
| 3 | RotateCounterclockwise | RotateClockwise |
| 4 | RotateClockwise | RotateCounterclockwise |
| 5 | DecreaseLoad | DecreaseLoad |
| 6 | RotateCounterclockwise | RotateCounterclockwise |

<a name="s18"></a>

## S18 · Double reflection

Light reaches a screen after reflections from two mirrors. For each event, identify which mirror or mirrors turned and in what direction.

[![Double reflection. Seven chronological observations, the recorded controls and a response by Claude Sonnet 5.5.](S18.webp)](S18.webp)

[Solve the six-event question](https://pier-lab.github.io/CaveBench/#try-S18) · [Watch the episode](../../examples/S18/worked/dual_view.mp4)

<details><summary>Full evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
APPARATUS
Three fixed sources produce red, green and blue rays. Each ray travels from its source to Mirror1, then Mirror2, then one flat receiver screen. Mirror1 is left of and upstream of Mirror2; the screen is farther downstream. Both plane mirrors are 1.90 m wide and 1.40 m high and rotate about fixed centres without translating. The interior camera shows only the receiver screen and three spots, not the sources or mirrors. The screen grid spacing is 0.50 m. Colours distinguish rays, not operations.

Use the apparatus frame: +x is image-right, +y image-up, and +z downstream toward the screen. The screen centre is (0, 1.55, 4.532677) m; the camera faces approximately along +z with a small fixed calibration offset. Mirror1 is centred at (-1.20, 1.55, 0) m; Mirror2 at (1.00, 1.55, 1.80) m. Both stages have zero yaw and pitch at F0. Their oriented unit normals at zero are:
Mirror1: (-0.903670, 0.000000, 0.428230)
Mirror2: (0.964532, 0.000000, -0.263965)
The sources have these fixed positions in metres and unit launch directions:
Red: position (-1.200000, 1.550000, -3.000000); direction (-0.000000, 0.000000, 1.000000)
Green: position (-1.727366, 0.794434, -3.320348); direction (0.116074, 0.156897, 0.980770)
Blue: position (-0.455998, 2.598389, -2.467658); direction (-0.188286, -0.254505, 0.948565)
These rounded values specify the fixed apparatus, including geometry outside the camera view, not any event measurement.

CONTROLS
An event applies one action to one mirror, or one action on each mirror simultaneously. Mirror1's yaw and pitch increments are both 1.00 degree. Mirror2's yaw increment is 2.00 degrees and its pitch increment is 1.50 degrees. A selected stage completes its increment in 1.20 seconds; simultaneously selected stages start together. All settings accumulate without resets.

Mirror1Right and Mirror2Right increase the selected mirror's yaw about +y, the rotation taking +z toward +x; Mirror1Left and Mirror2Left decrease it. Mirror1Up and Mirror2Up increase pitch, tilting the chosen oriented normal toward +y from its horizontal zero-pitch heading; Mirror1Down and Mirror2Down decrease pitch. Unselected axes retain their settings.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event image is a native interior frame 3.50 s after its command begins. Event commands are 5.50 s apart. Mirror settings accumulate, and a single event may change both mirrors.
Capture times (physical/native capture time in seconds): F0=1.966667 s; F1=5.500000 s; F2=11.000000 s; F3=16.500000 s; F4=22.000000 s; F5=27.500000 s; F6=33.000000 s.
Supplied event start times: 2 s, 7.5 s, 13 s, 18.5 s, 24 s, 29.5 s.

ALLOWED ATOMIC LABELS
Mirror1Left, Mirror1Right, Mirror1Up, Mirror1Down, Mirror2Left, Mirror2Right, Mirror2Up, Mirror2Down

ALLOWED EVENT LABEL SETS
[["Mirror1Left"],["Mirror1Right"],["Mirror1Up"],["Mirror1Down"],["Mirror2Left"],["Mirror2Right"],["Mirror2Up"],["Mirror2Down"],["Mirror1Left","Mirror2Left"],["Mirror1Left","Mirror2Right"],["Mirror1Left","Mirror2Up"],["Mirror1Left","Mirror2Down"],["Mirror1Right","Mirror2Left"],["Mirror1Right","Mirror2Right"],["Mirror1Right","Mirror2Up"],["Mirror1Right","Mirror2Down"],["Mirror1Up","Mirror2Left"],["Mirror1Up","Mirror2Right"],["Mirror1Up","Mirror2Up"],["Mirror1Up","Mirror2Down"],["Mirror1Down","Mirror2Left"],["Mirror1Down","Mirror2Right"],["Mirror1Down","Mirror2Up"],["Mirror1Down","Mirror2Down"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["Mirror1Left"], ["Mirror1Right"], ["Mirror1Up"], ["Mirror1Down"], ["Mirror2Left"], ["Mirror2Right"], ["Mirror2Up"], ["Mirror2Down"], ["Mirror1Left", "Mirror2Left"], ["Mirror1Left", "Mirror2Right"], ["Mirror1Left", "Mirror2Up"], ["Mirror1Left", "Mirror2Down"], ["Mirror1Right", "Mirror2Left"], ["Mirror1Right", "Mirror2Right"], ["Mirror1Right", "Mirror2Up"], ["Mirror1Right", "Mirror2Down"], ["Mirror1Up", "Mirror2Left"], ["Mirror1Up", "Mirror2Right"], ["Mirror1Up", "Mirror2Up"], ["Mirror1Up", "Mirror2Down"], ["Mirror1Down", "Mirror2Left"], ["Mirror1Down", "Mirror2Right"], ["Mirror1Down", "Mirror2Up"], ["Mirror1Down", "Mirror2Down"]].

</details>

### Model Response · Claude Sonnet 5.5

I estimated each event from the spot shifts between frames. I did not run a full ray-trace, so the fine distinctions below rest on rough sensitivity estimates.

**Scale and spot positions.** The grid spacing of 0.5 m is about 82 px, so 1 px is about 0.0061 m. Spot positions (px) are:

| Frame | Red | Green | Blue |
|---|---|---|---|
| F0 | (479, 270) | (571, 161) | (313, 475) |
| F1 | (443, 255) | (542, 149) | (258, 461) |
| F2 | (365, 254) | (472, 145) | (155, 477) |
| F3 | (404, 255) | (507, 147) | (205, 470) |
| F4 | (365, 254) | (472, 145) | (155, 477) |
| F5 | (368, 220) | (484, 120) | (140, 424) |
| F6 | (407, 224) | (519, 125) | (191, 421) |

**Shifts per event (red).**
- E1 (F0→F1): (-36, -15)
- E2 (F1→F2): (-78, -1)
- E3 (F2→F3): (+39, +1)
- E4 (F3→F4): (-39, -1)
- E5 (F4→F5): (+3, -34)
- E6 (F5→F6): (+39, +4)

**Sensitivities.**
- Mirror2 yaw: a 2° rotation turns the reflected ray by 4°. Over the remaining path of about 2.7 m this gives roughly 0.19 m, or about 31 px, with a longer-path factor on top. A Mirror2 yaw step is therefore about ±39 px, and E3, E4 and E6 fit this size. Mirror2Right moves the beam toward +x, so E3 and E6 are Mirror2Right and E4 is Mirror2Left.
- Mirror1 yaw: a 1° rotation turns the beam by 2°, and the path of about 6.5 m gives roughly 0.2 m, or about 35 px. For red, Mirror1 yaw shifts the spot in x by an amount of that order. E1 is (-36, -15), which looks like a Mirror1 yaw. Its normal is (-0.9, 0, 0.43), so a yaw changes the direction mostly in x. Mirror1Left gives a shift toward -x, so E1 is Mirror1Left, and the -15 px in y is probably a small cross-coupling.
- E2 is -78 px, which is about 2 × 39. A single Mirror2Left would give -39, so -78 needs Mirror1Left (-36) plus Mirror2Left (-39), giving -75. E2 is therefore Mirror1Left with Mirror2Left.
- E5 is a pure y shift of -34 px with x unchanged. Mirror2 pitch of 1.5° gives a 3° beam change over about 2.7 m, or about 0.14 m, which is about 23 px. Mirror1 pitch of 1° gives 2° over about 6.5 m, or about 0.23 m, which is about 38 px. The y shift of -34 px is closer to the Mirror1 value, so E5 is Mirror1Down.

**Check on E1's y shift.** If E1 were Mirror1Left alone, the -15 px in y would come from cross-coupling. The E2 y shift is -1, though, and Mirror1Left appears in both E1 and E2, so the y shift should have repeated. Perhaps the E1 y shift comes from the rotated geometry. I could not resolve this, and I kept Mirror1Left for E1.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | Mirror1Left | Mirror1Down + Mirror2Left |
| 2 | Mirror1Left + Mirror2Left | Mirror1Right + Mirror2Left |
| 3 | Mirror2Right | Mirror1Left |
| 4 | Mirror2Left | Mirror1Right |
| 5 | Mirror1Down | Mirror1Down + Mirror2Down |
| 6 | Mirror2Right | Mirror1Left |

<a name="s19"></a>

## S19 · Graded refraction

Three light rays pass through a graded-index insert before reaching a screen. How was the insert translated or rotated at each event?

[![Graded refraction. Seven chronological observations, the recorded controls and a response by Claude Sonnet 5.5.](S19.webp)](S19.webp)

[Solve the six-event question](https://pier-lab.github.io/CaveBench/#try-S19) · [Watch the episode](../../examples/S19/dual_view.mp4)

<details><summary>Full evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
APPARATUS
Three fixed collimated rays travel from a source assembly on the left toward one finite receiver panel on the right. The receiver is a fixed rectangular screen with a visible border and fixed reference marks; the three visible spots come from the same rays in every frame. A single finite transparent graded-index insert lies between source and receiver and all three rays pass through it. The insert starts near the optical centre, is supported by one rigid carriage, and retains its accumulated pose between events. The camera is near the receiver looking back toward the source: image-right is the receiver/source-axis direction and image-up is laboratory +y; the near transverse side is toward the camera and the far side is away from it. The insert has approximate half-extents 0.90 m along the beam, 0.39 m vertically and 0.54 m transversely, with a smooth superellipsoidal boundary.

The effective index inside the insert follows the calibrated finite profile n=1+0.10(1-q)^2 where q is the superellipsoidal normalized radius (and n=1 outside). The three rays are integrated through this field and then meet the same finite receiver. This calibration describes the apparatus; it does not give a direct answer mapping from one spot displacement to one label. Small shape changes between samples are physical radius/exponent variations, not extra events.

ALLOWED LABELS
medium_left: translate the insert toward the source side along the optical axis.
medium_right: translate it toward the receiver side along the optical axis.
medium_near: translate it toward the camera-side transverse direction.
medium_far: translate it away from the camera-side transverse direction.
medium_rotate: rotate the insert with positive yaw about the laboratory vertical axis.
medium_counterrotate: rotate it with negative yaw about that same axis.
Each transition contains exactly one of these controls. The insert is not reset between transitions. Motion can leave residual pose or optical response from an earlier transition.



CURRENT INTERIOR DISPLAY
In the current delivered interior images, all three spots have a similar yellow/amber appearance. Their colours do not identify separate rays. Track the three-spot geometry relative to the fixed receiver border and reference marks; do not assume red, amber and blue identities are visibly available.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event image shows the response to exactly one new insert-control event. The insert retains its accumulated pose. Track the shared three-spot geometry relative to the fixed receiver border and reference marks, including the preceding state.
Capture times (physical/native capture time in seconds): F0=0.000000 s; F1=8.500000 s; F2=14.666667 s; F3=20.866669 s; F4=27.066668 s; F5=33.266670 s; F6=39.466667 s.

ALLOWED ATOMIC LABELS
medium_left, medium_right, medium_near, medium_far, medium_rotate, medium_counterrotate

ALLOWED EVENT LABEL SETS
[["medium_left"],["medium_right"],["medium_near"],["medium_far"],["medium_rotate"],["medium_counterrotate"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["medium_left"], ["medium_right"], ["medium_near"], ["medium_far"], ["medium_rotate"], ["medium_counterrotate"]].

</details>

### Model Response · Claude Sonnet 5.5

I could not derive these from a quantitative model, so they are best-guess labels based on how the three spots move between frames. I read the spot positions (x, y in image pixels) off each frame.

| Frame | Spot 1 | Spot 2 | Spot 3 |
|---|---|---|---|
| F0 | (422, 147) | (404, 207) | (408, 360) |
| F1 | (452, 170) | (433, 204) | (441, 355) |
| F2 | (418, 249) | (448, 251) | (470, 307) |
| F3 | (398, 238) | (438, 259) | (470, 307) |
| F4 | (518, 107) | (525, 179) | (527, 405) |
| F5 | (528, 86) | (545, 186) | (541, 405) |
| F6 | (513, 144) | (526, 207) | (523, 361) |

Each transition, with my reasoning:

1. **F0→F1:** All spots shift right by about 30 px and the spread shrinks slightly. I read this as a translation along the beam axis, so medium_right.
2. **F1→F2:** The spots converge strongly and move down toward the middle, which looks like a transverse shift. I chose medium_near.
3. **F2→F3:** Spot 1 moves left and up, spot 2 moves left, and spot 3 stays put. This is a small change in the tilt or yaw of the insert, so I chose medium_counterrotate.
4. **F3→F4:** The spots spread out vertically and jump right, which looks like the insert moving back to a centred position. That suggests medium_far, undoing the earlier near shift.
5. **F4→F5:** Spots 1 and 2 shift right and spot 3 shifts slightly right, with the top spot moving up and the spread growing. I chose medium_rotate.
6. **F5→F6:** The spread shrinks again and the spots move left and down toward the F0 pattern. I chose medium_left.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | medium_right | medium_rotate |
| 2 | medium_near | medium_far |
| 3 | medium_counterrotate | medium_left |
| 4 | medium_far | medium_near |
| 5 | medium_rotate | medium_counterrotate |
| 6 | medium_left | medium_right |

<a name="s20"></a>

## S20 · Double-slit fringes

A coherent light source illuminates two adjustable slits. Which changes in slit width, slit spacing or both produced each fringe pattern?

[![Double-slit fringes. Seven chronological observations, the recorded controls and a response by Claude Sonnet 5.5.](S20.webp)](S20.webp)

[Solve the six-event question](https://pier-lab.github.io/CaveBench/#try-S20) · [Watch the episode](../../examples/S20/dual_view.mp4)

<details><summary>Full evaluation prompt</summary>

Infer exactly 6 hidden events from exactly 7 chronological interior images F0-F6. F0 is the initial evidence frame before the first event. Each subsequent image adds one new event. Use only these supplied images and the public apparatus description. Reconstruct the complete unordered set of controls at every supplied event; events are ordered in time.

APPARATUS AND PUBLIC CONTROL DEFINITIONS
APPARATUS AND VIEW
One fixed coherent monochromatic light source illuminates two parallel vertical slits made by four real opaque knife edges. The four edges share a width-adjustment mechanism and a separate centre-spacing adjustment mechanism. Both slit widths are equal. A single fixed flat receiver behind the slits shows vertical interference fringes inside a broader diffraction envelope. Source, receiver, wavelength, camera, illumination and exposure are fixed throughout one sample. The two slits are not independently illuminated or independently resized.

Laboratory-up is positive y. Light propagates approximately along positive z from the source toward the receiver; slit width and centre spacing lie along x. The interior camera is at approximately (0,1.99,0.82), looking along positive z toward the receiver centred at (0,1.99,3.78) in scene units. The image is not mirrored: positive x is image-right and positive y is up. The receiver front is5.1 scene units wide and2.76 high. It is an enlarged instrument display of the optical distribution, not a literal5.1m-wide optical propagation experiment. No hidden handwheels, blades or mechanisms are visible in this receiver-only camera. Fixed frame edges and neutral fiducials are stationary references, not answer codes. A fixed source colour may differ between samples but does not change within a sample or encode an operation.

MECHANICS AND DECLARED OPTICAL MODEL
The two independent shafts move continuously at up to260 degrees/s. Real shaft angles drive differential screws, followers and links, which determine actual knife-edge positions. The ideal mechanism is backlash-free and completes each permitted gesture in less than0.83s. It does not reset the receiver pattern between events.

For understanding the scaled apparatus, if the width shaft angle is theta_w and spacing shaft angle theta_d in degrees, the rendered real mechanical gaps are w=0.23+0.00065*theta_w and s=0.68+0.00170*theta_d scene units. The corresponding calibrated optical slit width is a=0.060+0.085*(w-0.14)/0.16 millimetres; optical centre spacing is d=0.30+0.32*(s-0.52)/0.42 millimetres. These are two explicit scale calibrations, not a claim that the large visible knife gaps have microscopic physical size. The sample begins at actual shaft angles within theta_w=-30..30 and theta_d=-22..22 degrees. Their initial values are not necessarily a preceding control endpoint.

The wavelength lambda is constant within the sample and lies in538..644nm; there is no hidden wavelength-changing control. The receiver represents an optical distance L=2.4m and horizontal optical span95mm from -47.5 to+47.5mm. Its fixed display magnification does not change between images. For optical horizontal coordinate X, sin(theta)=X/sqrt(L^2+X^2). The intensity is proportional to sinc^2(pi*a*sin(theta)/lambda)*cos^2(pi*d*sin(theta)/lambda), where sinc(u)=sin(u)/u and all lengths use matching units. A fixed0.58 brightness gamma, fixed spectral tint and fixed fine surface texture affect appearance, not the spatial scale. This is a declared Fraunhofer instrument model, not a full Maxwell propagation or photometrically calibrated hardware simulation.

The broad diffraction envelope and its minima constrain a; the fine fringe pitch constrains d. Both affect the same intensity image, including missing orders and the number of visible bright fringes. Counted bright bands or overall brightness alone can be misleading. Compare both the broad envelope and the fine periodic structure relative to fixed screen geometry, including the preceding state. A dual change can combine a wider envelope with tighter fringes, or a narrower envelope with wider fringes; neither control cancels the other's physical change.

ALLOWED PRIMITIVE CONTROLS
NarrowSlits: drive only the width shaft to -123degrees, decreasing both actual slit widths; spacing stays at its previous endpoint unless a spacing control is simultaneously selected.
WidenSlits: drive only the width shaft to+92degrees, increasing both widths; spacing otherwise persists.
IncreaseSpacing: drive only the spacing shaft to+135degrees, moving the slit centres farther apart; width otherwise persists.
DecreaseSpacing: drive only the spacing shaft to-76degrees, moving the slit centres closer; width otherwise persists.

Each event contains either exactly ONE primitive or TWO simultaneous primitives: one from {NarrowSlits,WidenSlits} and one from {IncreaseSpacing,DecreaseSpacing}. Opposite primitives on the same axis are forbidden. An unselected axis remains at its preceding setting. Every selected axis makes a real nonzero change; selecting an already reached endpoint is not counted as an operation. Operation sets are unordered within an event, but the events are ordered. No per-label frequency or sequence is supplied.

OBSERVATION PROTOCOL FOR THIS PREFIX
Each event image shows the completed real nonzero change of its selected slit mechanism axes. The pattern is generated by the same fixed optical calibration throughout this sample; an unselected axis retains its preceding setting. Use both the diffraction envelope and fine fringe spacing relative to the receiver geometry.
Capture times (physical/native capture time in seconds): F0=0.000000 s; F1=8.500000 s; F2=14.683334 s; F3=20.883335 s; F4=27.083334 s; F5=33.283337 s; F6=39.483334 s.

ALLOWED ATOMIC LABELS
NarrowSlits, WidenSlits, IncreaseSpacing, DecreaseSpacing

ALLOWED EVENT LABEL SETS
[["NarrowSlits"],["WidenSlits"],["IncreaseSpacing"],["DecreaseSpacing"],["IncreaseSpacing","NarrowSlits"],["DecreaseSpacing","NarrowSlits"],["IncreaseSpacing","WidenSlits"],["DecreaseSpacing","WidenSlits"]]

REQUIRED OUTPUT
Return only one valid JSON object with exactly one root field, "operations". Its value must contain exactly 6 nonempty lists, in chronological event order. Every inner list must equal one allowed event label set and comply with the control rules above. Order within an event list does not matter. Even if uncertain, select your best-supported allowed answer for every event. Never return an empty list, null, unknown, abstention, or a missing event. Do not output markdown, commentary, or additional fields.
FINAL ANSWER CONTRACT: Give exactly 6 chronological event arrays under the sole JSON key "operations". Choose the most likely legal answer for EVERY event even when uncertain. Do not abstain, return an empty answer, or omit simultaneous actions. Your final visible answer must be only the JSON object. Legal action sets for one event: [["NarrowSlits"], ["WidenSlits"], ["IncreaseSpacing"], ["DecreaseSpacing"], ["IncreaseSpacing", "NarrowSlits"], ["DecreaseSpacing", "NarrowSlits"], ["IncreaseSpacing", "WidenSlits"], ["DecreaseSpacing", "WidenSlits"]].

</details>

### Model Response · Claude Sonnet 5.5

Reading the frames, F1 and F3 look identical, and F2, F4 and F6 look identical, so the states alternate between a few distinct patterns.

**State estimates**
- F0 has fringe pitch of about 26 px and an envelope first minimum near ±130 px from center.
- F1 has finer fringes (about 20 px pitch) and a wider envelope, with the first minimum near ±160 px. Both the envelope and the fringe pitch changed from F0.
- F2 has coarse fringes (about 37 px pitch) and a narrow central envelope.
- F5 has fringes of about 36 px pitch and a central envelope roughly 2.5 times wider than F2's.

**Event reasoning**
1. F0→F1: the fringes became tighter, so spacing increased. The envelope in F0 had its first minimum at about ±130 px, and in F1 the minimum is wider at about ±160 px. A wider envelope means the slits widened. This gives IncreaseSpacing and WidenSlits.
2. F1→F2: the fringes became coarser (spacing decreased) and the envelope narrowed (slits narrowed). This gives DecreaseSpacing and NarrowSlits.
3. F2→F3: F3 equals F1, so the change reverses the previous one: IncreaseSpacing and WidenSlits.
4. F3→F4: F4 equals F2, so the change is again DecreaseSpacing and NarrowSlits.
5. F4→F5: the fringes are about the same pitch (spacing unchanged), but the envelope is wider, so the slits widened. This gives WidenSlits alone.
6. F5→F6: F6 returns to the F2 pattern, with a narrower envelope and the same fringe pitch, so NarrowSlits alone.

**Consistency check on endpoints**
Because each control drives its shaft to a fixed endpoint, the states are limited to a few shaft angles. The width endpoints are -123 and +92, and the spacing endpoints are +135 and -76.
- F1 and F3 are width +92 with spacing +135.
- F2, F4 and F6 are width -123 with spacing -76.
- F5 is width +92 with spacing -76, which fits the coarse fringes with a wide envelope.
- F0 has intermediate initial values.

The sequence is consistent with these endpoints.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | IncreaseSpacing + WidenSlits | IncreaseSpacing + NarrowSlits |
| 2 | DecreaseSpacing + NarrowSlits | DecreaseSpacing + WidenSlits |
| 3 | IncreaseSpacing + WidenSlits | IncreaseSpacing + NarrowSlits |
| 4 | DecreaseSpacing + NarrowSlits | DecreaseSpacing + WidenSlits |
| 5 | WidenSlits | NarrowSlits |
| 6 | NarrowSlits | WidenSlits |
