# AI Guidelines for Drafting the Test Scenarios Document

## 1. File Creation
* Path: `{project_dir}/specs/{short_date}-{feature_name}/tests.md`

## 2. Prerequisite Check
* Ensure approved requirements and design documents exist.
* Reference requirement IDs and design components throughout.

## 3. Document Layout

```gherkin
Feature: <clear feature name> @<tags>
<one-sentence user-story reference>

Background:
Given <shared setup>  # optional, omit if not needed

Scenario: <behavior under test> @<tags>
Given <initial context>
And   <additional context>
When  <action>
Then  <expected outcome>
And   <additional assertion>

Scenario Outline: <data-driven behavior> @<tags>
Given <context>
When  <action with <param>>
Then  <outcome with <param>>

    Examples:
      | param | otherParam |
      | …     | …          |
```

## 4. Content Rules
* Map each Feature to a user story; include requirement IDs in comments or tags.
* Each Scenario tests one behavior with clear Given-When-Then flow.
* Use Background blocks to avoid duplication across scenarios.
* Prefer Scenario Outlines with Examples tables for data-driven cases.
* Tag scenarios for grouping, e.g., @smoke, @regression, @integration, @error_handling.
* Keep language business-focused and implementation-agnostic.

## 5. Coverage Checklist
* All acceptance criteria from requirements covered.
* Happy paths, edge cases, boundary conditions.
* Error handling and validation.
* Integration points between components.
* Security and authorization behaviors.
* Data transformation and persistence rules.

## 6. Quality Standards
* Scenarios are independent and order-agnostic.
* Each Then step contains a verifiable assertion.
* No duplicated or conflicting scenarios.
* Tags support selective execution (smoke, regression).
* Use consistent, readable naming for scenarios and steps.

## 7. Excluded Items
* No test automation code or framework setup details.
* No deployment, performance, or user-acceptance activities.

Apply these guidelines exactly to generate a complete, maintainable, and traceable Gherkin test suite.