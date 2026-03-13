# PompCore Logo Generation Prompt

> AI 이미지 생성 도구에 입력하기 위한 체계적 로고 제작 프롬프트 문서
>
> 최종 업데이트: 2026-03-13

---

## 1. 브랜드 컨텍스트

### 1.1 PompCore란?

PompCore는 **서브컬쳐 오픈월드 RPG 게임 감성**을 일상 도구에 접목한 **통합 생활 플랫폼**이다. 슬로건은 **"일상을 플레이하다 — Play Your Day"**. 사용자가 자신의 삶을 하나의 게임처럼 능동적으로 플레이할 수 있도록 가계부, 일정관리, 자기관리, 교육 등 생활 필수 도구를 제공한다.

### 1.2 디자인 영감

- **원신 (Genshin Impact)**: 우아한 판타지 타이포, 원소별 컬러 시스템
- **명일방주 (Arknights)**: 미니멀하면서도 강렬한 로고 타이포그래피
- **블루아카이브 (Blue Archive)**: 밝고 경쾌한 컬러 + 깔끔한 서체 조합
- **호요버스 (HoYoverse)**: 통합 브랜드 아래 서비스별 고유 아이덴티티

### 1.3 디자인 시스템: Nebula (성운)

- **다크 모드 기본**: 딥 다크 배경(`#0C0818`) 위에 네온 글로우 효과
- **라이트 모드**: 푸른 하늘 그라디언트 + 구름
- **글래스모피즘**: 반투명 카드, 블러 효과
- **별/성운 파티클**: 배경 장식 요소

---

## 2. 전체 로고 시스템 규칙

### 2.1 로고 형태

모든 서비스 로고는 **타이포그래피 기반 워드마크** 스타일로 통일한다.

| 항목 | 규칙 |
|------|------|
| **형태** | 타이포그래피 워드마크 (아이콘 없음, 커스텀 레터링 중심) |
| **세트** | 서비스당 2벌: 풀 워드마크 + 컴팩트(이니셜) |
| **배경** | 투명 배경 (transparent) |
| **제작 방식** | 텍스트를 타이핑하지 않고 각 글자를 직접 그린 벡터 레터링으로 설계 |
| **포맷** | 순수 벡터 SVG (`path`/`shape` 중심, 래스터/PNG 임베드 금지) |
| **크기** | 워드마크: 가로 400×120 기준 / 컴팩트: 64×64 기준 |

### 2.2 타이포그래피 원칙

| 항목 | 규칙 |
|------|------|
| **주 서체 분위기** | 판타지 RPG 감성 — 세리프 또는 세미세리프 (Cinzel, Cinzel Decorative 참고) |
| **보조 서체 분위기** | 서브네임용 — 깔끔한 산세리프 (Nunito, Pretendard 참고) |
| **굵기** | 서비스명: Bold~Black / 서브네임: Medium~SemiBold |
| **간격** | 자간(letter-spacing) 넓게 — 고급스럽고 여유로운 느낌 |
| **장식** | 서비스별 RPG 모티프를 글자 일부에 미세하게 반영 (과하지 않게) |
| **출력 규칙** | 최종 SVG에서 모든 글자는 라이브 텍스트가 아니라 윤곽선(outline) 또는 path로 존재해야 함 |

### 2.3 텍스트 사용 금지 규칙

최종 로고 파일에서는 일반 텍스트 객체를 사용하지 않는다. 생성 결과는 **"폰트를 적용한 텍스트"**가 아니라 **"직접 그린 레터링"**이어야 한다.

필수 규칙:
- SVG `text`, `tspan`, `textPath`, `foreignObject` 사용 금지
- 웹폰트/시스템 폰트 참조 금지
- 메인 워드마크와 서브네임 모두 path 또는 outline 기반으로 변환
- 글자 비례와 장식은 커스텀 제작하되, 가독성은 유지

### 2.4 글자 장식 가이드라인

