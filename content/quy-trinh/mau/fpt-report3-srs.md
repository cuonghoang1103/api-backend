# Report 3 – Software Requirement Specification

> **Purpose:** the full requirements of the system — context, workflows, actors and use cases, screens and who may use them, use case specifications, functional and non-functional requirements, business rules and system messages. v0.9 in week 2, v1.0 in week 5, then one update per iteration.
>
> **Guide:** headings follow the official FPT Capstone template (Report 3 – Software Requirement Specification). Sections 2 and 3 repeat per actor / per feature: copy a block (heading + table) for each one. Use the system's real name in every step, never just "System".

# I. Record of Changes

| Date | A\* M, D | In charge | Change Description |
|---|---|---|---|
| | A | | SRS v0.9 – overall requirements |

\*A - Added M - Modified D - Deleted

# II. Software Requirement Specification

## 1. Overall Requirements

### 1.1 Context Diagram

> **Guide:** one diagram: the system in the middle, every external actor and system around it, with the data that flows between them. Insert an image or a Mermaid block.

### 1.2 Main Workflows

> **Guide:** one sub-section per main business workflow (swimlane diagram + numbered detail flow). Decide the main workflows before drawing the detail.

#### 1.2.1 Workflow name

**1.2.1.1 Workflow Diagram**

**1.2.1.2 Detail Flow**

### 1.3 User Requirements

#### 1.3.1 Actors

| # | Actor | Description |
|---|---|---|
| 1 | | |

#### 1.3.2 Use Cases (UC)

| ID | Use Case | Feature | Use Case Description |
|---|---|---|---|
| 1 | | | |

#### 1.3.3 Use Case Diagrams

> **Guide:** an overall diagram plus one per actor. Secondary actors must appear and be connected to their use cases; check every include/extend.

### 1.4 System Functionalities

#### 1.4.1 Screens Flow

#### 1.4.2 Screen Authorization

| Screen | Actor 1 | Actor 2 | Actor 3 |
|---|---|---|---|
| Login | X | X | X |

#### 1.4.3 Non-UI Functions

| Feature | System Function | Description |
|---|---|---|
| | | |

### 1.5 Entity Relationship Diagram

**Entities Description**

| No. | Entity | Description |
|---|---|---|
| 1 | | |

## 2. Use Case Specifications

### 2.1 Actor 1 Features

#### 2.1.1 Use case name

| Primary Actors | | Secondary Actors | None |
|---|---|---|---|
| Description | | | |
| Preconditions | | | |
| Postconditions | | | |
| Normal Sequence/Flow | 1. | | |
| Alternative Sequences/Flows | 2A. | | |
| Exception Flows | 3E. | | |

> **Guide:** number alternative/exception flows after the normal-flow step they branch from (2A, 3E…). Postconditions must not contain business rules or system messages, and must not contradict an alternative flow. Every validation becomes a business rule (BR-xx) referenced here.

## 3. Functional Requirements

### 3.1 Feature group 1

#### 3.1.1 Screen name

This screen allows the User to:

- …

On the screen, s/he can also:

- …

**Field Description**

| Field Name | Description |
|---|---|
| | |

## 4. Non-Functional Requirements

### 4.1 External Interfaces

### 4.2 Quality Attribute

#### 4.2.1 Performance Efficiency

#### 4.2.2 Security & Privacy

#### 4.2.3 Reliability & Availability

#### 4.2.4 Usability

> **Guide:** state each attribute so it can be tested — Ambition, Scale, Goal, Minimum (Fail).

## 5. Requirement Appendix

### 5.1 Business Rules

| ID | Rule Name | Rule Definition |
|---|---|---|
| BR-01 | | |

### 5.2 System Messages

| ID | Message Type | Context | Content |
|---|---|---|---|
| SM-01 | | | |

> **Guide:** one specific message per parameter — never one message for several fields.
