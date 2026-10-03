# PetCare
## Full-Stack Pet Health and Appointment Management System

**Project 02: Full-Stack CRUD App | Proposal draft | 24 September 2026**

### 1. Project overview

PetCare is a responsive web application that helps pet owners organize pet profiles, health records, and veterinary appointments in one place. The proposed system turns the team's existing PetCare user research and mobile interface prototype into an original Next.js and MongoDB application with persistent data and complete create, read, update, and delete operations.

The first release focuses on three core entities: **Pets, Health Records, and Appointments**. Owners will be able to register, add their pets, record vaccinations and treatments, view upcoming care dates, and maintain appointment schedules. The interface will adapt the prototype's green visual theme and familiar calendar flow to mobile and desktop browsers.

### 2. Problem statement

The supplied presentation identifies three connected problems: pet owners forget appointments, vaccination dates, and medication schedules; health information is scattered across paper notes and applications; and important updates are difficult to communicate to family members or caretakers. These difficulties can leave owners uncertain about a pet's care history and what needs attention next.

PetCare proposes a central, pet-specific record and schedule. A dashboard will surface upcoming appointments and recorded care due dates, while clear lists and detail pages will make past information easier to find. The project evaluates whether these workflows are usable and technically complete; it does not claim measured improvements in pet health.

### 3. Objectives and intended users

- Give pet owners one place to create and maintain profiles for multiple pets.
- Organize vaccinations, medications, allergies, treatments, and owner observations under the correct pet.
- Let owners create, review, reschedule, and delete appointment entries.
- Show upcoming and overdue care items from stored dates within the application.
- Improve navigation, readability, and record grouping based on the existing usability feedback.
- Demonstrate three complete REST API CRUD models, a usable interface, and a working VM deployment.

The primary users are pet owners, including owners of multiple pets and people who currently use paper notes or separate applications. Caretakers are a secondary audience for future sharing features. Live veterinary service delivery is outside this first release.

### 4. Course team and proposal status

**Course team:** Nyein Chan Htet Naing, Myat Phone Paye, and Lin Myat Thu. GitHub links are still to be supplied. The source presentation lists five contributors: Sai seng Phone Pai, lin myat thu, Thanakrit kodklangdon, Worachai Aranchot, and Nonthapat chintawutiphong. Those are source-project credits, separate from the confirmed three-person course team. Student IDs are intentionally omitted.

| Course member | GitHub link | Proposed responsibility |
| --- | --- | --- |
| Nyein Chan Htet Naing | To be supplied | Interface, accessibility, and prototype adaptation |
| Myat Phone Paye | To be supplied | REST API, MongoDB models, and authentication |
| Lin Myat Thu | To be supplied | Integration, testing, VM deployment, and documentation |

Responsibilities may be shared; all members should contribute reviewable commits. Confirm the actual course deadline and submit the required proposal form through Teams before implementation. Topic or membership changes must be reported to the instructor. The assignment states that no proposal results in zero overall project marks.

<!-- pagebreak -->

### 5. Research foundation

The presentation reports three interview summaries, labeled “Interviewer 1–3.” The first describes forgetting appointments and vaccination dates, with a desire for reminders. The second describes scattered health notes and difficulty finding past records. The third describes difficulty sharing health details with caretakers. These are qualitative findings; the slides do not provide interview protocols, demographics, raw transcripts, or quantitative prevalence estimates.

| Research theme | Reported difficulty | Proposed response |
| --- | --- | --- |
| Remembering care | Forgotten visits and vaccination dates cause stress | Upcoming appointments and care-due indicators |
| Finding information | Records are scattered and difficult to retrieve | Pet-specific health history, categories, and filters |
| Communicating updates | Verbal sharing can omit important details | Clear record detail pages; controlled sharing in a later phase |

### 6. Competitive analysis

The following summarizes the team's presentation, not an independently verified audit of current competing products.

| Alternative named in slides | Team's assessment | PetCare opportunity |
| --- | --- | --- |
| 11pet Petscare | Core health features, limited web support | Browser-based access on mobile and desktop |
| Pawtrack | Emphasis on GPS/location, fewer medical tracking features | Focus on health history and care dates |
| Facebook group chat | Useful communication, unstructured tracking | Structured records linked to individual pets |
| Notes | Simple, but easy to lose or forget | Persistent, searchable records and a central schedule |

