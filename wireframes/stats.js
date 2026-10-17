// Renders stat bars and the hover preview for choice buttons.
// Placeholder data only. Values are 0-100.

const STAT_NAMES = ["Health", "Wealth", "Energy", "Happiness", "Social", "Intelligence"];

function renderStats(container, values) {
  container.innerHTML = STAT_NAMES.map((name) => `
    <div class="stat" data-stat="${name}">
      <div class="stat-head">
        <span class="stat-name">${name}</span>
        <span class="stat-delta"></span>
        <span class="stat-value">${values[name]}</span>
      </div>
      <div class="bar">
        <div class="bar-fill" style="width:${values[name]}%"></div>
        <div class="bar-delta" style="opacity:0"></div>
      </div>
    </div>`).join("");
}

// Show `deltas` on the bars. Gains add a green segment after the current value;
// losses mark the part that would be removed in striped red.
function showDeltas(container, values, deltas) {
  for (const name of STAT_NAMES) {
    const row = container.querySelector(`[data-stat="${name}"]`);
    const seg = row.querySelector(".bar-delta");
    const label = row.querySelector(".stat-delta");
    const current = values[name];
    const delta = deltas?.[name] ?? 0;
    const next = Math.max(0, Math.min(100, current + delta));

    seg.className = "bar-delta";
    label.className = "stat-delta";
    label.textContent = "";

    if (next === current) {
      seg.style.opacity = 0;
      continue;
    }

    const kind = next > current ? "gain" : "loss";
    seg.classList.add(kind);
    label.classList.add(kind);
    seg.style.left = `${Math.min(current, next)}%`;
    seg.style.width = `${Math.abs(next - current)}%`;
    seg.style.opacity = 1;
    label.textContent = delta > 0 ? `+${delta}` : `${delta}`;
  }
}

// Wire up hover/focus preview on every button with a data-effects attribute.
function bindPreview(container, values) {
  document.querySelectorAll("[data-effects]").forEach((btn) => {
    const deltas = JSON.parse(btn.dataset.effects);
    const on = () => showDeltas(container, values, deltas);
    const off = () => showDeltas(container, values, null);
    btn.addEventListener("mouseenter", on);
    btn.addEventListener("focus", on);
    btn.addEventListener("mouseleave", off);
    btn.addEventListener("blur", off);
  });
}