각 서비스의 RPG 모티프를 글자에 **미세하게** 녹여넣되, 가독성을 해치지 않아야 한다.

장식 허용 범위:
- 특정 글자의 세리프/획 끝 변형 (예: 검 날처럼 뾰족하게, 불꽃처럼 갈라지게)
- 글자 위/아래 미세한 장식선 또는 언더라인 변형
- 글자 내부 또는 주변의 미세한 글로우/그라디언트 효과
- 이니셜 첫 글자에 약간의 장식적 변형

장식 금지 범위:
- 글자 위에 별도 아이콘을 얹는 것
- 글자를 알아볼 수 없을 정도의 과도한 변형
- 3D 효과, 그림자 과다, 엠보싱
- 사진/비트맵 텍스처

### 2.5 컬러 적용 규칙

| 용도 | 다크 모드 | 라이트 모드 |
|------|-----------|-------------|
| **서비스명 텍스트** | Light 컬러 | Primary 컬러 |
| **서브네임 텍스트** | Primary 컬러 50% 불투명도 | Deep 컬러 60% 불투명도 |
| **글로우 효과** | Primary 컬러 (blur 8~12px) | 없음 |
| **단색 버전** | 화이트 (#FFFFFF) | 다크네이비 (#2B3442) |

---

## 3. 서비스별 상세 프롬프트

---

### 3.1 PompCore (메인 플랫폼)

#### 기본 정보

| 항목 | 값 |
|------|-----|
| **서비스명** | PompCore |
| **서브네임** | 일상을 플레이하다 |
| **영문 서브네임** | Play Your Day |
| **컬러 Primary** | `#7C3AED` (Violet) |
| **컬러 Light** | `#A855F7` |
| **컬러 Deep** | `#6D28D9` |
| **모티프** | 성운(Nebula), 마법 에너지, 마나의 흐름 |

#### 워드마크 프롬프트

```
Create a typographic wordmark logo for "PompCore".

Style: Fantasy RPG game-inspired typography. Think Genshin Impact title aesthetics
meets modern tech branding. Elegant serif or semi-serif typeface with wide letter-spacing.
Draw every visible letter as bespoke vector lettering, not editable text objects or font-based text.

Color: Gradient from #7C3AED (violet) to #A855F7 (light purple), flowing left to right.

Typographic details:
- "Pomp" and "Core" should feel like one unified word but with subtle weight difference
  — "Pomp" slightly heavier, "Core" slightly lighter
- The letter "P" should have a subtle decorative flourish reminiscent of magical energy/nebula swirl
- Letter terminals (ends of strokes) should have soft, slightly pointed serif-like finishes
  — not sharp/aggressive, but elegant and mystical
- Subtle glow effect around the text (violet, soft, 8px blur) for dark background version

Below the main wordmark, render the sub-name "일상을 플레이하다" as custom outlined sans-serif lettering
(Pretendard-inspired, but not typed live text), medium weight, #A855F7 at 50% opacity,
letter-spacing slightly wider than normal.

Layout: Horizontal wordmark. Total aspect ratio approximately 400:120.
Background: Transparent.
Format: Pure vector SVG paths only. No embedded images, no raster elements, no SVG text nodes.

Mood: Mystical, premium, cosmic — like a portal to another world.
```

#### 컴팩트(이니셜) 프롬프트

```
Create a compact typographic logo using the letter "P" for "PompCore".

Style: The same fantasy RPG serif style as the full wordmark. The "P" should be
decorative but recognizable — think of an illuminated manuscript initial letter
crossed with modern game UI.
The letter must be custom drawn as a vector glyph, not a typed font character.

Color: #7C3AED to #A855F7 gradient (top to bottom).

Details:
- The bowl of "P" could have a subtle nebula/cosmic swirl integration
- Elegant serif terminals
- The letter should feel self-contained and work at 32px and 192px sizes
- Subtle outer glow for dark mode version

Size: Square, 64×64 base grid.
Background: Transparent.
Format: Pure vector SVG paths. No embedded images, no live text.
```

---

### 3.2 Vault (가계부)

#### 기본 정보

| 항목 | 값 |
|------|-----|
| **서비스명** | Vault |
| **서브네임** | 모험가의 금고 |
| **영문 서브네임** | Adventurer's Vault |
| **컬러 Primary** | `#10B981` (Emerald) |
| **컬러 Light** | `#06D6A0` |
| **컬러 Deep** | `#059669` |
| **모티프** | 보물, 에메랄드 보석, 금고의 자물쇠, 재화 수호 |

#### 워드마크 프롬프트

```
Create a typographic wordmark logo for "Vault".

Style: Fantasy RPG game-inspired typography with a treasure/vault motif.
Imagine the nameplate on an ancient treasure vault in a fantasy RPG world.
Serif or semi-serif typeface, bold, with wide letter-spacing.
Render the whole mark as custom vector lettering rather than typed text.

Color: Gradient from #10B981 (emerald) to #06D6A0 (teal), left to right.

Typographic details:
- The letter "V" should be the hero letter — its strokes could subtly
  reference a keyhole shape or the facets of a cut gemstone
- The "a" could have a slightly rounded, coin-like quality to its bowl
- Letter terminals should feel sturdy and secure — like forged metal
- The overall feel should be "precious but strong" — guarding wealth
- All letters should maintain clear legibility despite decorative touches

Below the wordmark: render "모험가의 금고" as custom outlined sans-serif lettering,
medium weight, #10B981 at 50% opacity, slightly wider letter-spacing.

Layout: Horizontal. Aspect ratio approximately 400:120.
Background: Transparent.
Format: Pure vector SVG paths only. No SVG text nodes.

Mood: Secure, precious, adventurous — like opening a chest of emeralds.
```

#### 컴팩트(이니셜) 프롬프트

```
Create a compact typographic logo using the letter "V" for "Vault".

Style: Fantasy RPG serif, matching the full wordmark. The "V" should subtly
evoke a keyhole or gemstone facet shape while remaining clearly the letter V.
The letter must be hand-drawn as vector lettering, not typed text.

Color: #10B981 to #06D6A0 gradient (top to bottom).

Details:
- The two strokes of "V" could taper like the edges of a cut gem
- Serif terminals should feel metallic and sturdy
- Subtle emerald glow for dark mode
- Must work at 32px minimum

Size: Square, 64×64 base grid.
Background: Transparent.
Format: Pure vector SVG paths. No live text.
```

---

### 3.3 Quest (일정관리)

#### 기본 정보

| 항목 | 값 |
|------|-----|
| **서비스명** | Quest |
| **서브네임** | 일상이 곧 모험 |
| **영문 서브네임** | Life is Adventure |
| **컬러 Primary** | `#3B82F6` (Blue) |
| **컬러 Light** | `#06B6D4` (Cyan) |
| **컬러 Deep** | `#2563EB` |
| **모티프** | 하늘, 나침반, 모험의 지평선, 퀘스트 스크롤 |

#### 워드마크 프롬프트

```
Create a typographic wordmark logo for "Quest".

Style: Fantasy RPG game-inspired typography with an adventure/exploration motif.
Think of the quest log title in an open-world RPG. Dynamic yet legible serif
or semi-serif typeface with wide letter-spacing.
Build the entire wordmark as bespoke vector lettering, not editable text objects.

Color: Gradient from #3B82F6 (blue) to #06B6D4 (cyan), left to right.

Typographic details:
- The letter "Q" is the hero letter — its tail could extend into a subtle
  compass needle or directional arrow pointing forward/upward
- The "t" at the end could have a crossbar that subtly references a sword hilt
  or compass cross
- Letters should feel dynamic and forward-leaning (not italic, but energetic)
- Stroke endings should feel sharp and decisive — like cutting through wind
- The overall typography should convey motion and discovery

Below the wordmark: render "일상이 곧 모험" as custom outlined sans-serif lettering,
medium weight, #3B82F6 at 50% opacity, slightly wider letter-spacing.

Layout: Horizontal. Aspect ratio approximately 400:120.
Background: Transparent.
Format: Pure vector SVG paths only. No SVG text nodes.

Mood: Adventurous, dynamic, hopeful — like standing at the edge of a vast world.
```

#### 컴팩트(이니셜) 프롬프트

```
Create a compact typographic logo using the letter "Q" for "Quest".

Style: Fantasy RPG serif matching the full wordmark. The "Q" should be
bold with its tail extending into a subtle compass needle or arrow motif.
The letter must be drawn as a custom vector glyph, not typed from a font.

Color: #3B82F6 to #06B6D4 gradient (top to bottom).

Details:
- The tail of Q is the key decorative element — a directional/compass reference
- The circular body should feel like a compass rose or globe
- Clean enough to work at 32px
- Subtle blue glow for dark mode

Size: Square, 64×64 base grid.
Background: Transparent.
Format: Pure vector SVG paths. No live text.
```

---

### 3.4 Forge (자기관리)

#### 기본 정보

| 항목 | 값 |
|------|-----|
| **서비스명** | Forge |
| **서브네임** | 의지의 대장간 |
| **영문 서브네임** | Forge of Will |
| **컬러 Primary** | `#F97316` (Orange) |
| **컬러 Light** | `#FB923C` |
| **컬러 Deep** | `#EA580C` |
| **모티프** | 불꽃, 모루, 망치, 용광로의 열기, 단련 |

#### 워드마크 프롬프트

```
Create a typographic wordmark logo for "Forge".

Style: Fantasy RPG game-inspired typography with a blacksmith/forge motif.
Imagine the sign above a master blacksmith's workshop in a fantasy world.
Bold, heavy serif or slab-serif typeface with strong presence and wide letter-spacing.
Construct the mark as custom vector lettering, not as editable text.

Color: Gradient from #F97316 (orange) to #FB923C (light orange), left to right.
The gradient should feel like heated metal — from deep orange to glowing amber.

Typographic details:
- The letter "F" should be the hero letter — its horizontal strokes could
  subtly taper like a hammer's edge or an anvil's surface
- Strokes should feel heavy, solid, and forged — like hammered metal
- Letter terminals should have a slightly rough, chiseled quality
  (not smooth curves, but deliberate angular finishes)
- The "o" could have a subtle inner glow suggesting a furnace opening
- The overall feel should be powerful and purposeful — strength through effort

Below the wordmark: render "의지의 대장간" as custom outlined sans-serif lettering,
medium weight, #F97316 at 50% opacity, slightly wider letter-spacing.

Layout: Horizontal. Aspect ratio approximately 400:120.
Background: Transparent.
Format: Pure vector SVG paths only. No SVG text nodes.

Mood: Powerful, determined, fiery — like steel being tempered in flame.
```

#### 컴팩트(이니셜) 프롬프트

```
Create a compact typographic logo using the letter "F" for "Forge".

Style: Fantasy RPG heavy serif/slab-serif matching the full wordmark.
The "F" should feel like it was forged from metal — strong, angular, bold.
The letter must be hand-drawn as vector lettering, not typed text.

Color: #F97316 to #FB923C gradient (top to bottom), like heated metal.

Details:
- Horizontal strokes of F could reference an anvil or hammer shape
- Terminals should be angular and chiseled, not rounded
- Should convey strength and weight
- Subtle orange/ember glow for dark mode
- Must work at 32px minimum

Size: Square, 64×64 base grid.
Background: Transparent.
Format: Pure vector SVG paths. No live text.
```

---

### 3.5 Academy (교육)

#### 기본 정보

| 항목 | 값 |
|------|-----|
| **서비스명** | Academy |
| **서브네임** | 지식의 길드홀 |
| **영문 서브네임** | Guild Hall of Knowledge |
| **컬러 Primary** | `#FBBF24` (Amber) |
| **컬러 Light** | `#FCD34D` |
| **컬러 Deep** | `#F59E0B` |
| **모티프** | 마법서, 양피지 두루마리, 지팡이, 고대의 지혜 |

#### 워드마크 프롬프트

```
Create a typographic wordmark logo for "Academy".

Style: Fantasy RPG game-inspired typography with a magical knowledge/guild motif.
Think of the inscription above a wizard's academy or mage guild entrance.
Elegant, scholarly serif typeface — more refined than Forge's heavy style.
Wide letter-spacing with a sense of ancient wisdom.
Render all visible letters as custom vector lettering, not editable text objects.

Color: Gradient from #FBBF24 (amber) to #FCD34D (gold), left to right.
The gradient should feel like golden ink on parchment.

Typographic details:
- The letter "A" (first) should be the hero letter — it could have a subtle
  decorative peak reminiscent of a wizard's hat tip or a quill nib
- The overall typeface should feel like elegant calligraphy carved into stone
  — scholarly but with magical flourishes
- Letter terminals should curve gracefully, like the ends of scroll decorations
- The "y" at the end could have a descender that subtly curves like a scroll unfurling
- The feel should be wise, learned, and magical — knowledge as power

Below the wordmark: render "지식의 길드홀" as custom outlined sans-serif lettering,
medium weight, #FBBF24 at 50% opacity, slightly wider letter-spacing.

Layout: Horizontal. Aspect ratio approximately 400:120.
Background: Transparent.
Format: Pure vector SVG paths only. No SVG text nodes.

Mood: Wise, scholarly, magical — like entering an ancient library of arcane knowledge.
```

#### 컴팩트(이니셜) 프롬프트

```
Create a compact typographic logo using the letter "A" for "Academy".

Style: Fantasy RPG elegant serif matching the full wordmark. The "A" should
feel scholarly and magical — like an illuminated manuscript capital letter.
The letter must be custom drawn as a vector glyph, not typed from a font.

Color: #FBBF24 to #FCD34D gradient (top to bottom), golden ink effect.

Details:
- The apex of "A" could subtly reference a quill tip or wizard hat point
- Serifs should be elegant and calligraphic, not blocky
- The crossbar could have a subtle scroll-like curve
- Amber glow for dark mode
- Must work at 32px minimum

Size: Square, 64×64 base grid.
Background: Transparent.
Format: Pure vector SVG paths. No live text.
```

---

## 4. 일괄 생성용 통합 프롬프트

아래는 전체 로고 시스템의 일관성을 위해, 5개 서비스를 한꺼번에 지시할 때 사용하는 통합 프롬프트이다.

```
Design a cohesive typographic logo system for "PompCore", a lifestyle platform
inspired by open-world RPG games (Genshin Impact, Arknights, Blue Archive aesthetic).

The platform tagline is "Play Your Day" (일상을 플레이하다).
Each service has a unique RPG-world identity, but all logos must feel like
they belong to the same universe.

=== GLOBAL RULES ===

- Style: Fantasy RPG-inspired serif/semi-serif typography (Cinzel-like base)
- Format: Pure vector SVG, transparent background
- No icons, no emblems — typography only with subtle motif integrations
- No live text objects, no font references, no SVG `text`/`tspan`; every letter must be drawn as vector paths
- Wide letter-spacing, premium feel
- Each logo needs: full wordmark (400×120) + compact initial (64×64)
- Sub-names in clean sans-serif below the wordmark, 50% opacity of primary color, also outlined as vector lettering
- Dark mode version: light color variant + subtle outer glow
- Light mode version: primary color, no glow
- Mono version: white (#FFFFFF) or dark navy (#2B3442)

=== SERVICES ===

1. PompCore — "일상을 플레이하다"
   Color: #7C3AED → #A855F7 (Violet)
   Motif: Nebula, magical energy, cosmic mana flow
   Hero letter: P — subtle mystical flourish on the bowl
   Mood: Mystical, premium, cosmic

2. Vault — "모험가의 금고"
   Color: #10B981 → #06D6A0 (Emerald)
   Motif: Treasure, gemstone facets, vault keyhole, guarded wealth
   Hero letter: V — strokes like cut gem edges or keyhole reference
   Mood: Secure, precious, adventurous

3. Quest — "일상이 곧 모험"
   Color: #3B82F6 → #06B6D4 (Blue → Cyan)
   Motif: Compass, horizon, exploration, adventure scroll
   Hero letter: Q — tail extends into compass needle/directional arrow
   Mood: Adventurous, dynamic, hopeful

4. Forge — "의지의 대장간"
   Color: #F97316 → #FB923C (Orange)
   Motif: Flame, anvil, hammer, furnace heat, tempering
   Hero letter: F — horizontal strokes like hammer edges, angular chiseled terminals
   Mood: Powerful, determined, fiery

5. Academy — "지식의 길드홀"
   Color: #FBBF24 → #FCD34D (Amber → Gold)
   Motif: Spellbook, parchment scroll, quill, ancient wisdom
   Hero letter: A — apex like quill nib or wizard hat, calligraphic serifs
   Mood: Wise, scholarly, magical

=== CONSISTENCY CHECK ===

All five logos should:
- Share the same base serif skeleton (weight and proportions may vary per service)
- Use the same letter-spacing ratio
- Have sub-names at the same relative size and position
- Feel like chapter titles from the same RPG game world
- Work together on a single brand page without visual conflict
```

---

## 5. 파일 네이밍 규칙

생성된 로고 파일은 다음 규칙으로 저장한다.

### 5.1 소스 파일 (개발용)

```
apps/web/src/assets/logos/
├── pompcore.svg          # PompCore 워드마크
├── pompcorelogo.svg      # PompCore 컴팩트 (P)
├── vault.svg             # Vault 워드마크
├── vaultlogo.svg         # Vault 컴팩트 (V)
├── quest.svg             # Quest 워드마크
├── questlogo.svg         # Quest 컴팩트 (Q)
├── forge.svg             # Forge 워드마크
├── forgelogo.svg         # Forge 컴팩트 (F)
├── academy.svg           # Academy 워드마크
└── academylogo.svg       # Academy 컴팩트 (A)
```

### 5.2 퍼블릭 파일 (파비콘/OG)

```
apps/{service}/public/
├── favicon.svg           # 컴팩트 로고 기반 파비콘
├── icon.svg              # 앱 아이콘 (컴팩트 확대)
└── logo.svg              # 워드마크 (OG 이미지 등)
```

### 5.3 단색 버전

```
apps/web/src/assets/logos/mono/
├── pompcore-white.svg
├── pompcore-dark.svg
├── vault-white.svg
├── vault-dark.svg
└── ... (동일 패턴)
```

---

## 6. 품질 체크리스트

로고를 받았을 때 아래 항목을 확인한다.

- [ ] 순수 벡터 SVG인가? (base64 이미지 임베드 없음)
- [ ] SVG `text` / `tspan` / 폰트 참조 없이 모든 글자가 path 또는 outline으로 구성되어 있는가?
- [ ] 투명 배경인가?
- [ ] 32px에서도 이니셜이 식별 가능한가?
- [ ] 400px 워드마크에서 서브네임이 읽히는가?
- [ ] 다크 배경(`#0C0818`)에서 잘 보이는가?
- [ ] 라이트 배경(`#F0F4FF`)에서 잘 보이는가?
- [ ] 5개 로고를 나란히 놓았을 때 같은 세계관으로 느껴지는가?
- [ ] 서비스별 모티프가 글자에 미세하게 녹아있는가?
- [ ] 지정된 컬러 HEX와 정확히 일치하는가?
- [ ] 가독성을 해치는 과도한 장식이 없는가?

---

*이 문서는 AI 이미지 생성 도구에 입력하여 PompCore 로고 시스템을 제작하기 위한 프롬프트 문서입니다.*
