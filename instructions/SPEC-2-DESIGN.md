# AI Guidelines for Drafting the Feature Design Document

## 1. File Creation
* Path: `{project_dir}/specs/{short_date}-{feature_name}/requirements.md`

## 2. Prerequisite Check
* Confirm the requirements file exists and is approved.
* Reference requirement IDs throughout the design.

## 3. Document Layout

```markdown
## Overview
<high-level description, scope, and goals>

## Architecture
- Context diagram (Mermaid)
- High-level data flow
- Key design patterns and rationale

## Components and Interfaces
| Component | Responsibility | Interfaces | Dependencies |  
|-----------|---------------|------------|--------------|  
| <name>    | <role>        | <APIs/events> | <lib/service> |  

## Data Models
​```mermaid
classDiagram
    domain classes and relations
​```

## Error Handling
* Failure modes and recovery strategies
* User-visible error messaging guidelines

## Testing Strategy (High-Level)
* Test pyramids, coverage targets, and tooling assumptions
* Non-functional testing (performance, security, accessibility)

## Edge Cases and Constraints
* <edge case>  
* <constraint>

## Design Decisions
| Decision | Alternatives | Chosen | Reason |
|----------|-------------|--------|---------|

## Glossary
* <term>: <definition>
```

## 4. Content Standards
* Tie every design element back to a requirement.
* Explain rationale for each architectural choice.
* Integrate relevant research findings; cite inline with reference links.
* Use Mermaid for sequence, class, or component diagrams where clarity improves.
* Keep language precise, implementation-agnostic, and testable.
* Exclude code, detailed test cases, and build instructions.

## 5. Research Integration
* Identify unknowns early and record findings directly in the appropriate sections.
* Summarize key data (benchmarks, third-party capabilities, constraints).

## 6. Quality Checklist
* Consistency with requirements scope and constraints.
* Complete coverage of functional and non-functional needs.
* Clear traceability from components to requirements.
* No overlap with testing or implementation docs.

Follow these guidelines to produce a complete, research-informed, and traceable design document—nothing more.