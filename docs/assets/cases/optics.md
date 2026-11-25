<h1 align="center">Optics</h1>

<p align="center"><a href="README.md">All case studies</a> · <a href="#s17">S17</a> · <a href="#s18">S18</a> · <a href="#s19">S19</a> · <a href="#s20">S20</a></p>

<a name="s17"></a>

## S17 · Photoelastic load

A fixed camera looks through crossed polarizers at a press holding transparent specimens of different shapes. Locate the narrow-waisted dogbone, the arch and the perforated disk in the initial view; their order can vary. The upper crosshead presses them against a fixed lower anvil. A narrow optical strip above the crosshead lies outside the load path. Its material axes turn progressively across its width, giving the camera a reference for the orientation of the shared polarizers.

A turn of the polarizers changes the strip’s brightness pattern as well as the appearance of the specimens. A change in press load changes stress in the specimens but leaves the strip optically unchanged. Compare these responses from one observation to the next, following the patterns around the neck, arch legs and hole. The dogbone responds fastest and the disk retains stress longest. Images are taken after the drive ends, so colours or fringes left by an earlier load can persist.

Which single control was operated at each event? IncreaseLoad and DecreaseLoad change compression. RotateClockwise and RotateCounterclockwise describe turns viewed from outside the right wall, facing inward. A clockwise turn of that wheel increases the optical angle measured counterclockwise from image-right in the camera view; a counterclockwise turn decreases it. Give a single label per event and return the chronological sets under the sole JSON key “operations”.

[View prompt figure](S17-prompt.webp)

<details><summary>Legal control sets</summary>

