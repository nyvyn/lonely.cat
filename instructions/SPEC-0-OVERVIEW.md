## Path and Naming Convention

**Path Format**: `specs/{short_date}-{feature_name}/{document_type}.md`

- **{short_date}**: The date of creation, e.g., in `YYYYMMDD` format.
- **{feature_name}**: A descriptive, PascalCase name for the feature (e.g., `UserAuthentication`).
- **{document_type}.md**: The type of spec document. One of: `requirements.md`, `design.md`, `tasks.md`, `tests.md`, `documentation.md`.

**Rules**:
- Each feature's specification documents are stored in their own directory under `specs`.
- The directory name is a combination of the date and the feature name.

## Workflow: Collaborating with GitHub Copilot

### Phase 1: Specification Development (Use GitHub Edit Mode + Claude Sonnet 4)

Work through each specification file in order, using **GitHub Edit mode with Claude Sonnet 4**:

#### 1. Requirements (SPEC-1-REQUIREMENTS.md)
1. **Open** the requirements template: `/instructions/SPEC-1-REQUIREMENTS.md`
2. **Use GitHub Edit mode (Claude Sonnet 4)** to generate `specs/{short_date}-{feature_name}/requirements.md`
3. **Prompt**: "Create requirements for [feature description] following the template"
4. **Review** generated requirements for:
   - EARS syntax compliance
   - Complete user stories
   - Edge cases and constraints
5. **Iterate** with Claude to refine until requirements are complete

#### 2. Design (SPEC-2-DESIGN.md)
1. **Open** the design template: `/instructions/SPEC-2-DESIGN.md`
2. **Use GitHub Edit mode (Claude Sonnet 4)** with the approved requirements file in context
3. **Prompt**: "Create a design document for [feature] based on the requirements in `specs/{short_date}-{feature_name}/requirements.md`"
4. **Review** generated design for:
   - Architecture diagrams (Mermaid)
   - Component responsibilities
   - Data models
   - Error handling strategy
5. **Iterate** to ensure design addresses all requirements

#### 3. Testing (SPEC-3-TESTING.md)
1. **Open** the testing template: `/instructions/SPEC-3-TESTING.md`
2. **Use GitHub Edit mode (Claude Sonnet 4)** with requirements and design files in context
3. **Prompt**: "Create BDD test scenarios for [feature] covering all requirements and design components"
4. **Review** test scenarios for:
   - Gherkin syntax compliance
   - Complete requirement coverage
   - Happy path and edge cases
   - Proper tagging
5. **Iterate** to ensure comprehensive test coverage

#### 4. Documentation (SPEC-4-DOCUMENTATION.md)
1. **Open** the documentation template: `/instructions/SPEC-4-DOCUMENTATION.md`
2. **Use GitHub Edit mode (Claude Sonnet 4)** with requirements, design, and testing files in context
3. **Prompt**: "Create user documentation for [feature] based on requirements, design, and testing scenarios"
4. **Review** documentation for:
   - User-focused language
   - Complete workflow coverage
   - Troubleshooting scenarios
   - Reference materials
5. **Iterate** until documentation is user-ready

#### 5. Tasks (SPEC-5-TASKS.md)
1. **Open** the tasks template: `/instructions/SPEC-5-TASKS.md`
2. **Use GitHub Edit mode (Claude Sonnet 4)** with all previous specification files in context
3. **Prompt**: "Create implementation tasks for [feature] based on requirements, design, testing, and documentation"
4. **Review** task breakdown for:
   - Granular, actionable tasks
   - Proper sequencing
   - Requirement traceability
   - Cross-document integration
   - File/module specificity
5. **Iterate** until tasks are implementable and reference all previous documents

### Phase 2: Code Generation (Use GitHub Agent Mode + GPT-4.1)

Once all specification files are complete and reviewed, switch to **GitHub Agent mode with GPT-4.1**:

#### 6. Generate Implementation Code
1. **Use GitHub Agent mode (GPT-4.1)** with the Tasks document as primary context
2. **Include** Requirements, Design, Testing, and Documentation documents for reference
3. **Prompt**: "Generate code implementation following the tasks in `specs/{short_date}-{feature_name}/tasks.md`"
4. **Work through tasks sequentially**, generating:
   - Core implementation files
   - Test implementations based on scenarios
   - Documentation updates as needed
