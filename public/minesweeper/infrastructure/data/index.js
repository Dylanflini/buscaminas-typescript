export const dataRepository = {
    saveGameBoard: async () => {
        return {
            cells: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ],
            totalMines: 4,
            remainingMines: 4,
            hasWonGame: false,
            hasLostGame: false,
        };
    },
};