IncreaseLoad · DecreaseLoad · RotateClockwise · RotateCounterclockwise

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["IncreaseLoad"], ["RotateCounterclockwise"], ["RotateClockwise"], ["RotateCounterclockwise"], ["DecreaseLoad"], ["RotateCounterclockwise"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

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

[![Photoelastic load. Seven observations and Qwen3.8-27B’s response.](S17.webp)](S17.webp)

[Complete model response and source](../../examples/S17/illustrated_response.json) · [View the case](https://pier-lab.github.io/CaveBench/#S17) · [Watch the episode](../../examples/S17/dual_view.mp4)

### Model Response · Qwen3.8-27B

This is getting too uncertain. Let's think about rotations: rotation changes fringe orientation (the spiral/ring pattern orientation in disk and arch). The disk in F0 shows simple concentric (radial symmetric-ish) pattern. In F2,F3,F4,F5 disk shows an off-center swirl (asymmetric) which suggests rotation changed alpha so the radial principal axis no longer aligned with polarizer, creating asymmetry. In F1 disk shows concentric ring. In F6 disk returns to concentric (like F0). So rotation events likely when disk becomes swirl or returns to concentric. Sequence of disk pattern: F0 concentric F1 concentric (ring) F2 swirl F3 swirl F4 swirl F5 swirl F6 concentric So a rotation happened before F2 (event2) changing alpha, and another rotation before F6 (event6) returning alpha near initial. That's two rotations among 6 events. The other 4 are load ops.

But wait rotation changes alpha by 38° each. Starting 12. After one rotation (CCW?) alpha = 12-38 = -26 or +50. After two rotations could return to 12? 12+38+... no. To return to concentric (alpha near initial principal alignment) maybe two rotations same direction: 12+38+38=88? Not same. Or one CW one CCW: 12+38-38=12 returns! So event2 = RotateClockwise (alpha 50) and event6 = RotateCounterclockwise (alpha 12) would return to initial. Or vice versa. But F1 (after event1) disk is concentric like F0, meaning event1 did NOT change alpha (so event1 is load op). Good. F2 swirl => event2 changed alpha (rotation). F3,F4,F5 still swirl (alpha unchanged) => events3,4,5 are load ops. F6 concentric => event6 rotation back. Thus rotations at events 2 and 6; load ops at 1,3,4,5.

Now determine directions and load up/down. Event1 load: F0->F1 dogbone got more colored (med). Load increased? F0 0.32 -> F1 0.61 (IncreaseLoad). Plausible. Event2 rotation: direction? Need to see orientation of swirl. Hard. Let's look at arch pattern orientation. In F2 arch shows concentric ring with two red vertical lines near center; in F3 arch green ring; F4 arch ring with red; F5 arch ring. The swirl in disk F2 vs F6? F6 concentric. Determine CW vs CCW: The strip principal axis 10-40° CCW. With alpha=12, near left of strip axis~10 so alpha-axis small -> dark? Hmm. Honestly distinguishing CW vs CCW from these images is very hard. I'll make a reasonable guess.

Let's look at the disk swirl handedness: In F2 the disk swirl has a particular curl direction. In F5 similar. Not helpful for sign. Given the ambiguity, I'll commit to a plausible sequence: Event1: IncreaseLoad Event2: RotateClockwise Event3: DecreaseLoad (F3 dogbone faint => load dropped from high to low; from 0.61? wait after event2 rotation load still 0.61; event3 decrease ->0.32; but F2 was high meaning load 0.61 already high-ish; F3 faint 0.32) Hmm but F2 high vs F1 med: event2 was rotation not load, so load same as F1 (0.61). Then F2 should equal F1 in stress, but F2 looks more intense than F1. Could be stress relaxation/time? The dogbone relaxes fast though. Hmm. This is too detailed to be confident. Let's think about typical ground-truth for such synthetic tasks: often they alternate. I'll produce a best-guess.

Let's look at arch color intensity as load indicator too (arch intermediate speed). F0 arch strong. F1 arch strong. F2 arch strong (ring). F3 arch moderate. F4 arch strong. F5 arch strong. F6 arch strong (like F0). Hmm F6 arch strong like F0, but dogbone faint like F0. Inconsistent with simple load.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | IncreaseLoad | IncreaseLoad |
| 2 | RotateCounterclockwise | RotateCounterclockwise |
| 3 | DecreaseLoad | RotateClockwise |
| 4 | IncreaseLoad | RotateCounterclockwise |
| 5 | DecreaseLoad | DecreaseLoad |
| 6 | RotateClockwise | RotateCounterclockwise |

<a name="s18"></a>

## S18 · Double reflection

A fixed red ray, green ray and blue ray reach a flat receiver after reflecting from an upstream mirror and then a downstream mirror. The upstream mirror stands to the left of the downstream mirror. The camera is near the outgoing part of the optical path and looks toward the receiver; it sees the illuminated spots and the rectangular grid, while the mirrors and their supports are outside its field of view. In the initial image both stages are at their reference yaw and pitch settings. Identify the coloured spots against the grid and retain their identities throughout the sequence.

The red ray starts in line with the upstream mirror and travels straight downstream. The green source is lower and farther to the left, sending its ray upward and toward the right. The blue source is higher and farther to the right, sending its ray downward and toward the left. These distinct launch paths strike the same mirrors at different places. When the upstream mirror turns, it changes the outgoing direction and the point where each ray meets the downstream mirror; the rays must then reflect again before reaching the grid. When the downstream mirror turns alone, the incoming rays still follow their previous paths up to that mirror. A rightward yaw turns the downstream axis toward image-right; an upward pitch tips the selected mirror’s normal upward. The upstream mirror uses the same size of increment for yaw and pitch. The downstream mirror moves farther per command, and its yaw increment is larger than its pitch increment. Read horizontal and vertical spot shifts against the fixed grid, comparing the group displacement and changes in relative spacing. Each image follows completion of the commanded turn. An unselected axis retains its preceding orientation, so use the previous spot pattern as the starting point for the next comparison.

Which mirror turned, and in what direction? For the upstream stage choose UpstreamMirrorLeft, UpstreamMirrorRight, UpstreamMirrorUp or UpstreamMirrorDown. For the downstream stage choose DownstreamMirrorLeft, DownstreamMirrorRight, DownstreamMirrorUp or DownstreamMirrorDown. Each stage can take a single turn per event. A stage may act by itself, or both may turn simultaneously. Return every selected turn in chronological event sets under the sole JSON key “operations”.

[View prompt figure](S18-prompt.webp)

<details><summary>Legal control sets</summary>

UpstreamMirrorLeft · UpstreamMirrorRight · UpstreamMirrorUp · UpstreamMirrorDown · DownstreamMirrorLeft · DownstreamMirrorRight · DownstreamMirrorUp · DownstreamMirrorDown · UpstreamMirrorLeft + DownstreamMirrorLeft · UpstreamMirrorLeft + DownstreamMirrorRight · UpstreamMirrorLeft + DownstreamMirrorUp · UpstreamMirrorLeft + DownstreamMirrorDown · UpstreamMirrorRight + DownstreamMirrorLeft · UpstreamMirrorRight + DownstreamMirrorRight · UpstreamMirrorRight + DownstreamMirrorUp · UpstreamMirrorRight + DownstreamMirrorDown · UpstreamMirrorUp + DownstreamMirrorLeft · UpstreamMirrorUp + DownstreamMirrorRight · UpstreamMirrorUp + DownstreamMirrorUp · UpstreamMirrorUp + DownstreamMirrorDown · UpstreamMirrorDown + DownstreamMirrorLeft · UpstreamMirrorDown + DownstreamMirrorRight · UpstreamMirrorDown + DownstreamMirrorUp · UpstreamMirrorDown + DownstreamMirrorDown

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["UpstreamMirrorDown", "DownstreamMirrorLeft"], ["UpstreamMirrorRight", "DownstreamMirrorLeft"], ["UpstreamMirrorLeft"], ["UpstreamMirrorRight"], ["UpstreamMirrorDown", "DownstreamMirrorDown"], ["UpstreamMirrorLeft"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

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

[![Double reflection. Seven observations and Qwen3.8-27B’s response.](S18.webp)](S18.webp)

[Complete model response and source](../../examples/S18/illustrated_response.json) · [View the case](https://pier-lab.github.io/CaveBench/#S18) · [Watch the episode](../../examples/S18/worked/dual_view.mp4)

### Model Response · Qwen3.8-27B

Let me think about what each control does to the screen spots physically. The ray path: source -> M1 -> M2 -> screen. The orientation of M1 changes the direction of the ray after M1, which then hits M2 at a different point and direction, then M2 reflects to screen. Similarly M2 orientation changes the final direction. Effect of M1 yaw (rotation about +y): changes horizontal component. Effect of M1 pitch: changes vertical component. Similarly M2. But because M2 also reflects, a M1 change propagates through M2 and affects screen in both x and y possibly. This is too detailed.

Given the difficulty, maybe the intended solution is simpler: The spots all move together in a translation that indicates a particular mirror axis. Because all three rays pass through both mirrors, a pure yaw change on M1 shifts all three spots horizontally on screen (left/right) by some amount; a pitch change shifts them vertically; M2 changes also shift but maybe opposite sign or different magnitude. Let's look at vertical (y) movements: In F0->F1 all three move up a bit. F1->F2: red same, green up tiny, blue down. F2->F3: red same, green up, blue up. F3->F4: red same, green up, blue down. F4->F5: all up. F5->F6: all up tiny. Horizontal: F0->F1 all left. F1->F2 all left. F2->F3 all right. F3->F4 all left. F4->F5: red ~same, green right, blue left (small). F5->F6 all right. Hmm.

This is too noisy for me to be confident. Let me consider that maybe each frame's event is a single-axis single-mirror move, and the direction of horizontal vs vertical shift tells axis, and the sign/magnitude pattern tells which mirror. Define screen image coords: +x image-right, +y image-up. So "up" in image = +y on screen. "left" = -x. Let me think about M1Right (increase yaw, rotation taking +z toward +x). Hard. Given time, maybe I should guess a plausible sequence. But the instruction wants best-supported. Let me look at the dominant motion per transition: Transition 1 (F0->F1): left + up. Transition 2 (F1->F2): left (strong), small vertical. Transition 3 (F2->F3): right. Transition 4 (F3->F4): left. Transition 5 (F4->F5): up (strong), small horizontal. Transition 6 (F5->F6): right + up. Hmm transitions 1 and 6 similar (right-left? 1 is left+up, 6 is right+up). Not matching.

Let me reconsider pixel reading by looking at grid columns. I'll define columns by the vertical grid lines. In F0, count columns: I see vertical lines at roughly x = 80,160,240,320,400,480,560,640,720,800,880,960,1040? Actually image width likely 1000, with left dark border to ~80 and right border after 960. Let's say grid lines every 80 px starting 80: 80,160,...,960 (12 lines). That's 11 columns? 960-80=880, /80 = 11 columns. Good. Now red F0 at x≈500 which is between 480 and 560, near 480+20. Hmm not on a line. The spots are not necessarily on grid lines. I think precise reasoning is infeasible. Let's think about typical puzzle design: they probably generated random sequences of allowed events and rendered. The answer is a specific sequence. Without simulation, I must infer.

Maybe I can use relative displacement magnitude: a Mirror2 change produces larger screen shift than Mirror1 change because M2 is closer to screen? Actually a rotation at M2 directly changes the final ray direction before screen, so screen shift = distance_M2_to_screen * angle. M1 rotation changes ray before M2, which then also changes where it hits M2 and the reflection; effect on screen maybe smaller. The increments: M1 yaw 1°, M2 yaw 2°.

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | Mirror1Left + Mirror2Up | Mirror1Down + Mirror2Left |
| 2 | Mirror2Left | Mirror1Right + Mirror2Left |
| 3 | Mirror1Right | Mirror1Left |
| 4 | Mirror1Left | Mirror1Right |
| 5 | Mirror2Up | Mirror1Down + Mirror2Down |
| 6 | Mirror1Right | Mirror1Left |

<a name="s19"></a>

## S19 · Graded refraction

Fixed collimated rays travel from a source on the left through a transparent graded-index insert to a receiver on the right. The insert starts near the optical centre and is carried by a movable support. The camera is near the receiver, looking back toward the source. Locate the amber spots against the receiver border and fixed reference marks in the initial image. The spots have a similar colour, so follow their relative positions across the sequence.

The refractive index varies smoothly within the insert and approaches that of the surrounding medium near its boundary. Translating the insert changes the part of this profile traversed by each ray. Rotating it changes the profile’s orientation across the paths. Compare the whole spot pattern with its preceding position after each carriage movement. The carriage keeps the pose reached at the end of an event; the following change therefore acts on rays already passing through a shifted or rotated profile.

Which single carriage control acted at each event? medium_left and medium_right translate the insert along the beam toward the source or the receiver. medium_near and medium_far move it across the beam toward or away from the camera. medium_rotate and medium_counterrotate turn it in the positive or negative sense about the vertical axis. Return the chronological one-label sets under the sole JSON key “operations”.

[View prompt figure](S19-prompt.webp)

<details><summary>Legal control sets</summary>

medium_left · medium_right · medium_near · medium_far · medium_rotate · medium_counterrotate

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["medium_rotate"], ["medium_far"], ["medium_left"], ["medium_near"], ["medium_counterrotate"], ["medium_right"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

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

[![Graded refraction. Seven observations and Qwen3.8-27B’s response.](S19.webp)](S19.webp)

[Complete model response and source](../../examples/S19/illustrated_response.json) · [View the case](https://pier-lab.github.io/CaveBench/#S19) · [Watch the episode](../../examples/S19/dual_view.mp4)

### Model Response · Qwen3.8-27B

Look at vertical positions of the three spots: F0: top130, mid175, bot300 F1: top150, mid175, bot300 F2: top210, mid210, bot265 F3: top210, mid230, bot270 F4: top95, mid155, bot330 F5: top65, mid155, bot330 F6: top120, mid175, bot320 Horizontal: F0: 430,420,425 F1: 465,450,455 F2: 435,470,485 F3: 405,450,485 F4: 530,535,545 F5: 530,565,545 F6: 530,535,545 Notice F4-F6 horizontal ~530-545 (right side). F0-F3 horizontal ~400-485 (left-center). So somewhere between F3 and F4 there's a big rightward jump. That could be a transverse translation (near or far) which shifts everything horizontally. Then F4->F5->F6 small changes.

Within F0-F3, the pattern rotates from vertical (F0) to horizontal-ish (F2) to diagonal (F3). That looks like a rotation (yaw) sequence: F0 vertical, then tilt, then more tilt. A yaw rotation about vertical axis would shift spots horizontally in proportion to vertical coordinate? Actually the index profile is symmetric; rotating it about vertical axis tilts the gradient, producing a horizontal deflection that depends on vertical position (like a prism whose angle depends on y). So a small yaw would make the column tilt into a diagonal: top spot moves one horizontal direction, bottom spot moves opposite, proportional to their vertical offset from center. In F0 they're aligned vertically (x same). In F1 top x increased relative to mid? top465 vs mid450: top moved right more. bottom455 similar to mid. Hmm.

In F2: top435 (left), mid470 (right), bottom485 (more right). So as y goes down, x increases → diagonal with negative slope in pixel (x right, y down) meaning in real (y up) it's positive slope? This diagonal in F2 then F3 top405 mid450 bot485 similar diagonal. So F2->F3 maybe small rotation change. F0 vertical (no tilt). F1 slight tilt (top right). F2 more tilt but reversed? Hmm. I'm spending too long. The grader likely expects a specific 6-length sequence. Given uncertainty, I'll make a reasonable guess using monotonic reasoning: Event1 (F0->F1): small rightward shift of column + slight tilt → medium_right? but right is optical axis translation. Optical axis translation changes spread magnitude, not shift. Hmm.

Let's consider that translation along optical axis (left/right) changes the effective power so spots move toward/away from center baseline (the no-insert positions). In F0 the column is left; maybe baseline is center-right. Moving insert toward source (left) increases optical effect → spots move more from baseline. Moving toward receiver (right) decreases effect → spots approach baseline. If baseline (no insert) is around x~530 (right side), then in F0 (x~425) the insert has strong effect; in F4 (x~535) effect reduced (insert moved right). So F0->F4 trending right toward baseline suggests medium_right events. But there's also rotation effects causing the diagonal. I'll commit to a plausible sequence: 1: medium_right 2: medium_rotate 3: medium_counterrotate 4: medium_right 5: medium_near 6: medium_far Hmm but I need 6 events for F1..F6.

Let me look at vertical positions: F4 vertical spread large (top95 bot330). F5 top65 (even higher). F6 top120. So vertical position changes a lot; that suggests vertical translation? But there's no vertical control label! Controls are left,right (optical axis), near,far (transverse toward/away camera), rotate, counterrotate (yaw about vertical). None translate vertically (y). So vertical changes in spots must come from rotation (which couples vertical position to horizontal) or optical axis translation (changes spread vertically? no, spread is along beam direction which is image... hmm).

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | medium_right | medium_rotate |
| 2 | medium_rotate | medium_far |
| 3 | medium_counterrotate | medium_left |
| 4 | medium_left | medium_near |
| 5 | medium_near | medium_counterrotate |
| 6 | medium_far | medium_right |

<a name="s20"></a>

## S20 · Double-slit fringes

A coherent light source illuminates a pair of parallel vertical slits. Opaque knife edges form the openings. A width mechanism adjusts the slits equally, while a separate mechanism adjusts the distance between their centres. Beyond them the camera faces a fixed receiver carrying a pattern of fine bright fringes inside a much broader diffraction envelope. Use the fixed screen edges and marks to locate both features in the initial image and in subsequent observations.

When the slit centres move farther apart, neighbouring bright fringes are closer together; moving the centres closer together spreads the fringes apart. Slit width affects the broader envelope: narrowing the slits spreads its minima outward and widening them brings the minima inward. Changing either setting can alter how many bright bands are visible. Compare their spacing as well as where the envelope dims, since a simultaneous movement can change these features in different directions. Each image shows the completed adjustment, with an unselected mechanism holding its preceding position.

Which controls moved? NarrowSlits and WidenSlits act on the common slit width. IncreaseSpacing and DecreaseSpacing act on the distance between the centres. A mechanism may act alone, or a width adjustment and a spacing adjustment may be made together. Return all selected labels in chronological event sets under the sole JSON key “operations”.

[View prompt figure](S20-prompt.webp)

<details><summary>Legal control sets</summary>

NarrowSlits · WidenSlits · IncreaseSpacing · DecreaseSpacing · IncreaseSpacing + NarrowSlits · DecreaseSpacing + NarrowSlits · IncreaseSpacing + WidenSlits · DecreaseSpacing + WidenSlits

</details>

<details><summary>Reference answer</summary>

```json
{"operations": [["IncreaseSpacing", "NarrowSlits"], ["DecreaseSpacing", "WidenSlits"], ["IncreaseSpacing", "NarrowSlits"], ["DecreaseSpacing", "WidenSlits"], ["NarrowSlits"], ["WidenSlits"]]}
```

</details>

<details><summary>Original evaluation prompt</summary>

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

[![Double-slit fringes. Seven observations and Qwen3.7-Plus’s response.](S20.webp)](S20.webp)

[Complete model response and source](../../examples/S20/illustrated_response.json) · [View the case](https://pier-lab.github.io/CaveBench/#S20) · [Watch the episode](../../examples/S20/dual_view.mp4)

### Model Response · Qwen3.7-Plus

Let's look at the images again. F1: Wide envelope, tight fringes. Looks like State A (-123, +135). F2: Narrow envelope, wide fringes. Looks like State B (+92, -76). F3: Wide envelope, tight fringes. Looks like State A (-123, +135). (Same as F1). F4: Narrow envelope, wide fringes. Looks like State B (+92, -76). (Same as F2). F5: Medium envelope, medium fringes? - Wait, F5 looks like the envelope is wider than F4, but not as wide as F1. - And fringes are tighter than F4, but not as tight as F1. - Is it possible that F5 is State C or D? - State C: (-123, -76). Min width (wide envelope), Min spacing (wide fringes). - Wide envelope + Wide fringes. - F5 has a wider envelope than F4 (which is narrow envelope).

So NarrowSlits fits. - F5 has fringes that look... actually, let's count. - In F4 (State B: +92, -76), a is max, d is min. Narrow envelope, wide fringes. - In F5, if we apply NarrowSlits only: a becomes min (-123), d stays min (-76). - State C: (-123, -76). Wide envelope, wide fringes. - Let's check F5 image. Envelope is wider than F4. Fringes look similar to F4? - In F4, central blob has ~3 bright bands. - In F5, central blob has ~5-6 bright bands. The spacing looks similar to F4? No, slightly tighter. - Actually, F5 looks like NarrowSlits was applied to F4. - F4 state: a=max, d=min. - Apply NarrowSlits: a=min, d=min. - Result: Wide envelope (because a is min), Wide fringes (because d is min). - Does F5 show wide fringes?

Yes, the fringes are quite thick, similar to F2/F4/F6. - Does F5 show wide envelope? Yes, the bright region is wider than F2/F4/F6. - So F5 corresponds to NarrowSlits applied to F4. - Event 5: ["NarrowSlits"]. F6: Narrow envelope, wide fringes. Looks like State B (+92, -76). - From F5 (State C: -123, -76) to F6 (State B: +92, -76). - Change: a goes from min to max. -> WidenSlits. - d stays at min. - Event 6: ["WidenSlits"]. Let's re-verify the whole chain. Start F0: Initial state. $\theta_w \approx 0, \theta_d \approx 0$. - a medium, d medium. - Image F0: Medium envelope, medium fringes. (Looks consistent).

Event 1 (F0 -> F1): - Target: F1 (Wide envelope, tight fringes). - This requires small a (wide envelope) and large d (tight fringes). - Primitives: NarrowSlits (to -123) and IncreaseSpacing (to +135). - Event 1: ["IncreaseSpacing", "NarrowSlits"]. - State: a=min, d=max. Event 2 (F1 -> F2): - Target: F2 (Narrow envelope, wide fringes). - This requires large a (narrow envelope) and small d (wide fringes). - Primitives: WidenSlits (to +92) and DecreaseSpacing (to -76). - Event 2: ["DecreaseSpacing", "WidenSlits"]. - State: a=max, d=min. Event 3 (F2 -> F3): - Target: F3 (Wide envelope, tight fringes). Same as F1. - Primitives: NarrowSlits and IncreaseSpacing. - Event 3: ["IncreaseSpacing", "NarrowSlits"]. - State: a=min, d=max.

Event 4 (F3 -> F4): - Target: F4 (Narrow envelope, wide fringes). Same as F2. - Primitives: WidenSlits and DecreaseSpacing. - Event 4: ["DecreaseSpacing", "WidenSlits"]. - State: a=max, d=min. Event 5 (F4 -> F5): - Target: F5. - Compare F4 (Narrow envelope, wide fringes) and F5. - F5 has a wider envelope than F4. (Bright region is broader). -> NarrowSlits. - F5 fringes look similar to F4 (wide). Maybe slightly different? - If NarrowSlits only: a=min, d=min (unchanged from F4). - State: a=min, d=min. (Wide envelope, wide fringes). - Let's check F5 image. The envelope is definitely wider than F4. The fringes are still quite wide (thick bands). - This fits NarrowSlits only. - Event 5: ["NarrowSlits"].

### Model Answer and Experiment Log

| Event | Model answer | Recorded control |
| ---: | --- | --- |
| 1 | IncreaseSpacing + NarrowSlits | IncreaseSpacing + NarrowSlits |
| 2 | DecreaseSpacing + WidenSlits | DecreaseSpacing + WidenSlits |
| 3 | IncreaseSpacing + NarrowSlits | IncreaseSpacing + NarrowSlits |
| 4 | DecreaseSpacing + WidenSlits | DecreaseSpacing + WidenSlits |
| 5 | NarrowSlits | NarrowSlits |
| 6 | WidenSlits | WidenSlits |
