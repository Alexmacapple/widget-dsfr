# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development server
npm run serve                    # Python HTTP server on http://localhost:8000

# Testing & validation
npm test                        # Run all tests (tests/run-tests.js)
npm run validate               # Validate DSFR compliance
node tests/validate-dsfr.js [file]  # Validate specific widget file

# Installation & setup
./setup.sh                      # Complete installation with all MCP servers
./setup.sh --clean             # Clean reinstall
npm install                    # Install project dependencies
```

## Project Architecture

Transforms OpenDataSoft widgets to DSFR-compliant HTML for Drupal integration with real-time data.economie.gouv.fr connections.

### Key Directories
- **mcp-dsfr/**: DSFR component generation & validation server (208 components)
- **mcp-ods-widgets/**: ODS widget transformation server (70+ widgets)  
- **agents/**: EPCT workflow automation (widget-explorer, widget-generator, dsfr-validator, migration-assistant)
- **examples/**: Production-ready widget implementations
- **tests/**: DSFR compliance validation suite

## MCP Server Functions

### Widget Generation & Validation
```bash
# Generate DSFR widget
mcp__ods-widgets__create_widget type:"table" dataset:"signalconso"

# Validate compliance
mcp__dsfr-mcp__validate_dsfr_html html_code:"<html>"

# Analyze dataset
mcp__ods-widgets__analyze_dataset dataset:"signalconso"
```

### Available MCP Servers (11 total in .mcp.json)
- **dsfr-mcp**: DSFR component generation/validation
- **ods-widgets**: ODS widget transformation
- **context7**: Documentation retrieval
- **angular-mcp**: Kendo UI Angular support
- **sequential-thinking**: Task planning
- **basic-memory**: Pattern memorization
- **knowledge-graph**: Widget relationships
- **playwright**: Browser testing
- **github**: GitHub operations
- **git**: Version control
- **ccusage**: Claude Code API consumption tracking

## Widget Development Workflow

1. **Generate**: `mcp__ods-widgets__create_widget type:"[type]" dataset:"[dataset]"`
2. **Validate**: `mcp__dsfr-mcp__validate_dsfr_html html_code:"..."`
3. **Test**: `node tests/validate-dsfr.js [file]`

### Widget HTML Structure
```html
<!-- DÉBUT ZONE WIDGET [DATASET]-[TYPE]-[ID] -->
<div id="widget-[dataset]-[type]-[id]" class="widget-container">
    <!-- DSFR-compliant content -->
</div>
<!-- FIN ZONE WIDGET [DATASET]-[TYPE]-[ID] -->
```

## Data Sources (data.economie.gouv.fr)

- **signalconso**: Consumer reports
- **annuaire-dgccrf**: DGCCRF directory  
- **budget-vert**: Green budget PLF25
- **tarifs-bancaires**: Banking rates CCSF
- **demarches-simplifiees**: Etikraine
- **taux-de-change**: Exchange rates DGFIP

## DSFR CSS Classes

- **Tables**: `.fr-table`, `.fr-table--bordered`, `.fr-table--no-scroll`
- **Cards**: `.fr-card`, `.fr-card__body`, `.fr-card__title`
- **Forms**: `.fr-search-bar`, `.fr-input`, `.fr-select`, `.fr-btn`
- **Layout**: `.fr-container`, `.fr-grid-row`, `.fr-col-*`

## Required Asset Loading Order

```html
<!-- CSS -->
<link rel="stylesheet" href="ods-widgets.css">
<link rel="stylesheet" href="@gouvfr/dsfr.min.css">
<link rel="stylesheet" href="custom.css">

<!-- JS -->
<script src="angular.min.js"></script>
<script src="angular-sanitize.min.js"></script>  
<script src="ods-widgets.js"></script>
<script src="@gouvfr/dsfr.module.min.js"></script>
```

## Agent Automation

Use Task command with agent name:
- **widget-explorer**: Analyze ODS widgets
- **widget-generator**: Generate DSFR widgets  
- **dsfr-validator**: Validate compliance
- **migration-assistant**: Batch migration

Example: `Task: widget-generator "Créer table pour signalconso"`

## EPCT Workflow (Complex Tasks)

Use `/epct [task]` for structured multi-step tasks:
1. **Explorer**: Parallel codebase analysis
2. **Planifier**: Implementation planning
3. **Coder**: Convention-aware implementation
4. **Tester**: DSFR/RGAA validation

## Critical Implementation Rules

### File Management
- Iterate on existing files (Edit/MultiEdit tools)
- Create new files only when explicitly requested
- Preserve widget identification comments

### DSFR Compliance Requirements
- NO emojis in HTML headings (h1-h6)
- Validate CSS classes with mcp__dsfr-mcp__validate_dsfr_html
- RGAA AA accessibility mandatory
- Semantic HTML5 structure

### Testing Commands

```bash
# Validate single widget
node tests/validate-dsfr.js [file]

# Run test suite
npm test

# Manual checks
- Keyboard navigation (Tab, Enter, Space)
- Screen reader compatibility
- Color contrast AA (4.5:1 minimum)
```


## Troubleshooting

### MCP Server Issues
```bash
cat .mcp.json                      # Check configuration
node mcp-dsfr/src/index.js         # Test DSFR server
node mcp-ods-widgets/server.js     # Test ODS server
```

### Widget Display Problems
- Check browser console for errors
- Verify data.economie.gouv.fr connection
- Validate HTML with `mcp__dsfr-mcp__validate_dsfr_html`
- Confirm CSS/JS loading order

## Key Files

- **examples/signalconso-dashboard-dsfr.html**: Complete dashboard reference
- **tests/validate-dsfr.js**: DSFR validation tool
- **.mcp.json**: MCP server configuration (11 servers)
- **setup.sh**: Installation script