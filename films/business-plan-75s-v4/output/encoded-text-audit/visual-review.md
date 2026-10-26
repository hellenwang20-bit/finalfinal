# Actual encoded text review

Reviewed the finished `FinalFinalStudio-BusinessPlan-75s-v4.mp4`, not only the live composition.

- Extracted 13 stable-reading text crops with FFmpeg and measured their visible ink against the fully loaded matching font's actual ascent/descent. All 13 passed with 0–2 px threshold/codec-edge difference; the old encoded video lost 7–8 px in affected samples.
- Actually viewed `decoded-crops-1.jpg`, `decoded-crops-2.jpg` and `decoded-crops-3.jpg` at inspection size.
- Actually viewed all six `output/encoded-review/text-states-*.jpg` pages: 43 major text blocks, each sampled during entry, at landing, during hold and before exit (172 samples / 140 unique decoded frames).
- Priority samples included Yiran Wang, Business Plan, Media Business & Enterprise, the introduction and ending wordmarks, Campaign Content Pack, Monthly Creative Support, all three prices, all three Proposed price labels and the CTA.

At the sampled settled/hold/before-exit states, letter bottoms, punctuation and descenders are complete. No remaining settled-text crop or major text overlap was found in these review images. Entry masks and the short filename-to-wordmark morph show deliberate temporary clipping while in motion, then resolve completely.

The 20 isolated glyph pixel regressions and 25 live stable-mask checks are separately recorded in `output/text-qa.json`. Those live tests do not substitute for the encoded-frame review above. This review covers the extracted states, not a claim that every moving frame was manually inspected.

Final revision recheck: after the intro/ending hand-off cleanup, all13encoded crops were regenerated and passed, and all six four-state sheets were re-extracted from the final MP4 and viewed again. The intro before-exit sample is5.567s; the new pain headline no longer overlaps the author. The filename now exits before the brand enters. Two dark file-window-only morph frames were separately viewed and remain intentional visible graphic content, not missing media.
