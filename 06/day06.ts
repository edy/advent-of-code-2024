import { assertEquals } from '@std/assert/equals';
import { loadPuzzle } from '../loadPuzzle.ts';
const PUZZLE_INPUT = await loadPuzzle(6);

const EXAMPLE_INPUT: string = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim();

type Position = { x: number; y: number };
const LEFT: Position = { x: -1, y: 0 };
const RIGHT: Position = { x: 1, y: 0 };
const UP: Position = { x: 0, y: -1 };
const DOWN: Position = { x: 0, y: 1 };

const DIRECTIONS: Position[] = [UP, RIGHT, DOWN, LEFT];

function getMap(input: string): { map: string[][]; startPosition: Position } {
	let startPosition: Position = { x: 0, y: 0 };
	const map = input.split('\n').map((line, y) => {
		const row = line.split('');
		const start = row.findIndex((cell) => cell === '^');
		if (start !== -1) {
			startPosition = { x: start, y };
		}
		return row;
	});

	return { map, startPosition };
}

function move(position: Position, direction: Position): Position {
	return { x: position.x + direction.x, y: position.y + direction.y };
}

function positionIsInMap(position: Position, map: string[][]): boolean {
	return position.y >= 0 && position.y < map.length && position.x >= 0 && position.x < map[0].length;
}

function addToHistory(position: Position, direction: Position = { x: 0, y: 0 }, stepHistory: Set<string>) {
	const key = `${position.x},${position.y},${direction.y},${direction.x}`;
	if (!stepHistory.has(key)) {
		stepHistory.add(key);
		return true;
	}

	return false;
}

function printMap(map: string[][], position: Position, stepHistory: Set<string>) {
	const localMap = map.map((row) => [...row]);
	console.log('------------------------------');
	if (positionIsInMap(position, map)) {
		// add history data to local map
		stepHistory.forEach((key) => {
			const [x, y] = key.split(',').map(Number);
			localMap[y][x] = 'o';
		});
		localMap[position.y][position.x] = 'X';
		console.log(localMap.map((row) => row.join('')).join('\n'));
	} else {
		console.log('position is outside map');
	}
}

function countSteps(input: string) {
	const stepHistory = new Set<string>();
	const { map, startPosition } = getMap(input);

	let currentPosition: Position = startPosition;
	let currentDirectionIndex = 0;

	addToHistory(currentPosition, undefined, stepHistory);
	printMap(map, currentPosition, stepHistory);

	while (positionIsInMap(currentPosition, map)) {
		let nextPosition = move(currentPosition, DIRECTIONS[currentDirectionIndex]);

		if (positionIsInMap(nextPosition, map) && map[nextPosition.y][nextPosition.x] === '#') {
			currentDirectionIndex = (currentDirectionIndex + 1) % 4; // Turn right
			nextPosition = move(currentPosition, DIRECTIONS[currentDirectionIndex]);
		}

		const lastPosition = currentPosition;
		currentPosition = nextPosition;

		positionIsInMap(currentPosition, map)
			? addToHistory(currentPosition, undefined, stepHistory)
			: printMap(map, lastPosition, stepHistory);
	}

	return stepHistory.size;
}

function countObstructions(input: string) {
	const { map, startPosition } = getMap(input);
	let detectedLoops = 0;

	// loop through each cell in map
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === '#') {
				continue;
			}

			const stepHistory = new Set<string>();

			const newMap = map.map((row) => [...row]);
			newMap[y][x] = '#';

			let currentPosition: Position = startPosition;
			let currentDirectionIndex = 0;

			addToHistory(currentPosition, DIRECTIONS[currentDirectionIndex], stepHistory);

			while (
				currentPosition.y > 0 &&
				currentPosition.y < newMap.length - 1 &&
				currentPosition.x > 0 &&
				currentPosition.x < newMap[0].length - 1
			) {
				let nextPosition = move(currentPosition, DIRECTIONS[currentDirectionIndex]);

				if (newMap[nextPosition.y][nextPosition.x] === '#') {
					currentDirectionIndex = (currentDirectionIndex + 1) % 4; // Turn right
					nextPosition = move(currentPosition, DIRECTIONS[currentDirectionIndex]);
				}

				currentPosition = nextPosition;

				const wasAdded = addToHistory(currentPosition, DIRECTIONS[currentDirectionIndex], stepHistory);
				if (!wasAdded) {
					detectedLoops++;
					break;
				}
			}
		}
	}

	return detectedLoops;
}

Deno.test('example input 1', () => assertEquals(countSteps(EXAMPLE_INPUT), 41));
Deno.test('puzzle input 1', () => assertEquals(countSteps(PUZZLE_INPUT), 4973));
Deno.test('example input 2', () => assertEquals(countObstructions(EXAMPLE_INPUT), 6));
Deno.test('puzzle input 2', () => assertEquals(countObstructions(PUZZLE_INPUT), 1482));
