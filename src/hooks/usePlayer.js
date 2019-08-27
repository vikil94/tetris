import { useState, useCallback } from 'react';

import { randomTetromino } from '../tetrominos';
import { STAGE_WIDTH } from '../gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0},                                    // This is the initial state of the player
        tetromino: randomTetromino().shape,
        collided: false,
    });

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y)}, // setting the state with the new x and y values and collided value
            collided,
        }));
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false,
        })
    }, []);

    return [player, updatePlayerPos, resetPlayer];
}