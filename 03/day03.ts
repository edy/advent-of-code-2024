import { join } from 'jsr:@std/path';
import { assertEquals } from 'jsr:@std/assert';

const PUZZLE_INPUT = await Deno.readTextFile(join(import.meta.dirname as string, './input.txt'));

const EXAMPLE_INPUT: string = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const EXAMPLE_INPUT2: string = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

function multiplyInput(input: string): number {
	const mults: string[] = input.match(/mul\(\d{1,3},\d{1,3}\)/g) || [];
	return mults
		.map((mult: string) => {
			if (mult === null) {
				return 0;
			}
			const [_x, a, b] = (mult.match(/mul\((\d{1,3}),(\d{1,3})\)/) || [0, 0]).map(Number);
			return a * b;
		})
		.reduce((acc, cur) => acc + cur, 0);
}

function multiplyInputWithDosAndDonts(input: string) {
	const matches = input.match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g) || [];
	let sum = 0;
	let shouldMultiply = true;
	for (let i = 0; i < matches.length; i++) {
		if (matches[i] === 'do()') {
			shouldMultiply = true;
		} else if (matches[i] === "don't()") {
			shouldMultiply = false;
		} else if (shouldMultiply) {
			sum += multiplyInput(matches[i]);
		}
	}

	return sum;
}

Deno.test('example input 1', () => {
	assertEquals(multiplyInput(EXAMPLE_INPUT), 161);
});

Deno.test('puzzle input 1', () => {
	assertEquals(multiplyInput(PUZZLE_INPUT), 156388521);
});

Deno.test('example input 2', () => {
	assertEquals(multiplyInputWithDosAndDonts(EXAMPLE_INPUT2), 48);
});

Deno.test('puzzle input 2', () => {
	assertEquals(multiplyInputWithDosAndDonts(PUZZLE_INPUT), 75920122);
});
