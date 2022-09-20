import { IPosition } from '@minesweeper/domain/models';
import { getAdjacentVertex } from './graphs';

describe('getAdjacentVertex', () => {
  it('should get adjacent vertex', () => {
    const graph: IPosition[] = [
      { position: [0, 0] },
      { position: [1, 0] },
      { position: [2, 0] },
      { position: [0, 1] },
      { position: [1, 1] },
      { position: [2, 1] },
      { position: [0, 2] },
      { position: [1, 2] },
      { position: [2, 2] },
    ];

    const selected: IPosition = {
      position: [0, 0],
    };

    const expectedGraph = [
      { position: [0, 0] },
      { position: [1, 0] },
      { position: [0, 1] },
      { position: [1, 1] },
    ];

    expect(getAdjacentVertex(graph, selected)).toStrictEqual(expectedGraph);
  });
});
