# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Start local development server
npm run serve                    # Python HTTP server on http://localhost:8000

# Run MCP servers
node mcp-dsfr/src/index.js      # DSFR MCP server
node mcp-ods-widgets/server.js  # ODS Widgets MCP server

# Test and validate
npm test                        # Run all tests
npm run validate               # Validate DSFR compliance
node tests/validate-dsfr.js examples/signalconso-dashboard-dsfr.html

# Check MCP connectivity
claude mcp list                # List configured MCP servers
claude mcp status             # Check server status
```

## Project Overview

This project transforms 70+ OpenDataSoft widgets into DSFR-compliant HTML components for direct Drupal integration. All widgets connect directly to `data.economie.gouv.fr` in real-time.

### Core Architecture

```
widget-dsfr/
├── mcp-dsfr/              # DSFR MCP server (208 components)
├── mcp-ods-widgets/       # ODS Widgets MCP (70+ widgets)
├── agents/                # 4 automation agents (EPCT workflow)
├── examples/              # Working dashboards & widgets
└── templates/             # DSFR HTML templates
```

## MCP Servers Configuration

| Server | Path/Command | Purpose | Key Functions |
|--------|--------------|---------|---------------|
| **dsfr-mcp** | `mcp-dsfr/src/index.js` | DSFR components & validation | `validate_dsfr_html`, `generate_dsfr_component` |
| **ods-widgets** | `mcp-ods-widgets/server.js` | ODS widget generation | `create_widget`, `analyze_dataset` |
| **context7** | `npx @upstash/context7-mcp` | Documentation lookup | `resolve-library-id`, `get-library-docs` |
| **angular-mcp** | `npx @progress/kendo-angular-mcp` | Angular/Kendo support | `kendo_angular_assistant` |

## Widget Generation Workflow

### 1. Generate a Widget
```bash
# Using MCP ODS-Widgets
mcp__ods-widgets__create_widget type:"table" dataset:"signalconso"

# Using Agent
Task: widget-generator "Créer table DSFR pour signalconso"
```

### 2. Validate DSFR Compliance
```bash
# Using MCP DSFR
mcp__dsfr-mcp__validate_dsfr_html html_code:"<your html>"

# Using Agent
Task: dsfr-validator "Valider signalconso-table-001.html"
```

### 3. Widget Identification Format
```html
<!-- DÉBUT ZONE WIDGET SIGNALCONSO-TABLE-001 -->
<div id="widget-signalconso-table-001" class="widget-container">
    <!-- Widget content -->
</div>
<!-- FIN ZONE WIDGET SIGNALCONSO-TABLE-001 -->
```

## Available Datasets

1. **SignalConso** - Consumer reports
2. **Annuaire DGCCRF** - DGCCRF directory
3. **Budget Vert** - Green budget PLF25
4. **Tarifs Bancaires** - Banking rates CCSF
5. **Démarches Simplifiées** - Etikraine
6. **Taux de Change** - Exchange rates DGFIP

## Key DSFR Components

```css
/* Tables */
.fr-table, .fr-table--bordered, .fr-table--no-scroll

/* Cards */
.fr-card, .fr-card__body, .fr-card__title, .fr-card__desc

/* Forms */
.fr-search-bar, .fr-input, .fr-select, .fr-btn

/* Layout */
.fr-container, .fr-grid-row, .fr-col-*
```

## CSS/JS Loading Order (Critical)

```html
<!-- CSS Order -->
1. <link rel="stylesheet" href="ods-widgets.css">
2. <link rel="stylesheet" href="@gouvfr/dsfr.min.css">
3. <link rel="stylesheet" href="custom.css">

<!-- JS Order -->
1. <script src="angular.min.js"></script>
2. <script src="angular-sanitize.min.js"></script>
3. <script src="ods-widgets.js"></script>
4. <script src="@gouvfr/dsfr.module.min.js"></script>
```

## Agent Usage (Task Command)

| Agent | Purpose | Usage |
|-------|---------|-------|
| **widget-explorer** | Analyze ODS widgets | `Task: widget-explorer "Analyser widgets ODS"` |
| **widget-generator** | Generate DSFR widgets | `Task: widget-generator "Créer [type] pour [dataset]"` |
| **dsfr-validator** | Validate compliance | `Task: dsfr-validator "Valider [file].html"` |
| **migration-assistant** | Batch migration | `Task: migration-assistant "Migration batch widgets"` |

## EPCT Workflow

```bash
# For complex tasks, use the structured workflow
/epct [task description]

# Manual workflow
1. Explorer: Analyze codebase with parallel agents
2. Planifier: Create detailed implementation plan
3. Coder: Implement following project conventions
4. Tester: Validate DSFR/RGAA compliance
```

## Critical Rules

### File Handling
- **ALWAYS iterate on current file** until task is complete
- **NEVER create new files** unless explicitly requested
- **Use Edit/MultiEdit** for progressive improvements

### DSFR Compliance
- **NO emojis in HTML titles** (h1, h2, h3) - DSFR strict rule
- **Validate all CSS classes** via MCP DSFR
- **RGAA AA accessibility** mandatory
- **Semantic HTML5** structure required

### Communication
- Respond in French
- No emojis in responses
- Concise, technical communication

## Testing & Validation

```bash
# Test specific widget
node tests/validate-dsfr.js examples/[widget].html

# Run all tests
npm test

# Manual accessibility check
- Keyboard navigation (Tab, Enter, Space)
- Screen reader compatibility (NVDA/JAWS)
- Color contrast AA (4.5:1 minimum)
```

## Troubleshooting

### MCP Servers Not Connected
```bash
# Check configuration
cat .mcp.json

# Test servers directly
node mcp-dsfr/src/index.js
node mcp-ods-widgets/server.js

# Restart Claude
exit && claude
```

### Widget Not Displaying
1. Check console for errors
2. Verify dataset connection to data.economie.gouv.fr
3. Validate HTML structure with DSFR validator
4. Check CSS/JS loading order

### Performance Issues
- Enable widget caching in production
- Use pagination for large datasets
- Implement virtual scrolling for tables >1000 rows

## Key Files Reference

| File | Purpose |
|------|---------|
| `examples/signalconso-dashboard-dsfr.html` | Complete dashboard example |
| `mcp-ods-widgets/templates/*.html` | Widget templates |
| `mcp-dsfr/docs/mappings/ods-to-dsfr.json` | Component mappings |
| `.mcp.json` | MCP server configuration |
| `AGENTS_ORCHESTRATION.md` | Agent coordination guide |

---
*Version 3.0 - Focused on actionable commands and workflows*