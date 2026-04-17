# ADR 0002 — Apocrypha scope: full sweep

**Date:** 2026-04-16
**Status:** Accepted
**Decider:** Marcus Brown, executed in Cowork Session 1

## Context

The MannaFest corpus needs to serve users from Catholic, Eastern Orthodox, Oriental Orthodox, Anglican, Protestant, and Jewish backgrounds. The canonicity of deuterocanonical and apocryphal works differs across these traditions. Additionally, the intertestamental period (the "400 silent years" in Protestant framing) is critical background for New Testament theology that most English Bibles do not surface.

## Decision

The Ark will commission the full sweep of extracanonical Second Temple literature with three categories in the `apocrypha_works` table:

1. **deuterocanonical** — the Catholic/Orthodox canon additions beyond the Hebrew Bible (Tobit, Judith, Wisdom of Solomon, Sirach, Baruch, Letter of Jeremiah, 1-2 Maccabees, Additions to Daniel/Esther, 1 Esdras, 2 Esdras, Prayer of Manasseh)
2. **pseudepigrapha** — non-canonical Jewish works dating from roughly 300 BCE to 200 CE (1 Enoch, Jubilees, Assumption of Moses, Testaments of the Twelve Patriarchs, 4 Ezra, 2 Baruch, Psalms of Solomon, Letter of Aristeas)
3. **dead_sea_scrolls** — sectarian Qumran documents (Community Rule 1QS, War Scroll 1QM, Damascus Document, Habakkuk Pesher 1QpHab, Temple Scroll 11QT, Hodayot)

Each work entry includes: three-paragraph summary, full historical context, intertestamental significance, complete JSONB `canon_status` across (catholic, eastern_orthodox, oriental_orthodox, ethiopian_orthodox_tewahedo where relevant, eritrean_orthodox_tewahedo where relevant, anglican, protestant, jewish), populated theme/figure/related-book arrays, scholarly notes naming specific commentators.

Each work gets at least two `apocrypha_connections` rows linking to canonical Scripture via `graph_nodes.id` where resolvable; free-form text fallback otherwise.

The `intertestamental_period` table holds a handful of period-overview entries (Persian, Hellenistic-Ptolemaic, Hellenistic-Seleucid, Maccabean Revolt, Hasmonean Dynasty, Roman Conquest, and a dedicated "400 Silent Years" theological framing entry) to give users historical scaffolding.

## Consequences

- Users across traditions can see why a work matters and where their own tradition places it canonically.
- New Testament references that assume extracanonical background (John 10:22 Hanukkah, Hebrews 11:35 Maccabean martyrs, Jude 14-15 quoting 1 Enoch) now have linked context.
- Respects canonical diversity without taking a confessional position.
- Requires ongoing curation as new manuscript discoveries and scholarly consensus evolve.

## Status as of Cowork Session 1 (2026-04-16)

Inserted: 27 `apocrypha_works` (12 deuterocanonical, 9 pseudepigrapha, 6 dead_sea_scrolls), 51 `apocrypha_connections`, 7 `intertestamental_period` entries. Coverage spans the major works for each tradition.
