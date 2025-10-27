\# Software Requirements Specification (SRS) for Consolidated Telephone
Directory Application

1\. Document Information

SRS Version: 1.1

Date: August 18, 2025

Prepared by: Denovo Project Manager

Project Name: Consolidated Telephone Directory App

Objective: This updated SRS incorporates additional requirements for
single and multiple record delete, modify, and save functionalities, as
identified in user feedback. It outlines the functional and
non-functional requirements for developing a cross-platform directory
application based on user-provided specifications. The application will
manage and search a consolidated telephone directory dataset, supporting
web, Android mobile, and iOS platforms. It incorporates user roles, data
management features, and search capabilities. To align with ACTREC
oncology projects and dementia research, the application is designed to
facilitate quick access to expert contacts (e.g., researchers in medical
administration or biomedical departments) for collaborative
bioinformatics efforts, such as protein structure analysis in cancer
drug discovery or neurodegenerative disease modeling. Patentable ideas,
like integrating AI-driven semantic search for bioinformatics profiles
(e.g., linking contacts to protein databases like PDB for oncology
targets), and learning plans (e.g., tutorials on using the app for
querying dementia-related lab contacts) will be stored in a dedicated
\"Bioinformatics Extension\" module for future enhancements.

2\. Scope

\- In Scope:

\- User authentication with two profiles: Admin and Regular.

\- Role-based access: Regular users limited to search and password
change; Admin users have full CRUD operations, including single/multiple
record add/modify/delete/save, bulk CSV operations, and bioinformatics
extension management.

\- Search functionality across all fields (Name, Department,
Designation, Phone Number, Extension, Email, Location, Institution).

\- Data management: Single/multiple record add/modify/delete/save, bulk
upload/download/delete via CSV, duplicate handling with feedback.

\- Password change functionality.

