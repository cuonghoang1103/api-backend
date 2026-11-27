# Front-end Design (Report 4 §1.2.2)

> **Purpose:** the front-end part of the Software Design Specification — structure of the client application, routing, state, API access and shared components — at the level the SDS template asks for in "1.2.2 Front-end".
> **Guide:** describe what the code really is (folder names, libraries, versions). Every screen of the SRS (Screens Flow) appears in the route table.

## 1. Technology Stack

| Concern | Choice | Version | Why |
|---|---|---|---|
| Framework | | | |
| UI library | | | |
| State management | | | |
| HTTP client | | | |
| Form & validation | | | |
| Testing | | | |

## 2. Package / Folder Structure

| Folder | Responsibility |
|---|---|
| src/pages (or app/) | one folder per route |
| src/components | shared, presentational components |
| src/features | feature modules (screens + hooks + API calls) |
| src/services / src/api | API client, interceptors (auth token, errors) |
| src/store | global state |

## 3. Routes & Screens

| Route | Screen (SRS name) | Actors allowed | Guard |
|---|---|---|---|
| /login | | All | public |

## 4. State & Data Flow

How data moves from the API to the screen (request → cache/store → component), where errors and system messages (SM-xx) are shown.

## 5. Shared Components

| Component | Used by screens | Props / behaviour |
|---|---|---|
| | | |

## 6. Security on the Client

Token storage, route guards per role, input validation, what is never trusted on the client.
