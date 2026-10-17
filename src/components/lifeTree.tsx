import { useState } from "react";
import { allChoices, randomLife, SIZE } from "../utils/lifeTree";
import "./css/lifeTree.css";

const choices = allChoices();

type LifeTreeProps = {
    onFinish?: () => void;
};

// A faint decision tree with one random life drawing itself across it, then calling onFinish (if given)
export const LifeTree = ({ onFinish }: LifeTreeProps) => {
    const [life] = useState(randomLife);
    return (
        <svg className="life-tree" viewBox={`-10 -10 ${SIZE + 20} ${SIZE + 20}`}>
            {choices.map((path) => <path key={path} className="choice" d={path} />)}
            <path className="life" d={life} pathLength={1} onAnimationEnd={onFinish} />
            <circle className="start" cx={0} cy={SIZE / 2} r={7} />
        </svg>
    );
};
