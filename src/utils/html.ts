// html.ts
// Email HTML generators for course registration & class cancellation
// Exports:
//   - courseRegistrationEmail(student, course, opts?) => { subject, html, text }
//   - classCancellationEmail(student, course, session, opts?) => { subject, html, text }

type Student = {
  id?: string;
  name: string;
  email?: string;
  rollNo?: string | null;
};

type Course = {
  id?: string;
  name: string;
  code?: string;
  description?: string | null;
  semester?: number | null;
  year?: number | null;
  professorName?: string | null;
};

type ClassSession = {
  id?: string;
  date: string | Date;
  location?: string | null;
  isCanceled?: boolean;
  canceledAt?: string | Date | null;
  reason?: string | null;
};

type Opts = {
  academyName?: string;
  supportEmail?: string;
  baseUrl?: string;
  logoUrl?: string | null;
};

/** Helper: format date to readable local string (e.g. Apr 3, 2025 — 10:00 AM) */
function formatDate(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input;
  // Use Intl.DateTimeFormat for nicer formatting
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

/** Minimal inline styles suitable for many email clients */
const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; color:#111; }
  .container { max-width:680px; margin:24px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .header { padding:20px 24px; display:flex; align-items:center; gap:12px; border-bottom:1px solid #eef0f3; }
  .logo { width:48px; height:48px; object-fit:contain; border-radius:6px; background:#fff; }
  .hero { padding:28px 24px; }
  h1 { margin:0 0 8px 0; font-size:20px; }
  p { margin:0 0 12px 0; line-height:1.5; color:#41464b; }
  .meta { background:#f7f9fb; padding:12px; border-radius:6px; font-size:14px; color:#394047; margin:12px 0; }
  .btn { display:inline-block; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; border:1px solid transparent; }
  .btn-primary { background:#0b69ff; color:#fff; }
  .muted { color:#6b7176; font-size:13px; }
  .footer { padding:16px 24px; font-size:12px; color:#6b7176; border-top:1px solid #eef0f3; }
  .small { font-size:13px; color:#6b7176; }
  .two-col { display:flex; gap:12px; flex-wrap:wrap; }
  .col { flex:1; min-width:160px; }
  @media (max-width:520px){ .header, .hero, .footer{ padding-left:16px; padding-right:16px } .two-col{ flex-direction:column } }
`;

/**
 * Course registration email
 */
export function courseRegistrationEmail(
  student: Student,
  course: Course,
  opts: Opts = {}
) {
  const academy = opts.academyName ?? "Your Academy";
  const support = opts.supportEmail ?? "support@example.com";
  const logo = opts.logoUrl ?? null;
  const baseUrl = opts.baseUrl ?? "#";

  const subject = `Registered: ${course.name} (${
    course.code ?? ""
  }) — ${academy}`;

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container" role="article" aria-label="Course registration notification">
      <div class="header">
        ${
          logo
            ? `<img src="${logo}" alt="${academy} logo" class="logo" />`
            : `<div style="width:48px;height:48px;border-radius:6px;background:#e6eefc;display:inline-block"></div>`
        }
        <div>
          <div class="small">${academy}</div>
          <div style="font-weight:700">${subject}</div>
        </div>
      </div>

      <div class="hero">
        <h1>You're registered — welcome aboard, ${escapeHtml(
          student.name
        )}!</h1>
        <p>You've successfully registered for the course <strong>${escapeHtml(
          course.name
        )}</strong>${course.code ? ` (${escapeHtml(course.code)})` : ""}.</p>

        <div class="meta">
          <div class="two-col">
            <div class="col">
              <div class="small">Student</div>
              <div>${escapeHtml(student.name)}${
    student.rollNo ? ` — ${escapeHtml(String(student.rollNo))}` : ""
  }</div>
            </div>
            <div class="col">
              <div class="small">Course</div>
              <div>${escapeHtml(course.name)}${
    course.code ? ` — ${escapeHtml(String(course.code))}` : ""
  }</div>
            </div>
          </div>

          <div style="margin-top:8px" class="two-col">
            <div class="col">
              <div class="small">Instructor</div>
              <div>${escapeHtml(course.professorName ?? "TBA")}</div>
            </div>
            <div class="col">
              <div class="small">Semester / Year</div>
              <div>${course.semester ?? "-"} ${
    course.year ? ` / ${course.year}` : ""
  }</div>
            </div>
          </div>
        </div>

        ${
          course.description
            ? `<p><strong>About the course:</strong> ${escapeHtml(
                course.description
              )}</p>`
            : ""
        }

        <p style="margin-top:8px">
          <a class="btn btn-primary" href="${escapeAttr(
            baseUrl
          )}" target="_blank" rel="noopener">View course</a>
          <span style="margin-left:12px" class="muted">If you didn't register for this course, contact <a href="mailto:${escapeAttr(
            support
          )}">${escapeHtml(support)}</a>.</span>
        </p>
      </div>

      <div class="footer">
        <div>${academy} • ${escapeHtml(support)}</div>
        <div style="margin-top:6px" class="muted">This is an automated message — please do not reply directly to this email.</div>
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `Hi ${student.name},

You've successfully registered for the course: ${course.name}${
    course.code ? ` (${course.code})` : ""
  }.
Instructor: ${course.professorName ?? "TBA"}
${
  course.description ? `About the course: ${course.description}\n\n` : ""
}View the course: ${baseUrl}

If you did not register for this course, contact ${support}.
-- ${academy}`;

  return { subject, html, text };
}

/**
 * Class cancellation email
 */
export function classCancellationEmail(
  student: Student,
  course: Course,
  session: ClassSession,
  opts: Opts = {}
) {
  const academy = opts.academyName ?? "Your Academy";
  const support = opts.supportEmail ?? "support@example.com";
  const logo = opts.logoUrl ?? null;
  const baseUrl = opts.baseUrl ?? "#";

  const sessionDate = formatDate(session.date);
  const subject = `Class cancelled: ${course.name} — ${sessionDate}`;

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="container" role="article" aria-label="Class cancellation notification">
      <div class="header">
        ${
          logo
            ? `<img src="${logo}" alt="${academy} logo" class="logo" />`
            : `<div style="width:48px;height:48px;border-radius:6px;background:#fff0f0;display:inline-block"></div>`
        }
        <div>
          <div class="small">${academy}</div>
          <div style="font-weight:700">Class Cancelled — ${escapeHtml(
            course.name
          )}</div>
        </div>
      </div>

      <div class="hero">
        <h1>Class cancelled on ${escapeHtml(sessionDate)}</h1>
        <p>Hi ${escapeHtml(student.name)},</p>
        <p>We regret to inform you that the scheduled class for <strong>${escapeHtml(
          course.name
        )}</strong>${
    course.code ? ` (${escapeHtml(course.code)})` : ""
  } on <strong>${escapeHtml(sessionDate)}</strong> has been cancelled.</p>

        <div class="meta">
          <div class="two-col">
            <div class="col">
              <div class="small">Course</div>
              <div>${escapeHtml(course.name)}${
    course.code ? ` — ${escapeHtml(String(course.code))}` : ""
  }</div>
            </div>
            <div class="col">
              <div class="small">Scheduled for</div>
              <div>${escapeHtml(sessionDate)}</div>
            </div>
          </div>

          ${
            session.location
              ? `<div style="margin-top:8px"><div class="small">Location</div><div>${escapeHtml(
                  session.location
                )}</div></div>`
              : ""
          }
          ${
            session.reason
              ? `<div style="margin-top:8px"><div class="small">Reason</div><div>${escapeHtml(
                  session.reason
                )}</div></div>`
              : ""
          }
        </div>

        <p style="margin-top:12px">
          <a class="btn btn-primary" href="${escapeAttr(
            baseUrl
          )}" target="_blank" rel="noopener">View course & schedule</a>
          <span style="margin-left:12px" class="muted">For concerns, contact <a href="mailto:${escapeAttr(
            support
          )}">${escapeHtml(support)}</a>.</span>
        </p>

        <p class="small" style="margin-top:12px">We apologize for the inconvenience. If this class is rescheduled, you will receive another notification.</p>
      </div>

      <div class="footer">
        <div>${academy} • ${escapeHtml(support)}</div>
        <div style="margin-top:6px" class="muted">This is an automated notification about your enrollment. Do not reply to this message.</div>
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `Hi ${student.name},

The class for ${course.name}${
    course.code ? ` (${course.code})` : ""
  } scheduled on ${sessionDate} has been cancelled.
${session.location ? `Location: ${session.location}\n` : ""}${
    session.reason ? `Reason: ${session.reason}\n\n` : ""
  }If you have questions, contact ${support}. View: ${baseUrl}

-- ${academy}`;

  return { subject, html, text };
}

/** Escape helpers for minimal safety in templates */
function escapeHtml(unsafe: any) {
  if (unsafe === null || unsafe === undefined) {
    return "";
  }
  const s = String(unsafe);
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(unsafe: any) {
  return escapeHtml(unsafe).replaceAll("\n", " ").replaceAll("\r", " ");
}
