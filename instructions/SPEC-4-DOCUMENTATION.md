# AI Guidelines for Drafting the User Documentation

## 1. File Creation
* Path: `{project_dir}/specs/{short_date}-{feature_name}/documentation.md`

## 2. Prerequisite Check
* Confirm approved Requirements, Design, and Test documents exist for the feature.
* Reference requirement IDs and design components where relevant (e.g., for screen names or API endpoints).

## 3. Document Layout

```markdown
## Introduction
<concise description of what the user can accomplish with the feature>

## Getting Started
1. **Prerequisites**  
   - <software/permissions required>
2. **Accessing the Feature**  
   - <navigation path or command>
3. **Quick Start**  
   - <shortest path to first success>

## Detailed Usage

### <Primary Workflow 1>
1. <step>
2. <step>
3. <step>

### <Primary Workflow 2>
1. <step>
2. <step>

## Reference

| Element                       | Description    | Default/Range               | Notes         |
|-------------------------------|----------------|-----------------------------|---------------|
| <Field / Parameter / Setting> | <what it does> | <default or allowed values> | <tips, links> |

## Tips & Best Practices
- <tip 1>
- <tip 2>

## Troubleshooting
| Issue     | Likely Cause  | Resolution  |
|-----------|---------------|-------------|
| <symptom> | <cause>       | <fix steps> |

## FAQ
1. **Q:** <question>?  
   **A:** <answer>
2. **Q:** …  

## Glossary
* <term>: <plain-language definition>

## Revision History
| Version | Date       | Author | Notes         |
|---------|------------|--------|---------------|
| 0.1     | YYYY-MM-DD | <name> | Initial draft |
```

## 4. Content Standards
* Write for the target user persona (end-user, admin, developer, etc.).
* Use clear, action-oriented language and consistent terminology.
* Provide step-by-step instructions for common tasks; keep each step atomic.
* Cover edge cases, error states, and recovery actions users may face.
* Include screenshots, diagrams, or command examples where they improve clarity.
* Link to external resources or other sections sparingly and only when essential.

## 5. Non-functional Considerations
* Accessibility: Follow WCAG 2.1 AA for text, images, and multimedia.
* Localization: Structure content so that UI strings and screenshots can be replaced easily.
* Performance: Large media (e.g., gifs) must be optimized to minimize load time.

## 6. Quality Checklist
* Complete: every user-visible function described.
* Accurate: matches current UI labels, CLI flags, and behavior.
* Concise: avoid redundancy; prefer links to repeated content.
* Testable: steps can be executed exactly as written on a clean environment.
* Up-to-date: revision history maintained and version stamped.

Follow these rules exactly to produce clear, discoverable, and maintainable user documentation—nothing more.
