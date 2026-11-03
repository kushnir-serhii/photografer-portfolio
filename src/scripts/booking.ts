// Booking flow: package and date prefill of the brief form from the URL.
// Wired from site.ts on astro:page-load; everything here lives inside <main>, so it runs again per page.

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Parses yyyy-mm-dd into a UTC date; null when malformed or not a real calendar day (2027-02-30). */
export function parseIsoDate(value: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  const real = date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
  return real ? date : null;
}

/** "12 June 2027" for an ISO date, or null when the date is invalid. */
export function formatDate(iso: string | null | undefined): string | null {
  const date = parseIsoDate(iso);
  return date ? dateFormat.format(date) : null;
}

function setParam(name: string, value: string | null) {
  const url = new URL(location.href);
  if (value) url.searchParams.set(name, value);
  else url.searchParams.delete(name);
  history.replaceState(history.state, '', url);
}

export function initBooking() {
  document.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
    const select = form.querySelector<HTMLSelectElement>('[data-plan-select]');
    const dateInput = form.querySelector<HTMLInputElement>('input[name="preferred_date"]');
    const choice = form.querySelector<HTMLElement>('[data-plan-choice]');
    const choiceText = form.querySelector<HTMLElement>('[data-plan-choice-text]');
    const change = form.querySelector<HTMLButtonElement>('[data-plan-change]');
    const params = new URLSearchParams(location.search);

    if (select) {
      const options = Array.from(select.options);

      const showChoice = () => {
        const text = select.selectedOptions[0]?.dataset.choice;
        if (choice && choiceText) {
          choiceText.textContent = text ?? '';
          choice.hidden = !text;
        }
      };

      // ?plan=full-day preselects that package. Unknown ids are ignored.
      const wanted = params.get('plan');
      const match = wanted ? options.find((o) => o.dataset.plan === wanted) : undefined;
      if (match && match.dataset.plan) select.value = match.value;
      showChoice();

      select.addEventListener('change', () => {
        setParam('plan', select.selectedOptions[0]?.dataset.plan || null);
        showChoice();
      });
      change?.addEventListener('click', () => select.focus());
      // form.reset() after a sent brief puts the select back to "Not sure yet"; the reset fires before
      // the fields change, so sync the line on the next tick.
      form.addEventListener('reset', () => setTimeout(() => {
        setParam('plan', null);
        showChoice();
      }));
    }

    if (dateInput) {
      // ?date=2027-06-12 fills the field as "12 June 2027". Invalid dates are ignored.
      const readable = formatDate(params.get('date'));
      if (readable && !dateInput.value) dateInput.value = readable;
      // A hand-typed date is free text, so it no longer matches ?date=.
      dateInput.addEventListener('input', () => setParam('date', null));
    }
  });
}
