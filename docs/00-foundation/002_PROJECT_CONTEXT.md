# 002_PROJECT_CONTEXT.md

> **Document:** Project Context
>
> **Document ID:** 002
>
> **Version:** 1.0.0
>
> **Status:** Living Document (Foundational)
>
> **Owner:** Project Architect
>
> **Audience:** Human + AI Contributors
>
> **Last Updated:** 2026-07-18

---

# Purpose

This document is the architectural and philosophical foundation of Explorer Academy.

It provides the context required for every future design decision, implementation task and campaign.

If the Project Manifest explains **how the repository is organised**, this document explains **why Explorer Academy exists and what it is trying to achieve**.

Every contributor should understand this document before modifying any part of the project.

---

# Project Summary

Explorer Academy is a long-term educational platform designed to develop curious, independent learners through immersive adventures.

The platform hides formal education behind meaningful exploration.

Children experience stories, investigations, engineering challenges and scientific discoveries.

Parents experience a simple system that requires minimal preparation.

Educators see rigorous curriculum coverage.

Developers work with a reusable platform rather than one-off educational content.

---

# The Problem

Many educational platforms optimise for:

- lesson completion
- screen time
- gamification
- rewards
- curriculum coverage

Explorer Academy instead optimises for:

- curiosity
- exploration
- reasoning
- observation
- independence
- intrinsic motivation

The learner should never feel they are completing schoolwork.

---

# North Star

Explorer Academy exists to help children become the type of people who:

- notice
- wonder
- investigate
- experiment
- communicate
- create
- revise their thinking when evidence changes

Knowledge matters.

Thinking matters more.

---

# Vision

Create a reusable educational platform where new campaigns can be added without rebuilding the software.

Campaigns become content.

The platform becomes the engine.

---

# Long-Term Goal

A learner who completes multiple Explorer Academy campaigns should become noticeably more curious, confident and capable—not merely more knowledgeable.

Success is measured by habits of mind rather than memorised facts.

---

# Core Design Principles

Every decision should support these principles.

1. Adventure before education.
2. Curiosity before curriculum.
3. Discovery before instruction.
4. Independence before intervention.
5. Questions before answers.
6. Systems before one-off solutions.
7. Documentation before implementation.

---

# Educational Philosophy

Explorer Academy is built on the belief that children learn most effectively when they:

- solve authentic problems
- ask their own questions
- test ideas
- make mistakes safely
- explain their reasoning
- connect ideas across subjects

Curriculum is important.

It should never dominate the learner's experience.

---

# Product Philosophy

Explorer Academy is not a collection of lessons.

It is a platform for adventures.

Every campaign should feel different.

The underlying architecture should remain largely unchanged.

---

# Target Learner

The initial learner profile is:

- Primary 5 (approximately age 9–10)
- Comfortable independent reader
- Enjoys STEM
- Curious about space and science
- Prefers non-fiction
- Happy working independently for around 60 minutes
- Enjoys drawing, experiments and problem-solving

The platform should remain adaptable to a broader audience over time.

---

# Parent Experience

Parents are not expected to become teachers.

Instead, they act as Mission Control.

The platform should:

- minimise preparation
- minimise printing
- minimise explanations
- minimise supervision

Parents primarily support logistics, encouragement and discussion.

---

# Learning Experience

The learner should feel they are:

- exploring
- investigating
- experimenting
- discovering
- recording observations
- solving mysteries

They should never feel they are progressing through a curriculum.

---

# Platform Vision

The platform should support:

- browser-based delivery
- offline use after initial load
- local progress saving
- optional printable workbook
- adaptive mission duration
- reusable campaign framework
- hidden parent mode

The implementation should remain lightweight and portable.

---

# Mission Structure

Every mission should include:

- Story progression
- Core challenge
- Reading
- Writing
- Mathematics
- Science or engineering
- Reflection
- Optional rabbit holes

Each activity should be categorised as:

- Core
- Extension
- Rabbit Hole

This enables adaptive daily scheduling while preserving learning outcomes.

---

# Educational Scope

Campaign 1 is designed to bridge curriculum differences between England and Scotland while extending beyond minimum expectations.

Subjects include:

- Reading
- Writing
- Mathematics
- Science

Future campaigns may expand into:

- History
- Geography
- Computing
- Engineering
- Astronomy
- Art
- Music
- Philosophy
- Economics
- Psychology

The platform should support expansion without architectural changes.

---

# Design Constraints

The project deliberately embraces the following constraints.

## Offline First

Internet access should enhance the experience, not enable it.

---

## Minimal Printing

Every mission must remain fully playable using only a notebook or sketchpad.

Printable materials are optional enhancements.

---

## Independent Learner

A capable learner should complete most activities without parental instruction.

---

## Hidden Curriculum

Curriculum mapping exists only in documentation and Parent Mode.

The learner never sees curriculum terminology.

---

## Adaptive Duration

Parents choose the available learning time.

The platform dynamically selects appropriate activities while preserving essential progression.

---

## Curiosity Preservation

Optional investigations ("Rabbit Holes") should reward curiosity without creating pressure to complete everything.

---

# Architectural Vision

Explorer Academy separates:

Platform

↓

Campaign

↓

Mission

↓

Activity

↓

Learning Outcome

↓

Curriculum Mapping

This separation allows campaigns to be authored without modifying platform code.

---

# Success Criteria

Explorer Academy succeeds when:

- learners voluntarily continue missions
- curiosity increases
- parents feel supported rather than burdened
- campaigns are reusable
- implementation remains maintainable
- future contributors can extend the platform without historical chat context

---

# Non-Goals

Explorer Academy is **not** intended to become:

- an online classroom
- a replacement school curriculum
- a gamified worksheet platform
- a video-first learning platform
- a reward-driven educational app

The emphasis remains on authentic exploration.

---

# Relationship to Other Documents

| Document | Relationship |
|-----------|--------------|
| 000_PROJECT_MANIFEST.md | Repository governance |
| 001_README.md | Public introduction |
| 003_DOCUMENTATION_INDEX.md | Document registry |
| 004_DOCUMENT_DEPENDENCY_GRAPH.md | Structural dependencies |
| 005_GENERATION_ROADMAP.md | Build sequence |
| 006_DESIGN_DECISION_LOG.md | Architectural rationale |

This document provides the philosophical context for all of them.

---

# Future Evolution

Changes to this document should be rare.

Any modification that alters philosophy, architecture or project direction should be accompanied by:

- a new Architecture Decision Record (ADR)
- updates to affected documents
- a changelog entry if appropriate

---

# Final Principle

Explorer Academy is not ultimately about delivering lessons.

It is about developing explorers.

Every design decision, feature, campaign and implementation should strengthen that purpose.