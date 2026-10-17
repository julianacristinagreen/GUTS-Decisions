import "./stats.css";
import {ProgressBar} from "../progress-bar/progressBar";

type Stats = {
    happiness: number;
    wealth: number;
    health: number;
    social: number;
    energy: number;
};

type StatsProps = {
    stats: Stats;
};

export default function Stats({ stats }: StatsProps) {
 const stat_values = {
    Health: stats.health,
    Wealth: stats.wealth,
    Energy: stats.energy,
    Happiness: stats.happiness,
    Social: stats.social,
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