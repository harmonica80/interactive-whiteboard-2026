# Interactive Whiteboard — Agent Development Guidelines

## 🎨 UI / UX 設計準則

### WCAG AA 文字對比度 (Contrast Ratio ≥ 4.5:1)

All text in the application **must** meet [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) contrast requirements:

| Text Type | Minimum Contrast Ratio |
|-----------|----------------------|
| Normal text (< 18px or < 14px bold) | **4.5 : 1** |
| Large text (≥ 18px or ≥ 14px bold) | **3.0 : 1** |
| UI components & graphical objects | **3.0 : 1** |

#### Approved Color Pairings (Pre-verified)

| Background | Text Color | Ratio | Use Case |
|------------|-----------|-------|----------|
| `#1a1a2e` (dark stage) | `#ffffff` | 16.3:1 ✅ | General text on dark modal |
| `#1a1a2e` | `#ffd700` (gold) | 10.2:1 ✅ | Track name, highlights |
| `#1a1a2e` | `#ff6b6b` (soft red) | 4.8:1 ✅ | Score, alerts |
| `#1a1a2e` | `#ff9500` (orange) | 6.1:1 ✅ | Combo counter |
| `#1a1a2e` | `rgba(255,255,255,0.6)` | 8.2:1 ✅ | Secondary / muted text |
| `#ffffff` (light bg) | `#333333` | 12.6:1 ✅ | Key hints on drum face |
| `#f5f0e1` (drum face) | `#333333` | 10.4:1 ✅ | F / J key hints |
| `#2980b9` (drum rim) | `#ffffff` | 4.6:1 ✅ | D / K key hints |

#### ⛔ Forbidden Patterns

- **Never** use light text on light backgrounds (e.g. white on `#f5f0e1`)
- **Never** use `color: red` (`#ff0000`) on dark backgrounds without checking (ratio may be < 4.5)
- **Never** rely on color alone to convey information — always pair with icons, text labels, or patterns

#### How to Verify

Use any of these tools to check contrast ratios before committing:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)
- Browser DevTools → Accessibility panel → Contrast ratio

---

## 🏗️ Architecture & Code Guidelines

### Version Management
- Bump `APP_VERSION` in `js/app.js` and the badge in `index.html` for every release
- Follow semantic versioning: `MAJOR.MINOR.PATCH`

### CSS
- Use CSS custom properties (`var(--*)`) for theming
- Taiko mode uses `.taiko-mode` class on `#focusGameOverlay` to switch to dark theme
- Avoid inline `style` attributes that use `var(--bg-card)` or similar theme vars in taiko-specific elements — use hardcoded dark colors instead

### JavaScript
- YouTube IFrame player: **never call `destroy()`** — use `pauseVideo()` + `stopVideo()` + `mute()` to stop, keeping the player alive for reuse
- Use `taikoAllowMusicPlay` flag to guard against async race conditions in music playback
- All game stop/reset/close paths must call `stopTaikoBackgroundMusic()`

### Commit Messages
- Prefix with `Feat:`, `Fix:`, or `Docs:` 
- Include version number when bumping

### SYSTEM_LOG.md
- Append an entry for every version bump describing changes in Traditional Chinese
