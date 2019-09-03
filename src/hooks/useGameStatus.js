import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = rowsCleared => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    const linePoints = [40, 100, 300, 1200]; // How many points you get for clearing a row ex: 40 for one row, 100 for 2 rows, etc...

    const calcScore = useCallback(() => {
        // Check if we have a score
        if (rowsCleared > 0) {
            // This is how the original tetris score is calculated
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
            setRows(prev => prev + rowsCleared);
        }
    }, [level, linePoints, rowsCleared]); // this will always change if one of these three are effected, otherwise the function stays the same therefore preventing an infinity loop

    useEffect(() => {
        calcScore();
    }, [calcScore, rowsCleared, score]);

    return [score, setScore, rows, setRows, level, setLevel]; // you want to reset everything back to 0 when you start a new game
}