PetCare's proposed distinction is the combination of pet records, care dates, and appointment management in a small, coherent web application. Current competitor capabilities should be rechecked if formal market claims are needed later.

### 7. Affinity themes, persona, and journey

The affinity map groups findings into forgetfulness and missed routines, unstructured health tracking, lack of illness awareness, poor communication and sharing, stress and emotional burden, problems during vet visits, and care responsibility. These themes motivate a central history, visible care dates, and clearer information retrieval.

The supplied persona, Kimmy, is a 19-year-old university student at Assumption University who has two cats and struggles to balance their care with a busy study schedule. The persona's goals are to record and retrieve health history easily and spend less time searching for documents. The slides describe worry about missing illness signs and appointments. This is a design persona, not an additional verified research participant; the proposal uses the persona's needs without inferring wider demographic conclusions.

The current journey moves from noticing a pet is unwell, to planning a visit, gathering records, managing the appointment, and communicating updates. The reported pain points are uncertainty, waiting, difficulty finding records, missed appointments, and incomplete verbal handovers.

The proposed journey is: sign in, choose a pet, review its health history and due dates, create an appointment entry, and update the record after the visit. This proposal addresses organization and retrieval; it does not assume that the app can diagnose illness or reduce clinic waiting times.

<!-- pagebreak -->

### 8. Feature priorities and boundaries

The original presentation prioritizes health records, appointment booking, vaccination and medication reminders, and veterinary chat. To meet the course scope, this proposal distinguishes required implementation from later service integrations.

| Priority | Features and scope |
| --- | --- |
| Must deliver | Email/password authentication; complete CRUD for pets, health records, and appointment entries; dashboard; mobile and desktop layouts; validation and feedback |
| Should deliver | Pet and record filters; category grouping; calendar view; in-app upcoming/overdue indicators; concise first-use guidance |
| Future development | Verified clinic booking integration, live veterinary chat, email/push reminders, caretaker sharing, advanced veterinarian search |

**Appointment boundary:** in the first release, an appointment is an owner-managed entry with a veterinarian or clinic name, date, time, and purpose. Saving an entry does not reserve a real clinic slot. Any veterinarian profiles used for demonstration must be clearly labeled as sample data. Calendar reminders are visible when the owner opens the app; background notifications are not promised.

**Health boundary:** health status and observations are entered by owners. The system stores information and due dates; it does not automatically diagnose conditions. Real-time chat, payment processing, GPS tracking, and native mobile applications are not required deliverables.

### 9. Prototype workflow and required extensions

The supplied screenshots show Welcome, Sign Up, Sign In, Add Pet, Home, Pet Detail, Manage Pet, Profile, Wellness, Medical Records, veterinarian selection/detail, appointment date/time, Schedule, Social, and Conversation screens.

1. **Enter the system:** Welcome leads to registration or sign-in, followed by an empty dashboard for a new owner.
2. **Add a pet:** enter profile information, validate it, save, and return to the dashboard with the new pet visible.
3. **Review and maintain a pet:** open a pet detail page, edit its information, or delete it after confirmation.
4. **Maintain health history:** choose the pet, browse grouped records, add a record, open its details, edit it, or delete it after confirmation.
5. **Manage appointments:** choose the pet, enter clinic/veterinarian details and a date/time, save, then view it in the schedule. Owners can reschedule or delete entries.
6. **Review upcoming care:** the dashboard shows future appointments and care dates, with text labels distinguishing upcoming and overdue items.

The prototype is design evidence, not proof of implemented functionality. The course build must add explicit health-record create/edit/delete forms, appointment update/delete controls, deletion confirmation, validation, and loading, empty, error, and success states. Chat screens remain a documented future direction.

### 10. Usability findings and improvement plan

The slides report tests of adding a pet, viewing records, and booking an appointment. Positive feedback highlights visible action buttons, familiar calendar scheduling, and a clean color theme. Reported problems include unclear navigation, small text, and crowded records. Participant count, task completion rates, timings, and formal usability scores are not supplied, so none are claimed.

The implementation will retain recognizable primary actions and calendar patterns, increase text clarity and contrast, group records by type and pet, add explicit page titles and navigation labels, and provide brief onboarding. Sample pet names, species, images, and dates will be made internally consistent; the screenshots contain mixed sample labels. Forms will use clear labels such as sex, date of birth, species, breed, and weight with units.

