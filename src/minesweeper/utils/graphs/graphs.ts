import { IPosition } from '@minesweeper/domain/models';
import { getPosition, hasSamePosition } from '../position/position';

/**
 * Graph Vertex Edge
 */
export const getAdjacentVertex = (graph: IPosition[], selected: IPosition): IPosition[] => {
  const [selectedX, selectedY] = selected.position;

  const adjacentVertexIndex = [
    [-1, -1],
    [-1, 0],
    [-1, 1],

    [0, -1],
    [0, 0],
    [0, 1],

    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const possiblePositions: IPosition[] = adjacentVertexIndex.map(([x, y]) =>
    getPosition(selectedX + x, selectedY + y),
  );

  const adjacentVertex = graph.filter(vertex =>
    possiblePositions.some(item => hasSamePosition(item, vertex)),
  );

  return adjacentVertex;
};
