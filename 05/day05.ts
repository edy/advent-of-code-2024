import { assertEquals } from '@std/assert/equals';
import { loadPuzzle } from '../loadPuzzle.ts';
const PUZZLE_INPUT = (await loadPuzzle(5)).trim().split('\n');

const EXAMPLE_INPUT: string[] = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`
	.trim()
	.split('\n');

const parseInput = (input: string[]) => {
	const isRule = (line: string) => line.includes('|');
	const isUpdate = (line: string) => !line.includes('|') && line.length > 0;
	const rules = input.filter(isRule).map((line) => line.split('|'));
	const updates = input.filter(isUpdate).map((line: string) => line.split(','));
	return { rules, updates };
};

function errorIsBeforOrAfter(rules: string[][], printedPage: string, update: string[], printedPageIndex: number) {
	const allowedPagesBefore = rules.filter((rule) => rule[1] === printedPage).map((rule) => rule[0]);
	const allowedPagesAfter = rules.filter((rule) => rule[0] === printedPage).map((rule) => rule[1]);

	const pagesPrintedBefore = update.slice(0, printedPageIndex);
	const pagesPrintedAfter = update.slice(printedPageIndex + 1);

	// all "printed pages before" must be in the rules "before" pages
	const errorAfter = pagesPrintedAfter.some((page) => allowedPagesBefore.includes(page));
	const errorBefore = pagesPrintedBefore.some((page) => allowedPagesAfter.includes(page));
	return { errorAfter, errorBefore };
}

function pageHasCorrectOrder(rules: string[][], update: string[]) {
	return (printedPage: string, printedPageIndex: number) => {
		const { errorAfter, errorBefore } = errorIsBeforOrAfter(rules, printedPage, update, printedPageIndex);

		return !errorAfter && !errorBefore;
	};
}

function isCorrectUpdate(rules: string[][]) {
	return (update: string[]) => update.every(pageHasCorrectOrder(rules, update));
}

const isRuleSatisfied = (rule: string[], update: string[]): [boolean, number, number] => {
	const [indexBefore, indexAfter] = [update.indexOf(rule[0]), update.indexOf(rule[1])];
	return indexBefore !== -1 && indexAfter !== -1 && indexBefore > indexAfter
		? [false, indexBefore, indexAfter]
		: [true, indexBefore, indexAfter];
};

const calculateCorrectlyPrintedUpdates = (input: string[]) => {
	const { rules, updates } = parseInput(input);

	return updates
		.filter(isCorrectUpdate(rules))
		.map((update) => update[Math.floor(update.length / 2)])
		.map(Number)
		.reduce((acc, cur) => acc + cur, 0);
};

const calculateIncorrectlyPrintedUpdates = (input: string[]) => {
	const { rules, updates } = parseInput(input);

	const unordered = updates.filter((numbers) => !rules.every((rule) => isRuleSatisfied(rule, numbers)[0]));
	const reorderPages = () => {
		let reordered = false;
		for (const numbers of unordered) {
			rules.some((rule) => {
				const [isUnsatisfied, index1, index2] = isRuleSatisfied(rule, numbers);
				if (!isUnsatisfied) {
					[numbers[index1], numbers[index2]] = [numbers[index2], numbers[index1]];
					reordered = true;
				}
			});
		}
		return reordered;
	};

	while (reorderPages());

	return unordered
		.map((update) => update[Math.floor(update.length / 2)])
		.map(Number)
		.reduce((acc, cur) => acc + cur, 0);
};

Deno.test('example input 1', () => assertEquals(calculateCorrectlyPrintedUpdates(EXAMPLE_INPUT), 143));
Deno.test('puzzle input 1', () => assertEquals(calculateCorrectlyPrintedUpdates(PUZZLE_INPUT), 4814));

Deno.test('example input 2', () => assertEquals(calculateIncorrectlyPrintedUpdates(EXAMPLE_INPUT), 123));
Deno.test('puzzle input 2', () => assertEquals(calculateIncorrectlyPrintedUpdates(PUZZLE_INPUT), 5448));