<!-- pagebreak -->

### 11. Data models and relationships

MongoDB will store separate collections for the three assessed entities. Owner accounts support authentication but are not counted toward the minimum three CRUD models. Every record is associated with its authenticated owner; health records and appointments also reference a pet.

| Model | Main proposed fields | Relationship |
| --- | --- | --- |
| Pet | _id, ownerId, name, species, breed, sex, dateOfBirth or estimatedAge, color, weightKg, optional photo reference, timestamps | One owner has many pets |
| HealthRecord | _id, ownerId, petId, type, title, recordDate, optional dueDate, notes, optional veterinarian/clinic, timestamps | One pet has many health records |
| Appointment | _id, ownerId, petId, clinicName, veterinarianName, startsAt, timeZone, reason, status, notes, timestamps | One pet has many appointment entries |

Health-record types cover vaccination, medication, allergy, treatment, and observation. Type-specific optional details can be added without counting categories as separate CRUD entities. Appointment status can be planned, completed, or cancelled. Cancellation is an update; an explicit delete operation will also be available to demonstrate full CRUD.

### 12. CRUD operations and API design

| Entity | Create | Read | Update | Delete |
| --- | --- | --- | --- | --- |
| Pets | Add a pet profile | List pets and view one | Edit profile fields | Confirm removal of a pet |
| Health records | Add a care or history entry | List/filter and view details | Correct or update an entry | Confirm removal of an entry |
| Appointments | Add a scheduled visit entry | View list/calendar and details | Reschedule or change details/status | Confirm removal of an entry |

Each resource will expose the same REST pattern, using **pets**, **health-records**, or **appointments** in place of `{resource}`:

- `POST /api/{resource}` creates a document.
- `GET /api/{resource}` lists the owner's documents; child resources can be filtered by petId.
- `GET /api/{resource}/{id}` returns one owned document.
- `PUT /api/{resource}/{id}` validates and updates the document.
- `DELETE /api/{resource}/{id}` removes the document after UI confirmation.

The server will reject malformed IDs, invalid values, and references to pets not owned by the caller. It will return consistent success and error responses with appropriate HTTP status codes. Ownership comes from the authenticated session, not an ownerId supplied by the browser.

To prevent orphan records, deleting a pet with linked health records or appointments will be blocked with a clear explanation until those entries are removed. A cancelled appointment remains visible in history until explicitly deleted. Stored timestamps will support consistent display in the chosen time zone. These rules are proposed additions to make the prototype reliable as a data application.

<!-- pagebreak -->

### 13. Technical architecture and deployment

The proposed architecture is **browser → Next.js interface and REST route handlers → self-hosted MongoDB**. Next.js will provide both the web pages and API, aligning the implementation directly with the required stack. MongoDB will persist owner accounts, pets, records, and appointments. The existing repository is an early technical scaffold and will need to be adapted to this domain; it is not presented as a completed PetCare implementation.

The application and database will run on a Linux VM, with a Node.js production process behind a reverse proxy such as Nginx. MongoDB will be reachable by the application through a private/local connection. Configuration and secrets will be supplied through environment variables. Deployment will include HTTPS where a domain is available, process restart configuration, persistent database storage, and a documented backup/restore procedure.

This plan uses no Firebase, managed backend, or serverless application hosting. Self-hosted MongoDB avoids ambiguity about the assignment's restriction on managed backends. The VM provider, domain, and final public URL remain to be confirmed; no hosting purchase or deployment has been made as part of this proposal.

Account passwords will be hashed, sessions protected, and API access checked for ownership. Server-side validation will cover required fields, positive weight values, valid dates, allowed record types, and appointment status. Database credentials will never be included in browser code or committed to GitHub. Demonstrations will use fictional data.

### 14. Verification and acceptance criteria

| Area | Evidence required for completion |
| --- | --- |
| Three CRUD models | Create, list/view, update, and delete each entity through the interface and REST API; changes persist after reload |
| Relationships | Every health record and appointment belongs to an existing owned pet; linked pet deletion is blocked |
| Access control | One signed-in owner cannot read or modify another owner's pets or related entries |
| Validation | Invalid and missing fields receive useful messages; failed requests do not appear successful |
| Usability | Core flows work on mobile and desktop with readable labels, clear navigation, and usable empty/error states |
| Scheduling | Rescheduled entries and upcoming/overdue indicators reflect saved dates and the selected time zone |
| Deployment | Public VM URL loads successfully and performs persistent CRUD; production process can restart |

