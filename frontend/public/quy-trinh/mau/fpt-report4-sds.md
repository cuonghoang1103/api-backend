# Report 4 – Software Design Specification

> **Purpose:** how the system is built — architecture, packages, database, and for every function the class and sequence diagrams that match the code. v1.0 (high level) in week 4, then v1.1–v1.3 with the detailed design of each iteration.
>
> **Guide:** headings follow the official FPT Capstone template (Report 4 – Software Design Specification). Section 2 repeats per feature and section 3 per package/class: copy a block for each. Class, method and table names must match the code and the SRS exactly.

# I. Record of Changes

| Date | A\* M, D | In charge | Change Description |
|---|---|---|---|
| | A | | SDS v1.0 – high level design |

\*A - Added M - Modified D - Deleted

# II. Software Design Document

## 1. High Level Design

### 1.1 Software Architecture

> **Guide:** an architecture diagram, then one paragraph per layer — e.g. Presentation Layer, Application Layer, Background Jobs, External Services Integration, Data Layer.

**1. Presentation Layer**

**2. Application Layer**

**3. Data Layer**

### 1.2 Package Diagram

#### 1.2.1 Back-end

#### 1.2.2 Front-end

### 1.3 Database Design

> **Guide:** the ERD first, then one table per entity. Derive entities from the actors in the normal flows; do not split tables that only differ by role.

#### 1.3.1 TABLE_NAME

\* PK\~Primary Key; FK\~Foreign Key; UN\~Unique; NN \~ not null

| No | Field | PK | FK | UN | NN | Description |
|---|---|---|---|---|---|---|
| 1 | id | X | | | X | Unique identifier |

## 2. Detailed Design

### 2.1 Feature name

#### 2.1.1 Class Diagram

#### 2.1.2 Sequence Diagram

> **Guide:** a class diagram and a sequence diagram for EVERY function that has been coded, named after the use case ("Create Contract Sequence Diagram").

## 3. Class Specifications

### 3.1 Package name

#### 3.1.1 ClassName

| No | Name | Description |
|---|---|---|
| | **Attributes** | |
| 1 | | Visibility: · Type: |
| | **Methods** | |
| 1 | | Visibility: · Parameters: · Return: |

## 4. Other Design Specifications

### 4.1. Authentication & Authorization Specification

### 4.2. Background Job Processing

### 4.3. Real-time Communication

### 4.4. Third-party Integrations

### 4.5. Standardized API Response

> **Guide:** keep only the sections that apply to your system and add others (file storage, PDF generation, caching…) in the same numbering.
