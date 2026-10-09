# Software Requirements Specification for <Project>

> **Purpose:** SWR302 Deliverable 4 — the integrating document: system features with their functional requirements, data requirements, external interfaces and quality attributes. Every functional requirement traces back to a UC-nn or an FE-n (link #3); Appendix C is the traceability matrix the grader reads in thirty seconds.
>
> **Guide:** headings and numbering follow Karl Wiegers' *Software Requirements Specification Template* (chapter 10). Requirements are the project's Requirement issues, classified by type (Functional, Quality attribute, Constraint, External interface, Data). "Fill from project data" writes the features, requirements, data dictionary, logical data model, glossary and traceability matrix as one new version.

**Version** 1.0 · **Prepared by** <author> · <organization> · <date created>

# Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| | | Initial draft | 0.1 |

# 1. Introduction

> **Guide:** an overview to help the reader understand how the SRS is organized and how to use it.

## 1.1 Purpose

> **Guide:** the product and release this SRS specifies, and the intended readers.

## 1.2 Document Conventions

> **Guide:** standards and typographical conventions, and the format of requirement identifiers (here: the issue key, e.g. PRJ-12; features FE-n; use cases UC-nn; rules BR-nn).

## 1.3 Project Scope

> **Guide:** a short description of the software and its purpose, related to the business objectives. Refer to the Vision and Scope document rather than duplicating it.

| ID | Feature | Description |
|---|---|---|
| FE-1 | | |

## 1.4 References

> **Guide:** documents this SRS refers to — the Vision and Scope, the use case document, the business rules catalog, interface specifications, style guides. If an AI-simulated stakeholder was used during elicitation, say so here.

# 2. Overall Description

> **Guide:** a high-level overview of the product, the environment, the users, and the known constraints, assumptions and dependencies.

## 2.1 Product Perspective

> **Guide:** the product's context and origin — a new product, a replacement, or a component of a larger system. A context diagram helps.

## 2.2 User Classes and Characteristics

> **Guide:** the user classes, their characteristics and which ones are favored. The actors of the use cases fill this table.

| User Class | Characteristics |
|---|---|
| | |

## 2.3 Operating Environment

> **Guide:** hardware platform, operating systems and versions, locations of users, servers and databases.

## 2.4 Design and Implementation Constraints

> **Guide:** factors that limit the developers' options. Requirement issues of type "Constraint" fill this table.

| ID | Constraint | Priority | Source |
|---|---|---|---|
| | | | |

## 2.5 Assumptions and Dependencies

> **Guide:** assumed factors (as opposed to known facts) and external dependencies. Assumption and dependency items of the RAID log fill this table.

| ID | Type | Assumption / Dependency |
|---|---|---|
| | | |

# 3. System Features

> **Guide:** functional requirements organized by system feature. Repeat 3.x with 3.x.1 Description and 3.x.2 Functional Requirements for each feature FE-n.

## 3.1 System Feature X

### 3.1.1 Description

> **Guide:** a short description of the feature and its priority (High, Medium, Low).

### 3.1.2 Functional Requirements

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

# 4. Data Requirements

> **Guide:** the data the system consumes, processes and produces.

## 4.1 Logical Data Model

> **Guide:** a visual model of the data objects and their relationships. Drawn from the data dictionary structures (the same model Diagram Studio draws as an ERD).

## 4.2 Data Dictionary

> **Guide:** the composition, meaning, data type, length and allowed values of every data element. The separate Data Dictionary document holds the full version.

| Data Element | Description | Composition or Data Type | Length | Values |
|---|---|---|---|---|
| | | | | |

## 4.3 Reports

> **Guide:** the reports the system generates and their characteristics. Data requirements of kind "Report" fill this table.

| ID | Report | Priority | Source |
|---|---|---|---|
| | | | |

## 4.4 Data Acquisition, Integrity, Retention, and Disposal

> **Guide:** how data is acquired and maintained, integrity protection, retention and disposal.

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

# 5. External Interface Requirements

> **Guide:** how the system communicates with users and with external hardware and software. Requirement issues of type "External interface" fill these tables by interface kind.

## 5.1 User Interfaces

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 5.2 Software Interfaces

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 5.3 Hardware Interfaces

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 5.4 Communications Interfaces

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

# 6. Quality Attributes

> **Guide:** state every quality attribute so it can be verified — a scale, a meter and a target (Planguage), never "fast" or "user-friendly". Requirement issues of type "Quality attribute" fill these tables by attribute.

## 6.1 Usability

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 6.2 Performance

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 6.3 Security

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 6.4 Safety

| ID | Requirement | Priority | Source |
|---|---|---|---|
| | | | |

## 6.5 [Others as relevant]

| ID | Quality Attribute | Requirement | Priority |
|---|---|---|---|
| | | | |

# 7. Internationalization and Localization Requirements

> **Guide:** currency, date/number formats, language, time zones, cultural and political issues.

# 8. Other Requirements

> **Guide:** legal, regulatory and standards requirements; installation, configuration, start-up and shutdown; logging and audit trail.

# Appendix A: Glossary

> **Guide:** every specialized term and acronym. The project glossary fills this table — one term, one meaning, across all eight deliverables.

| Term | Definition |
|---|---|
| | |

# Appendix B: Analysis Models

> **Guide:** pertinent analysis models — data flow diagrams, feature tree, state-transition diagrams, entity-relationship diagram. Insert them from Diagram Studio.

# Appendix C: Requirements Traceability Matrix

> **Guide:** one row per feature: the use cases that realize it, the functional requirements that implement it and the business rules that constrain it (links #1–#3). The Six links check on the Wiegers page shows every break.

| Feature | Use Cases | Functional Requirements | Business Rules |
|---|---|---|---|
| | | | |