\- Bioinformatics alignment: Admin module to store patentable ideas
(e.g., \"AI-driven semantic search linking contacts to UniProt for
dementia drug discovery\") and learning plans (e.g., \"Step-by-step
guide: Query \'Designation: Doctor\' for oncology protein analysis
collaboration\").

\- Out of Scope:

\- Real-time notifications or advanced analytics.

\- Integration with external telephony systems or bioinformatics
databases (e.g., PDB, AlphaFold) in initial release, though planned for
modular addition.

\- Assumptions:

\- Users have valid credentials.

\- CSV files follow the specified header format: Name, Department,
Designation, Phone Number, Extension, Email, Location, Institution.

\- Backend database is pre-populated with initial CSV data.

\- Dependencies:

\- Open-source libraries for CSV handling (e.g., PapaParse for JS,
fast-csv for Node.js).

\- Cloud-hosted database (e.g., PostgreSQL via Supabase).

3\. Requirements

3.1 Functional Requirements

Authentication

\- FR1.1: System shall support two user profiles: Admin and Regular.

\- FR1.2: Provide a login screen with username and password fields.

\- FR1.3: Upon successful login, redirect to role-specific dashboard
(search for Regular; management for Admin).

\- FR1.4: Provide a password change screen accessible post-login,
requiring old password verification.

\- FR1.5: Include logout functionality.

Search Functionality (Available to All Users)

\- FR2.1: Enable search across any field: Name, Department, Designation,
Phone Number, Extension, Email, Location, Institution.

\- FR2.2: Support partial, case-insensitive matches.

\- FR2.3: Display search results in a list/table with all fields,
sortable by columns.

\- FR2.4: Implement pagination for large result sets.

\- FR2.5: For bioinformatics alignment, include optional advanced search
filters (e.g., \"Department: JusSAWALA SHODHIKA (JS)\" for oncology
labs).

Admin Data Management

\- FR3.1: Provide a screen to add new records with form inputs for all
fields; validate inputs (e.g., unique Extension/Email).

\- FR3.2: Provide a screen to modify single records: Search/select
record, edit fields, save changes.

\- FR3.3: Provide a screen to delete single records with confirmation.

\- FR3.4: Provide a screen to upload bulk contacts via CSV, parsing
file, inserting non-duplicates, and displaying a message with skipped
duplicates (e.g., \"Duplicate found for Extension 5042: DR. PRASHANT
BHAT\").

\- FR3.5: Restrict duplicates based on unique keys (Extension + Email
combination).

\- FR3.6: Provide a screen to download bulk contacts, exporting all or
current search results as CSV.

\- FR3.7: Provide a screen to delete multiple records: Select records or
upload CSV of IDs, confirm deletion.

\- FR3.8: Provide a screen to modify multiple records: Select records,
edit common fields (e.g., department, location), save changes in batch.

\- FR3.9: Provide a bioinformatics extension module for admins to
add/view patentable ideas (e.g., \"Integrate directory with AlphaFold
for protein structure predictions in oncology drug discovery\") and
learning plans (e.g., \"1. Search \'Department: IT\' for dementia data
analysts; 2. Contact for joint protein analysis sessions\").

Error Handling and Feedback

\- FR4.1: Display user-friendly messages for duplicates, invalid logins,
and other errors.

\- FR4.2: Log errors for admin review.

3.2 Non-Functional Requirements

Performance

\- NFR1.1: Ensure search response time \<2 seconds for datasets up to
10,000 records.

\- NFR1.2: Support bulk operations (CSV upload/download) for files up to
5MB.

Security

\- NFR2.1: Implement password hashing (e.g., bcrypt).

\- NFR2.2: Enforce role-based access control.

\- NFR2.3: Protect against SQL injection and XSS attacks.

Usability

\- NFR3.1: Provide intuitive UI: Responsive design for web,
touch-friendly for mobile/iOS.

\- NFR3.2: Ensure WCAG 2.1 compliance (e.g., alt text, keyboard
navigation).

Reliability

\- NFR4.1: Implement automated daily data backups.

\- NFR4.2: Achieve 99% uptime.

Scalability

\- NFR5.1: Support 100+ concurrent users.

\- NFR5.2: Use a cloud-scalable backend.

Maintainability

\- NFR6.1: Develop modular code with comprehensive documentation.

\- NFR6.2: Use version control (e.g., Git).

3.3 Interface Requirements

User Interfaces

\- UI1.1: Login Screen: Username/password fields; \"Forgot Password\"
link (future).

\- UI1.2: Dashboard: Search bar at top; results below.

\- UI1.3: Admin Screens: Tabs for Add/Modify (single/multiple)/Delete
(single/multiple)/Upload/Download/Bioinformatics Extension.

\- UI1.4: Password Change Screen: Fields for old/new/confirm password.

\- UI1.5: Mobile/iOS Specific: Bottom navigation bar; swipe gestures.

\- UI1.6: Web Specific: Responsive layout for desktops.

Hardware Interfaces

\- HI1.1: None specific; use standard device inputs.

Software Interfaces

\- SI1.1: Backend API: RESTful endpoints (e.g., /search, /upload-csv,
/modify-multiple).

\- SI1.2: Database: SQL queries for CRUD operations.

Communication Interfaces

\- CI1.1: Use HTTPS for all data transfers.

4\. Supporting Information

4.1 Sample Data Integration

Use provided sample for testing:

\- Name: DR. PRASHANT BHAT, Department: Medical Administration,
Designation: Doctor, Phone Number: -7671, Extension: 5042, Email:
prashant.bhat@actrec.gov.in, Location: Second Floor, Institution: ACTREC

\- Name: MRS. PRAGATI, Department: Medical Administration, Designation:
MS Office, Phone Number: -7671, Extension: 5674, Email:
pragati@actrec.gov.in, Location: Second Floor, Institution: ACTREC

\- Ensure CSV headers match exactly.

4.2 Bioinformatics Alignment and Storage

\- Patentable Ideas Storage: Admin-only section to log ideas, e.g.,
\"Integrate directory with AlphaFold for protein structure predictions
in oncology drug discovery.\"

\- Learning Plans: In-app resources, e.g., \"Step 1: Search
\'Department: IT\' for dementia data analysts; Step 2: Contact for joint
protein analysis sessions.\"

4.3 Appendices

\- Data Model: Entity-Relationship diagram (Users table linked to
Directory table).

\- Use Cases: Diagrams for login, search, bulk upload, single/multiple
modify/delete.

This SRS provides a complete blueprint for development. For revisions,
contact the preparer.

\*\*Instructions for Copying to Word Document:\*\*

1\. Copy the entire text above starting from \"# Software Requirements
Specification\" to the end.

2\. Open Microsoft Word or any compatible word processor (e.g., Google
Docs).

3\. Paste the text into a new document.

4\. To preserve formatting, set the font to a monospaced style like
\"Courier New\" or use Word's \"Keep Source Formatting\" option.

5\. Save the document as
\"Updated_Software_Requirements_Specification.docx\" or export as a PDF
for sharing.

6\. For better readability, you can adjust headings (e.g., use Word's
Heading 1 for sections, Heading 2 for subsections) and apply numbering
styles to match the structure.

This format aligns with the test plan structure you provided, ensuring
consistency and ease of use for development aligned with ACTREC oncology
and dementia research goals.
