# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive web tutorial for learning VLANs (Virtual LANs) and 802.1Q VLAN tagging. The project consists of a simple static website with educational content and interactive exercises about networking concepts.

## Architecture

The project is a client-side only web application with no build process or dependencies:

- `index.html` - Main HTML structure with tutorial content
- `app.js` - JavaScript for interactive features (progress tracking, quiz functionality, answer validation)
- `styles.css` - CSS styling with dark theme and animations
- `tiny-vlan-tutorial.md` - Markdown version of the tutorial content

## Development

Since this is a static website with no build process:

- No package.json with scripts
- No dependencies to install
- Open `index.html` directly in a browser to view
- Use any local HTTP server for development (e.g., `python -m http.server` or VS Code Live Server extension)

## Key Features

The tutorial includes:
- Progressive content reveal with animations
- Interactive problem-solving exercises
- Multiple-choice quiz with score tracking
- Cisco IOS command validation
- Progress bar tracking completion

## File Structure

- Static assets only (HTML, CSS, JS)
- No server-side components
- Self-contained educational content about VLANs, 802.1Q tagging, and Cisco switch configuration