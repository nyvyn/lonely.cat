# AI Guidelines for Drafting the Tasks (Implementation Plan) Document

## 1. File Creation
* Path: `{project_dir}/specs/{short_date}-{feature_name}/tasks.md`

## 2. Prerequisite Check
* Confirm approved requirements, design, testing, and documentation documents exist; reference their sections and requirement IDs.
* Halt if any prerequisite documents are missing or incomplete.
* Review design document for architecture and component specifications
* Review testing document for test strategy and scenarios that need implementation
* Review documentation document for user-facing features that need to be built

## 3. Task List Layout

```markdown
## Implementation Tasks

- [ ] 1. <Epic or major module>  
  - [ ] 1.1 <Concrete coding task referencing Rqmt ID>
    - Write/modify <file(s)>
    - Add/extend tests for <functionality>
    - Update documentation as needed
  - [ ] 1.2 <Next task>
- [ ] 2. <Epic or module>  
  - [ ] 2.1 <Task>
```

* Two hierarchy levels maximum (1, 1.1).
* Each line is a checkbox (- [ ]).

## 4. Content Rules
* Every task must:
  * Involve writing, modifying, or testing code.
  * Reference granular requirement IDs (e.g., 2.3.1).
  * Include sub-bullets for context (files, modules, test focus).
  * Consider design specifications and architectural decisions
  * Account for test scenarios that need supporting code
  * Include tasks for user-facing features mentioned in documentation

## 5. Cross-Document Integration
* Reference design components and ensure implementation aligns with architectural decisions
* Include tasks to implement test scenarios defined in the testing document
* Ensure user-facing features described in documentation have corresponding implementation tasks
* Maintain traceability from requirements through design, testing, and documentation to implementation tasks

## 6. Task Prioritization
* Order tasks logically based on dependencies identified in design document
* Consider test-driven development approach where applicable
* Group related tasks to minimize context switching
* Prioritize foundational components before dependent features