Repeat the three usability tasks from the presentation and add editing/deleting a record and rescheduling an appointment. Record the actual participant count, completion observations, navigation mistakes, and feedback. Compare recurring problems with the original qualitative feedback without inventing baseline scores or success rates.

### 15. Risks and mitigations

- **Too many prototype features:** freeze the three-entity CRUD scope first; add future features only after the core passes verification.
- **Prototype/implementation mismatch:** document owner-managed appointments and deferred chat explicitly in the submitted proposal.
- **Data loss or broken links:** confirm deletes, enforce pet relationships, and keep a tested database backup procedure.
- **Late deployment issues:** test the VM and database connection early, then verify the final public URL before submission.
- **Originality and reuse:** implement original course code. Credit the earlier design/research and confirm its reuse fits the course conditions; do not fork or modify an unrelated existing application as the submission.

<!-- pagebreak -->

### 16. Proposed implementation plan

The assignment mentions 20 expected contribution hours. The allocation below is an initial 20-hour implementation estimate, not a claim of completed work or a reduction in scope for a smaller team. Confirm whether the instructor expects that effort per student and adjust the calendar to the actual semester deadline.

| Phase | Planned work | Hours |
| --- | --- | --- |
| Scope and design | Confirm proposal/team, model relationships, and required screen changes | 2 |
| Foundation | Next.js setup, MongoDB connection, authentication, ownership checks | 3 |
| Core API | Implement and verify the three CRUD resources and validation | 5 |
| Interface | Dashboard, forms, detail pages, records, and appointment schedule | 5 |
| Quality | Integration checks, usability review, and corrections | 2 |
| Delivery | VM deployment, README/screenshots, and demonstration recording | 3 |
| Total | Reassess if new integrations or major features are added | 20 |

### 17. Deliverables and course alignment

| Assessment | Planned deliverable | Marks |
| --- | --- | --- |
| Proposal | Topic, scope, team, research basis, models, and implementation plan submitted through the required form | 10 |
| Repository and README | Original GitHub source; project name, member names and repository links, description, screenshots, and setup/deployment instructions | 5 |
| Complete UI | All required CRUD operations available through usable pages and forms | 5 |
| Three CRUD models | Pets, Health Records, and Appointments with working REST API and MongoDB persistence | 30 |
| Deployment | Working production URL hosted on a VM | 10 |

Final submission also includes a five-minute usage video uploaded to YouTube as Unlisted, with its URL supplied to the instructor. The video should demonstrate the three data models, including updates and deletions, using the deployed application. The repository should make individual contributions visible through commit history. The project is worth 60 marks, equivalent to 20% of the semester score.

### 18. Expected outcome

PetCare will demonstrate a complete, original pet-care management workflow: an owner creates a pet, maintains its health history, manages appointment entries, and reviews upcoming care in one responsive application. The result will provide a practical foundation for a future senior project, where verified clinic integrations, caretaker sharing, notifications, and veterinary communication can be explored separately.

### 19. Sources and items to finalize

**Sources used:** Petcare Presentation.pdf, slides 1–10 (team credits, problem statement, research summaries, competitive analysis, affinity/persona/journey, priorities, wireflow, prototype, usability feedback, and improvements); the six supplied prototype screenshots; and the two supplied course-instruction screenshots. Research and competitor statements above are attributed to the team's presentation. Architecture, detailed CRUD rules, acceptance criteria, and implementation estimates are proposal additions.

**Design reference:** [PetCare Figma project](https://www.figma.com/design/d9EoLghhQjqxWGVlRj5DxT/final-project?node-id=3442-3669). The live file could not be inspected through the web reader during drafting. Screen and flow descriptions are based on the supplied screenshots and presentation rather than a verified interactive walkthrough.

**Before submission:** add the confirmed members' GitHub links and course repository URL; confirm the actual proposal/final dates and proposed responsibility split; and ensure the submitted scope explicitly states owner-managed appointment entries and deferred live chat. If the instructor requires actual clinic booking or other original prototype features, revise the scope and schedule before committing to them.
