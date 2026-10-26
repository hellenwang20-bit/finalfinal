# Final Final Studio — Motion Study 02

这是重做动画方向的 **15 秒连续动态预览**，交付格式为 **1920 × 1080、30 fps、450 帧**。它演示“消息堆积 → 动态剪辑时间线 → 全屏运动样片 → 多比例 campaign 内容”的连续衔接。原 75 秒宣传片未被覆盖；这份预览不代表 75 秒重制已经完成。

## 运行与导出

需要 Node.js；导出还需要 Chromium 和 FFmpeg。

```sh
npm ci --cache /tmp/final-final-preview-cache
npm start
```

在浏览器打开服务器所提供的 `index.html`。如默认端口已经使用，可用 `PORT=8001 npm start`。播放器提供播放、声音开关、逐帧拖动、章节定位和配置编辑。

```sh
npm run render
npm run stills
```

导出文件为 `output/FinalFinalStudio-MotionPreview-v2.mp4`。`stills` 会生成包含转场中间状态的检查帧。

本环境已有 Chromium。新机器可运行 `npx playwright install chromium`，或通过 `CHROMIUM_PATH` 指定系统 Chromium 的路径。FFmpeg 需要位于 `PATH`。本地预览使用附带的支持 HTTP Range 的 Node 服务器，以便替换视频后正确定位帧。

## 连续动画结构

| 时间 | 动作 |
|---|---|
| 0–3 秒 | 六条消息按半秒节拍叠入，前后景有不同位移；QUICK / MORE / NOW 逐词滑动、缩放和改变字距 |
| 3–4 秒 | 同一组消息卡片压缩、移动，成为时间线上的六个素材块 |
| 4–6.5 秒 | 播放头前进；素材被裁切、吸附，字幕轨道出现；被选素材块继续放大至全屏 |
| 6.5–9.5 秒 | 同一段真实播放的 CGI 测试视频，通过移动分割线揭示未处理 source 与经过色彩、文字处理的 on-brand 版本 |
| 9.5–12 秒 | 全屏视频收缩成竖屏；同一帧素材延展为横版、方形、竖版三个持续运动的画框 |
| 12–15 秒 | 三个画幅组成 campaign 展示；ONE EDIT / EVERY FORMAT 逐词落下，视频继续播放 |

本预览保持炭黑 `#111111`、米白 `#F5F5F0` 和荧光绿 `#C5FF00`。主体文字与界面元素仍为可编辑的实时字体和矢量图形。

## 编辑入口

- `config.js`：文案、品牌颜色、媒体路径、主动作时间、画幅信息和源视频播放速率。
- `preview.js`：卡片与画框的几何关系、字词动画、遮罩、镜头层次、剪辑轨道和具体时间编排。部分几何动作的边界时间在此文件中定义；改变整段节奏时要与 `config.js` 一并调整。
- `index.html`：可运行预览播放器。JSON 面板仅修改当前页面预览；持久化时把配置保存回 `config.js`。
- `render.cjs`：确定性逐帧导出器，使用同一个构图与视频定位逻辑。
- `assets/beat-map.json`：音乐节拍与动作音效的明确标记，包含时间、帧号和事件名称。

源视频时钟为 `max(0, (预览时间 - 3) × 0.6)`，并限制在源片长度内。所有视频画框以及前后对比两侧都使用同一解码帧，因此对比期间镜头持续推进，不会重播另一条镜头。替换素材时可通过 `media.startAt` 和 `media.rate` 调整对应关系。

## 素材与音频状态

**没有收到客户产品原片、所提分镜文件或配音。** 画面中的 `assets/sample-motion.mp4` 是为测试创建的原创 CGI 视频：它有连续的物体与摄影机运动，不是静态图片，但也不是客户实拍或正式 campaign 成品。画面持续标注 **Concept work / Original CGI test** 和未提供客户产品素材。

正式替换需要：

1. 至少一段 **8–12 秒**、尽量无字幕和无背景音乐的产品原片；优先提供高分辨率横版，并保留竖版重构需要的主体空间。
2. 用户提到的分镜文件，确认正式 75 秒版本的镜头与文案顺序。
3. 如正式版本需要旁白，提供已确定的配音文件或旁白稿。当前预览没有语音，也未合成配音。

把视频放进 `assets/`，修改 `config.js` 的 `media.product`，并更新 `copy.concept`、`copy.missing` 等素材标签。之后重新检查画幅裁切、播放速度和声音时序。

`assets/preview-score.wav` 是本次制作的原创 **15 秒、120 BPM、48 kHz 双声道**音乐与音效混音。通知、裁切、吸附、转场和完成确认音均有对应事件标记。`assets/music.wav` 和 `assets/workflow-sfx.wav` 保留可替换分轨。主动作按半秒 / 15 帧网格编排；修改动作时间后也需要调整音轨和节拍标记。

可用 `python scripts/make_audio.py` 重新生成音轨，需要 NumPy。原创 CGI 的 Blender 生成源见 `scripts/create_sample.py`；原有 MP4 已随工程提供，运行和导出不必重新生成 CGI。

`Display.ttf` 和 `Mono.ttf` 是本地 DejaVu 字体，许可见 `assets/FONT-LICENSE.txt`。工程不依赖播放时的外部字体或素材请求。
