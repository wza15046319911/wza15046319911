# Study Pilot - exam practice platform

Study Pilot is a bilingual past-exam practice platform for university subjects. Students drill past papers under real constraints: weekly unlock schedules, timed sessions, and a single active device per account, enforced through Supabase Realtime.

The single-device session guard kicks a stale login within seconds over Realtime. Questions are embedded with bge-m3 for semantic search. Server actions with tagged caches and a mapper layer keep database shapes out of the UI, and English and Chinese locales have translation key parity enforced in CI.

The code is on GitHub at https://github.com/lewiswang0516/study-pilot.

[[ASK ZANE: why you built it, who uses it, the trickiest constraint to enforce]].
