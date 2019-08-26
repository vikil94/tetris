import React from 'react';
import { createStage } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris, StyledTetrisWraper } from './styles/StyledTetris'

//Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {




    return (
        <StyledTetrisWraper>
            <StyledTetris>
                <Stage stage={createStage()} />
                <aside>
                    <div>
                        <Display text="Score" />
                        <Display text = "Rows" />
                        <Display text = "Level" />
                    </div>
                    <StartButton />
                </aside>
            </StyledTetris>
        </StyledTetrisWraper>
    );
};

export default Tetris;