import "./css/stats.css";
import {ProgressBar} from "./progressBar";

export default function Stats() {
  let health = 0;
  let wealth = 10;
  let energy = 20;
  let happiness = 50;
  let social = 80;
  let intelligence = 60;

 const stat_values = {
    Health: health,
    Wealth: wealth,
    Energy: energy,
    Happiness: happiness,
    Social: social,
    Intelligence: intelligence
  };

  function display_stats() {
  return Object.entries(stat_values).map(([stat, value]) => (
      <p key={stat}>
      {<ProgressBar
    currentValue={value}
    label={stat}
    maxValue={100}
/>}
      </p>
    ));
  }

  return (
    <div className="statsBox">
      <h2>STATS</h2>
      <div className="statsRow">
        {display_stats()}
      </div>
    </div>
  );
}