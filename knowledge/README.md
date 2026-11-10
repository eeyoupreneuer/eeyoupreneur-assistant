# Resource library

Everything in this folder is read by the assistant. This file is ignored.

## Adding documents
- Drop in **PDF**, **Word (.docx)**, **.txt** or **.md** files. Subfolders are fine (e.g. `funding/`, `communities/`).
- Use clear file names. The assistant cites them by name: `CEAF-program-guide-2026.pdf` beats `scan0042.pdf`.
- Files or folders starting with `_` are skipped. Use that for drafts.
- **Scanned PDFs** (photos of pages) have no readable text and get skipped. The build will tell you. Retype the key parts into a .md file instead.

## Tips for good answers
- Short, focused documents beat long ones. A 2-page program summary is more useful than a 90-page annual report.
- Put the date at the top of each document: "Last checked: November 2026".
- Remove anything private: client names, personal info, internal numbers.
- Copy `_TEMPLATE-program.md` to write quick summaries of programs.

After adding or changing files, redeploy (see main README).
