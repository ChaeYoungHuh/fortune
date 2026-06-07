# 🥠 KAIST Tag Fortune

> ID20012(A): Design Studio 1 — Industrial Design Department, KAIST

When you tap an NFC tag, a fortune cookie slip with today's fortune will unfold before you.

(The installation will be available at the entrance of the Industrial Design building starting June 5, 2026.)

## Concept

Every day, people tap their ID at the building entrance — hands busy, phone tucked away, eyes on the reader. That brief pause, right before the door opens, is one of the few moments where you're *not* looking at your screen.

I wondered: what if that gap could carry a small action instead of just waiting? So I built a **lucky reader** — a plastic mock-up shaped deliberately like a campus card reader — and hid an NFC tag inside. Bring your phone close, and the tag opens this site: a fortune slip unfolds before you walk in.

A gentle nudge at the threshold — between outside and inside, idle and moving.

<img width="460" height="571" alt="Lucky reader installation" src="https://github.com/user-attachments/assets/be826f90-27d8-42cb-8573-dc507fa2e217" />


## How does it work?

The moment you tap the tag, a new fortune is assigned to you, and it will remain the same even if you refresh the page.  
You must tap the tag again to receive a new fortune.

One line of fortune for today, and a lucky color.
Check yours out!

## Built with

- [Next.js](https://nextjs.org) + TypeScript
- [Upstash Redis](https://upstash.com) — visit tracking
- Deployed on [Vercel](https://vercel.com)
