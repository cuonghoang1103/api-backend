/**
 * CTW Diagram — 14 MẪU KHỞI ĐẦU theo nguyên tắc biên tập của diagram-design (MIT, © Cathryn Lavery —
 * https://github.com/cathrynlavery/diagram-design): mỗi mẫu ≤ 9 nút / ≤ 12 mũi tên, một tiêu điểm (lớp `focal`), nhãn ngắn
 * động từ đứng đầu, ví dụ thật của một đồ án (đặt phòng lab) để thấy ngay cách viết — thay chữ là dùng được.
 * Use case vẽ bằng flowchart theo quy ước UML (actor hai bên, UC hình viên thuốc trong khung hệ thống) vì Mermaid chưa có
 * loại use case riêng.
 */

import type { DiagramType } from '@/lib/work-diagrams-api';
import type { WKey } from '@/components/work/i18n';

export interface DiagramTemplate { id: string; type: DiagramType; name: WKey; hint: WKey; source: string }

const FOCAL = '  classDef focal fill:#eef0fb,stroke:#4f5bd5,stroke-width:1.5px';

export const TEMPLATES: DiagramTemplate[] = [
  {
    id: 'sequence', type: 'SEQUENCE', name: 'diagram.tplSequence', hint: 'diagram.tplSequenceHint',
    source: `sequenceDiagram
  autonumber
  actor S as Student
  participant W as Web app
  participant A as API
  participant D as Database
  S->>W: Choose lab and time slot
  W->>A: POST /reservations
  A->>D: Check overlapping bookings
  alt Slot is free
    A->>D: Save reservation (PENDING)
    A-->>W: 201 Created
    W-->>S: Show "Waiting for approval"
  else Slot is taken
    A-->>W: 409 Conflict
    W-->>S: Suggest other slots
  end
  Note over A: BR-01 Book at most 7 days ahead`,
  },
  {
    id: 'erd', type: 'ERD', name: 'diagram.tplErd', hint: 'diagram.tplErdHint',
    source: `erDiagram
  USER ||--o{ RESERVATION : makes
  LAB ||--o{ RESERVATION : "is booked in"
  LAB ||--o{ EQUIPMENT : contains
  RESERVATION }o--o{ EQUIPMENT : uses
  USER {
    bigint id PK
    string email UK
    string full_name
    string role
  }
  LAB {
    bigint id PK
    string name UK
    int capacity
  }
  RESERVATION {
    bigint id PK
    bigint user_id FK
    bigint lab_id FK
    datetime start_at
    string status
  }
  EQUIPMENT {
    bigint id PK
    bigint lab_id FK
    string serial UK
  }`,
  },
  {
    id: 'usecase', type: 'USE_CASE', name: 'diagram.tplUseCase', hint: 'diagram.tplUseCaseHint',
    source: `flowchart LR
  STU["«actor»<br/>Student"]
  MGR["«actor»<br/>Lab Manager"]
  subgraph SYS["LabFlow"]
    direction TB
    UC1(["UC-01 Log in"])
    UC2(["UC-02 Reserve lab"])
    UC3(["UC-03 Cancel reservation"])
    UC4(["UC-04 Approve reservation"])
  end
  MAIL["«system»<br/>Email service"]
  STU --- UC1
  STU --- UC2
  STU --- UC3
  MGR --- UC1
  MGR --- UC4
  UC4 -.- MAIL
  classDef actor fill:transparent,stroke:transparent,font-weight:600
  class STU,MGR,MAIL actor
${FOCAL}
  class UC2 focal`,
  },
  {
    id: 'activity', type: 'ACTIVITY', name: 'diagram.tplActivity', hint: 'diagram.tplActivityHint',
    source: `flowchart TB
  START(( )) --> A["Open booking page"]
  A --> B["Pick lab and time"]
  B --> C{"Slot free?"}
  C -->|"no"| B
  C -->|"yes"| D["Save as PENDING"]
  D --> E{"Manager approves?"}
  E -->|"yes"| F["Send confirmation"]
  E -->|"no"| G["Send rejection"]
  F --> END(((End)))
  G --> END
${FOCAL}
  class C focal`,
  },
  {
    id: 'state', type: 'STATE', name: 'diagram.tplState', hint: 'diagram.tplStateHint',
    source: `stateDiagram-v2
  direction LR
  [*] --> PENDING : Student submits
  PENDING --> APPROVED : Manager approves
  PENDING --> REJECTED : Manager rejects
  PENDING --> CANCELLED : Student cancels
  APPROVED --> CHECKED_IN : Scan at the door
  APPROVED --> NO_SHOW : 15 min late
  CHECKED_IN --> COMPLETED : Slot ends
  REJECTED --> [*]
  CANCELLED --> [*]
  COMPLETED --> [*]
  NO_SHOW --> [*]`,
  },
  {
    id: 'class', type: 'CLASS', name: 'diagram.tplClass', hint: 'diagram.tplClassHint',
    source: `classDiagram
  direction LR
  class ReservationController {
    <<controller>>
    +create(dto) ReservationDto
    +cancel(id) void
  }
  class ReservationService {
    <<service>>
    +create(userId, dto) Reservation
    +approve(id, managerId) Reservation
  }
  class ReservationRepository {
    <<interface>>
    +findOverlapping(labId, start, end) List
  }
  class Reservation {
    <<entity>>
    -Long id
    -LocalDateTime startAt
    -Status status
  }
  ReservationController --> ReservationService
  ReservationService --> ReservationRepository
  ReservationRepository ..> Reservation`,
  },
  {
    id: 'deployment', type: 'DEPLOYMENT', name: 'diagram.tplDeployment', hint: 'diagram.tplDeploymentHint',
    source: `flowchart LR
  USER(["Browser"])
  subgraph VPS["VPS · Ubuntu 24.04 · Docker"]
    direction LR
    NGINX["nginx<br/>:443 TLS"]
    FE["frontend<br/>Next.js :3000"]
    BE["backend<br/>Spring Boot :8080"]
    DB[("PostgreSQL 16<br/>:5432")]
  end
  S3{{"Object storage<br/>R2 / S3"}}
  USER -->|"HTTPS"| NGINX
  NGINX --> FE
  NGINX -->|"/api"| BE
  BE --> DB
  BE -.->|"files"| S3
${FOCAL}
  class BE focal`,
  },
  {
    id: 'layers', type: 'ARCHITECTURE', name: 'diagram.tplLayers', hint: 'diagram.tplLayersHint',
    source: `flowchart TB
  subgraph P["Presentation"]
    direction LR
    WEB["Web app"]
    MOB["Mobile app"]
  end
  subgraph B["Business"]
    direction LR
    API["REST API"]
    SVC["Booking service"]
    JOB["Scheduler"]
  end
  subgraph D["Data"]
    direction LR
    DB[("PostgreSQL")]
    CACHE[("Redis")]
  end
  WEB --> API
  MOB --> API
  API --> SVC
  JOB --> SVC
  SVC --> DB
  SVC --> CACHE
${FOCAL}
  class SVC focal`,
  },
  {
    id: 'dataflow', type: 'DATA_FLOW', name: 'diagram.tplDataFlow', hint: 'diagram.tplDataFlowHint',
    source: `flowchart LR
  STU(["Student"]) -->|"booking request"| P1["1.0 Validate booking"]
  P1 -->|"valid booking"| P2["2.0 Record reservation"]
  P2 -->|"reservation"| D1[("D1 Reservations")]
  D1 -->|"pending list"| P3["3.0 Review requests"]
  MGR(["Lab Manager"]) -->|"decision"| P3
  P3 -->|"notice"| STU
${FOCAL}
  class P2 focal`,
  },
  {
    id: 'swimlane', type: 'SWIMLANE', name: 'diagram.tplSwimlane', hint: 'diagram.tplSwimlaneHint',
    source: `flowchart LR
  subgraph L1["Student"]
    direction LR
    A["Submit request"]
    F["Receive result"]
  end
  subgraph L2["System"]
    direction LR
    B["Check rules"]
    C["Notify manager"]
  end
  subgraph L3["Lab Manager"]
    direction LR
    D{"Approve?"}
  end
  A --> B --> C --> D
  D -->|"yes / no"| F`,
  },
  {
    id: 'gantt', type: 'GANTT', name: 'diagram.tplGantt', hint: 'diagram.tplGanttHint',
    source: `gantt
  title Capstone plan
  dateFormat YYYY-MM-DD
  axisFormat %d/%m
  section Analysis
  SRS (Report 3)        :done,   r3, 2026-09-07, 14d
  section Design
  SDS (Report 4)        :active, r4, after r3, 14d
  section Build
  Sprint 1              :        s1, after r4, 14d
  Sprint 2              :        s2, after s1, 14d
  section Test
  System test (5.3)     :crit,   st, after s2, 7d
  Defence               :milestone, m1, after st, 0d`,
  },
  {
    id: 'journey', type: 'JOURNEY', name: 'diagram.tplJourney', hint: 'diagram.tplJourneyHint',
    source: `journey
  title Student books a lab
  section Find
    Open the app: 4: Student
    Search free labs: 3: Student
  section Book
    Pick a slot: 4: Student
    Wait for approval: 2: Student, Lab Manager
  section Use
    Check in with QR: 5: Student
    Return equipment: 3: Student, Lab Manager`,
  },
  {
    id: 'timeline', type: 'TIMELINE', name: 'diagram.tplTimeline', hint: 'diagram.tplTimelineHint',
    source: `timeline
  title Release history
  Sep 2026 : v0.1 Login and roles
  Oct 2026 : v0.2 Lab booking : Approval flow
  Nov 2026 : v0.3 QR check-in : Equipment loans
  Dec 2026 : v1.0 Defence build`,
  },
  {
    id: 'mindmap', type: 'MINDMAP', name: 'diagram.tplMindmap', hint: 'diagram.tplMindmapHint',
    source: `mindmap
  root((LabFlow))
    Booking
      Search labs
      Reserve
      Approve
    Equipment
      Loan
      Return
    Reports
      Usage
      No-shows`,
  },
];
