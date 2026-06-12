# KAIST *Tag Fortune*

> ID20012(A) · Design Studio 1 · Industrial Design, KAIST · 2026

**What if a card reader told your fortune?**

→ **[View project page (best on PC)](https://chaeyounghuh.github.io/fortune/)**
→ **[Try the fortune site](https://fortune-lemon.vercel.app/)**

---

<img src="docs/IMG_5288.jpg" width="480" alt="Installation at ID building entrance" />

---

## Concept

Every day, students tap their phone to enter the ID building — hands up, eyes on the reader, for just a moment not looking at a screen.

That brief pause became the interaction point. I built a **fake NFC card reader** — same shape, same placement, different outcome. Tap your phone, and instead of a door beep you get a fortune cookie slip: one line of fortune, a lucky color, just for today.

The goal was zero friction. The tap was already happening. I just gave it somewhere new to land.

---

## Prototype

<table>
<tr>
<td><img src="docs/proto.png" width="220" alt="Prototype object" /></td>
<td><img src="docs/lacker.png" width="220" alt="Lacquer painting process" /></td>
</tr>
<tr>
<td align="center"><sub>Final prototype</sub></td>
<td align="center"><sub>Painting with black lacquer</sub></td>
</tr>
</table>

Started with a gold bar concept → tested yellow → switched to **black lacquer** to match the real scanner aesthetic. The text "CARD" was replaced with "LUCKY," and the red label reworked into a four-leaf clover.

---

## The Fortune Site

<table>
<tr>
<td><img src="docs/fortune_popup.gif" width="240" alt="Fortune site UI" /></td>
<td><img src="docs/fortune_list.png" width="240" alt="Fortune list" /></td>
<td><img src="docs/redus.png" width="240" alt="Redis visit stats" /></td>
</tr>
<tr>
<td align="center"><sub>Fortune cookie slip UI</sub></td>
<td align="center"><sub>Fortune list</sub></td>
<td align="center"><sub>Visit tracking via Redis</sub></td>
</tr>
</table>

Each NFC tag holds a **unique token** — same tap always shows the same fortune, new tap reveals a new one. Refreshing doesn't change it. Visit counts are tracked via Upstash Redis to measure reach.

---

## Installation

<table>
<tr>
<td><img src="docs/interact_1.gif" width="300" alt="Phase 1 — entrance" /></td>
<td><img src="docs/IMG_5291.jpg" width="300" alt="Phase 2 — elevator" /></td>
</tr>
<tr>
<td align="center"><sub>Phase 1 · Beside the entrance (6/4–6/8)</sub></td>
<td align="center"><sub>Phase 2 · Elevator button panel (6/8–6/11)</sub></td>
</tr>
</table>

| | Phase 1 | Phase 2 |
|---|---|---|
| **Location** | ID building entrance | Elevator button panel |
| **Period** | Jun 4 – Jun 8 | Jun 8 – Jun 11 |
| **Taps** | 35 | 25 |

**60 taps total over 8 days.** More than expected — the barrier was already near zero since the motion (phone to reader) was part of the existing routine.

---

## Built with

- [Next.js](https://nextjs.org) + TypeScript
- [Upstash Redis](https://upstash.com) — visit tracking via NX flag
- Deployed on [Vercel](https://vercel.com)

---

<sub>by <a href="https://cyhuh.com">cyhuh.com</a></sub>
