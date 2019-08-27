import { useState } from 'react';
import { createStage } from '../gameHelpers';


export const useStage = () => {
    const [stage, setStage] = useState(createStage()); // generates the initial stage for the game

    return [stage, setStage];
}