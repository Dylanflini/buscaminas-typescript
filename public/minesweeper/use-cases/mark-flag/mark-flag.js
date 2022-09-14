/**
 * Mark flag in board
 */
export const markFlagUseCase = (props) => {
    return {
        id: "111-222-333",
        flag_available: 10,
        bombs_available: 10,
        rows: 10,
        columns: 10,
        bombs: [{ position: [0, 0] }],
        cells: [{ position: [0, 0], exposed: false }],
        neighBorsBombsCounter: [{ position: [0, 0], quantity: 5 }],
        flags: [props],
    };
};
