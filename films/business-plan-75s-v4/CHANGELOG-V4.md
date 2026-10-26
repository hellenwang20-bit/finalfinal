# Typography, design and motion revision

The existing principal copy, proposed prices, chapter timing, total75-second duration and no-voiceover soundtrack are preserved.

## Actual defect

The old Canvas word animation used a fixed rectangle with bottom `baseline +0.24×size−8`. This omitted roughly6–7px of loaded-font descenders. At29px it even stopped above the baseline. Encoded old-video crops confirmed7–8missing bright-pixel rows after antialiasing/codec thresholding. This was not a CSS overflow issue or an unverified font-loading guess.

## Repair

- Load Display, Body and Mono before measurement or the first rendered frame.
- Separate measured final text layout from the temporary entry mask.
- Include real ink ascent, descent, overhangs and padding in layout bounds.
- Remove entry clipping once the word settles; keep legitimate card/video/document masks.
- Correct cumulative multiline staggering and measured caption baselines.
- Keep headline/service sizes; improve the price/regular-small-print hierarchy.

## Design and motion

Unified grid, restrained frame strokes and clear price hierarchy; no unmotivated idle floats. Quick Edit retains its trim/refine focus, Campaign builds one coherent1+2+3body of work, and Monthly pairs those exact assets into scheduled queues. Scene transitions retain measured geometry and continuous camera pose. The author exits before the next headline enters; the renamed file becomes the final underline/wordmark through clean masks rather than overlapping letter scrambling.

## Inspection evidence

Live checks:20pixel-identical descender regressions,25stable-frame active-mask audits, scope/player checks and90identical final-card frames.

Encoded-video checks:13 measured title/price/name/course/CTA crops plus four-state extraction for43text blocks (172samples,140distinct decoded frames). Contact images and machine-readable reports live under output/. This is sampled visual inspection of the final MP4, not a claim that every moving frame was manually inspected. Full media decoding separately checks all2,250frames.
