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
    previewEffect: Partial<Stats> | null; 
};

export default function Stats({ stats, previewEffect }: StatsProps) {
 const stat_values = {
    Health: stats.health,
    Wealth: stats.wealth,
    Energy: stats.energy,
    Happiness: stats.happiness,
    Social: stats.social,
  };

  const preview_values = {
      Health: stats.health + (previewEffect?.health ?? 0),
      Wealth: stats.wealth + (previewEffect?.wealth ?? 0),
      Energy: stats.energy + (previewEffect?.energy ?? 0),
      Happiness: stats.happiness + (previewEffect?.happiness ?? 0),
      Social: stats.social + (previewEffect?.social ?? 0),
  };

  function display_stats() {
  return Object.entries(stat_values).map(([stat, value]) => (
      <p key={stat}>
      {<ProgressBar currentValue={value} label={stat} maxValue={100} 
          previewValue={Math.max(0, Math.min(100, preview_values[stat as keyof typeof preview_values]))}
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