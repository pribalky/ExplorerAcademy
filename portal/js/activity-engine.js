// activity-engine.js — Renders a mission's activities.
//
// A single generic Activity Card covers every activity type — there are
// no activity-type-specific renderers yet (Reading vs. Experiment vs.
// Mathematics), per this milestone's scope. Only required Activity fields
// (docs/50-content/504_JSON_SCHEMA.md) are rendered.
//
// "parentNotes" is deliberately never rendered here: Parent Guide content
// must stay hidden from the learner-facing interface (ADR-006, Hidden
// Parent Mode).
//
// Text is set via textContent/DOM construction, never innerHTML, since
// activity content is authored campaign data, not trusted markup.

function buildActivityCard(activity) {
  const card = document.createElement('article');
  card.className = 'activity-card';

  const heading = document.createElement('h4');
  heading.textContent = activity.title;
  card.appendChild(heading);

  const meta = document.createElement('dl');
  const addRow = (term, value) => {
    const dt = document.createElement('dt');
    dt.textContent = term;
    const dd = document.createElement('dd');
    dd.textContent = String(value);
    meta.append(dt, dd);
  };
  addRow('Type', activity.type);
  addRow('Category', activity.schedulerCategory);
  addRow('Duration', activity.duration);
  addRow('Difficulty', activity.difficulty);
  card.appendChild(meta);

  const story = document.createElement('p');
  story.textContent = activity.storyContext;
  card.appendChild(story);

  const instructions = document.createElement('p');
  instructions.textContent = activity.instructions;
  card.appendChild(instructions);

  const output = document.createElement('p');
  output.textContent = `Expected output: ${activity.output}`;
  card.appendChild(output);

  return card;
}

export function renderActivities(container, activities) {
  container.innerHTML = '';

  if (!Array.isArray(activities) || activities.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No activities yet for this mission.';
    container.appendChild(empty);
    return;
  }

  activities.forEach((activity) => {
    container.appendChild(buildActivityCard(activity));
  });
}
