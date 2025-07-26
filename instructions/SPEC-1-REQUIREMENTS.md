# AI Guidelines for Drafting the Requirements Document

## 1. File Creation
* Path: `{project_dir}/specs/{short_date}-{feature_name}/requirements.md`

## 2. Document Layout
```markdown
## Introduction
<one-paragraph feature summary>

## Requirements

### 1. **<Requirement title>**
- *User story*: As a <role>, I want <feature>, so that <benefit>.
- *Requirements*: (see Section 4: EARS Syntax Reference).
  - <requirement 1>
  - <requirement 2>
  - <requirement 3>

## Non-functional Requirements
- Performance: <goal>.
- Security: <goal>.
- Accessibility: <goal>.

## Edge Cases and Constraints
- <edge case>  
- <constraint>

## Glossary
- <term>: <definition>
```

## 3. Content Standards
* Hierarchical numbering (1, 1.1, 1.1.1).
* Requirements should combine user stories and acceptance criteria.
* Cover success paths, error paths, boundary conditions, UX, technical limits, security, compliance, and performance.
* Language must be precise, testable, and unambiguous.
* Exclude test cases, design notes, and implementation details.

## 4. EARS Syntax Reference

| Pattern              | Syntax                                                                             | Description                                               | Example                                                                                        |
|----------------------|------------------------------------------------------------------------------------|-----------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Ubiquitous           | The (system name) shall (system response)                                          | Always active; no condition or trigger                    | The mobile phone shall have a mass of less than XX grams.                                      |
| State-driven         | While (precondition(s)), the (system name) shall (system response)                 | Active as long as a state is true                         | While there is no card in the ATM, the ATM shall display “insert card to begin”.               |
| Event-driven         | When (trigger), the (system name) shall (system response)                          | Responds to a specific triggering event                   | When “mute” is selected, the laptop shall suppress all audio output.                           |
| Optional feature     | Where (feature is included), the (system name) shall (system response)             | Applies only if the system includes a specific feature    | Where the car has a sunroof, the car shall have a sunroof control panel on the driver door.    |
| Unwanted behaviour   | If (trigger), then the (system name) shall (system response)                       | Specifies how the system responds to undesired situations | If an invalid credit card number is entered, then the website shall display a warning message. |
| Complex              | While (precondition(s)), When (trigger), the (system name) shall (system response) | Combines multiple clauses to express richer behavior      | While the aircraft is on ground, when reverse thrust is commanded, the engine shall enable it. |

For more information on EARS, see [alistairmavin.com/ears](https://alistairmavin.com/ears/).

## 5. Edge Case Coverage
* Invalid inputs, duplicates, partial failures.
* Concurrency and high-load scenarios.
* Security threats: injection, unauthorized access, data leakage.

## 6. Non-functional Goals
* Performance targets (response times, throughput).
* Availability objectives (uptime, failover).
* Compliance (GDPR, WCAG 2.1 AA).

## 7. Glossary and References
* Define domain terms, acronyms, external systems.
* Link to related specs or standards only if essential.

Adhere strictly to these guidelines to produce a complete, clear, and testable requirements document—nothing more.