Aptos web fonts: drop here, then add an @font-face block in
app/globals.css.

WHY
====
PRD §10 originally specified Inter (body) + Space Grotesk (display) +
JetBrains Mono. The operator-side directive on 2026-05-05 is "everything
in Aptos". Aptos is Microsoft's default Office font and is NOT
preinstalled on iPadOS. To make the meeting iPad render Aptos (rather
than fall back to Inter), the .woff2 files must be self-hosted here.

GET THE FONT FILES
====================
1. From a Windows machine with Office 365 installed:
   C:\Windows\Fonts\Aptos*.ttf
   Copy: Aptos.ttf, Aptos-Bold.ttf, Aptos-Italic.ttf,
         AptosDisplay.ttf, AptosDisplay-Bold.ttf,
         AptosMono.ttf

2. Convert each .ttf to .woff2 (smaller, faster):
   Use https://cloudconvert.com/ttf-to-woff2
   or `fonttools woff2.compress font.ttf` from a CLI

3. Drop the .woff2 files in this folder:
   public/fonts/Aptos.woff2
   public/fonts/Aptos-Bold.woff2
   public/fonts/AptosDisplay.woff2
   public/fonts/AptosDisplay-Bold.woff2
   public/fonts/AptosMono.woff2

4. Add to app/globals.css (uncomment the @font-face block at the top
   when you have the files in place).

LICENSE
========
Aptos is licensed under the SIL Open Font License (OFL) by Microsoft
(2023). Self-hosting on a private demo platform is permitted.
