# V5 actual final-MP4 visual review

Reviewed file: `FinalFinalStudio-BusinessPlan-75s-v5.mp4`  
SHA-256: `8c5a0028f90f0d52f9f6a58219c60fb9a6369afe7c5777276d6fd5e2396213d5`

The review uses actual finished H.264 frames decoded with FFmpeg. Six four-state sheets contain 184 selected samples across 46 text blocks, from 152 distinct encoded frames. All six sheets were visually inspected, together with 13 full-resolution measured title/price/CTA crops, the ten-frame Brief contact and five encoded transition strips. This is selected-frame visual inspection, not a claim that every video frame was manually watched.

## Findings

- **Brief retirement: passed.** Goal, Audience, Message, Aa and the input headings fade as complete lines while their objects retain size and position. The decoded f651/f652 gap has no lettering. The object is still full size at f653; f660, f672, f688 and f690 show pure graphic material, with no partial word or returned stroke. Former Message ink-region analysis finds zero dark pixels at f651–653; the visible f645 control contains real glyph ink. See transition-contact.jpg and transition-encoded-report.json.
- **Formal reading text: passed at selected states.** Author, assignment, course, studio, services, scope, proposed prices, hour cap, promises and CTA retain complete letter bottoms during their landed/hold stages. Entry masks briefly crop words during deliberate arrival. Measured font-ink comparison passes all 13 final-MP4 crops with the declared 2.5-pixel antialias/codec tolerance.
- **Continuity: passed in inspected sequences.** Messages retire before their rectangles gather into material blocks; one campaign creates two cutdowns and three graphics; the same assets enter the calendar and queue; the filename retires before the window folds into the final underline. No unexpected state reset or residual lettering was found in those decoded strips.
- **Monthly entry: corrected after first export.** The first inspection found a moving main video briefly crossing the service explanation. Material now reaches the right column before the explanation enters. Final encoded f1395, f1404 and f1413 confirm clear separation. Brief checkbox and rule rows were also aligned to their associated copy before this final render.
- **Content: preserved.** config.js is byte-identical to V4. Quick Edit remains one delivered video/ratio/revision; Campaign shows exactly 1 main +2 cutdowns +3 graphics; Monthly remains capped at 20 hours. Proposed prices remain €200/project, €500/pack, €900/month.
- **Final hold: passed.** The last 90 live-canvas frames are identical. All encoded final frames decode; downsampled maximum RMS difference is 0.03846 due to codec noise. Brand and CTA are fixed for the full final three seconds.

## Technical and playback verification

Full decoding passes all 2,250 frames: exactly 75.000 seconds, 1920×1080, 30 fps, H.264/AAC, Rec.709. No blank/flat frames were detected. Dark export-window frames retain visible geometry and outlines, rather than empty backgrounds.

Native watch.html playback and seeking to the final card pass through the supplied HTTP server. Direct file:// navigation cannot be verified in this environment because its Chromium administrator policy blocks local HTML navigation; this limitation is recorded in watch-qa.json. The full MP4 can also be opened directly in a video player. The editable canvas player, scrubber and configuration editor pass their separate checks.

Audio is original instrumental synthesis and action effects only, with no speech or vocals. The new action cues are aligned to the V5 frame schedule. Actual WAV checks confirm 75 seconds, 48 kHz stereo, −15.50 LUFS integrated and −4.23 dBTP, with a natural final release. See audio-validation.json and assets/beat-map.json.
