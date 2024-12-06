import { join } from 'jsr:@std/path';
import { assertEquals } from '@std/assert/equals';
const PUZZLE_INPUT = await Deno.readTextFile(join(import.meta.dirname as string, './input.txt'));

const EXAMPLE_INPUT: string = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`.trim();

const parseInput = (input: string): string[][] => input.split('\n').map((line) => line.split(''));

const isHorizontallyXMAS = (input: string[][], i: number, j: number) =>
	(input[i][j] === 'X' && input[i][j + 1] === 'M' && input[i][j + 2] === 'A' && input[i][j + 3] === 'S') ||
	(input[i][j + 3] === 'X' && input[i][j + 2] === 'M' && input[i][j + 1] === 'A' && input[i][j] === 'S');

const isVerticallyXMAS = (input: string[][], i: number, j: number) =>
	input[i + 3] &&
	((input[i][j] === 'X' && input[i + 1][j] === 'M' && input[i + 2][j] === 'A' && input[i + 3][j] === 'S') ||
		(input[i][j] === 'S' && input[i + 1][j] === 'A' && input[i + 2][j] === 'M' && input[i + 3][j] === 'X'));

const isCross1XMAS = (input: string[][], i: number, j: number) =>
	input[i + 3] &&
	((input[i][j] === 'X' &&
		input[i + 1][j + 1] === 'M' &&
		input[i + 2][j + 2] === 'A' &&
		input[i + 3][j + 3] === 'S') ||
		(input[i][j] === 'S' &&
			input[i + 1][j + 1] === 'A' &&
			input[i + 2][j + 2] === 'M' &&
			input[i + 3][j + 3] === 'X'));

const isCross2XMAS = (input: string[][], i: number, j: number) =>
	input[i + 3] &&
	((input[i + 3][j] === 'X' &&
		input[i + 2][j + 1] === 'M' &&
		input[i + 1][j + 2] === 'A' &&
		input[i][j + 3] === 'S') ||
		(input[i + 3][j] === 'S' &&
			input[i + 2][j + 1] === 'A' &&
			input[i + 1][j + 2] === 'M' &&
			input[i][j + 3] === 'X'));

const isXMAS = (input: string[][], i: number, j: number) =>
	input[i + 2] &&
	((input[i][j] === 'M' && input[i + 1][j + 1] === 'A' && input[i + 2][j + 2] === 'S') ||
		(input[i][j] === 'S' && input[i + 1][j + 1] === 'A' && input[i + 2][j + 2] === 'M')) &&
	((input[i + 2][j] === 'M' && input[i + 1][j + 1] === 'A' && input[i][j + 2] === 'S') ||
		(input[i + 2][j] === 'S' && input[i + 1][j + 1] === 'A' && input[i][j + 2] === 'M'));

const countXmas = (input: string) => {
	const parsedInput = parseInput(input);

	let counter = 0;
	for (let i = 0; i < parsedInput.length; i++) {
		for (let j = 0; j < parsedInput[i].length; j++) {
			if (isHorizontallyXMAS(parsedInput, i, j)) {
				counter++;
			}
			if (isVerticallyXMAS(parsedInput, i, j)) {
				counter++;
			}
			if (isCross1XMAS(parsedInput, i, j)) {
				counter++;
			}
			if (isCross2XMAS(parsedInput, i, j)) {
				counter++;
			}
		}
	}
	return counter;
}

const countMAS = (input: string) => {
	const parsedInput = parseInput(input);
	let counter = 0;
	for (let i = 0; i < parsedInput.length; i++) {
		for (let j = 0; j < parsedInput[i].length; j++) {
			if (isXMAS(parsedInput, i, j)) {
				counter++;
			}
		}
	}
	return counter;
}

Deno.test('example input 1', () => assertEquals(countXmas(EXAMPLE_INPUT), 18));
Deno.test('puzzle input 1', () => assertEquals(countXmas(PUZZLE_INPUT), 2554));
Deno.test('example input 2', () => assertEquals(countMAS(EXAMPLE_INPUT), 9));
Deno.test('puzzle input 2', () => assertEquals(countMAS(PUZZLE_INPUT), 1916));
