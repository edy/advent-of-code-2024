import { join } from 'jsr:@std/path';
import { assertEquals } from 'jsr:@std/assert';

const PUZZLE_INPUT = await Deno.readTextFile(join(import.meta.dirname as string, './input.txt'));

const EXAMPLE_INPUT: string = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

function parse(input: string): number[][] {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			return line.trim().split(/\s+/).map(Number);
		});
}

function isSafeReport(report: number[]): boolean {
	return (isIncreasing(report) || isDecreasing(report)) && isValidLevel(report);
}

function isSafeTruncatedReport(report: number[]): boolean {
	if (!isSafeReport(report)) {
		return report.some((_value, i, originalReport) => {
			const truncatedReport = originalReport.slice(0, i).concat(originalReport.slice(i + 1));
			return isSafeReport(truncatedReport);
		});
	}
	return true;
}

function isIncreasing(report: number[]): boolean {
	return report.every((value, index, array) => index === 0 || value > array[index - 1]);
}

function isDecreasing(report: number[]): boolean {
	return report.every((value, index, array) => index === 0 || value < array[index - 1]);
}

function isValidLevel(report: number[]): boolean {
	return report.every((value, index, array) => index === 0 || isBetween(value - array[index - 1]));
}

function isBetween(number: number, lowerBound: number = 1, upperBound: number = 3): boolean {
	return Math.abs(number) >= lowerBound && Math.abs(number) <= upperBound;
}

Deno.test('example input 1', () => {
	const reports = parse(EXAMPLE_INPUT);
	const safeReports = reports.filter(isSafeReport);
	assertEquals(safeReports.length, 2);
});

Deno.test('puzzle input 1', () => {
	const reports = parse(PUZZLE_INPUT);
	const safeReports = reports.filter(isSafeReport);
	assertEquals(safeReports.length, 585);
});

Deno.test('example input 2', () => {
	const reports = parse(EXAMPLE_INPUT);
	const safeReports = reports.filter(isSafeTruncatedReport);
	assertEquals(safeReports.length, 4);
});

Deno.test('puzzle input 2', () => {
	const reports = parse(PUZZLE_INPUT);
	const safeReports = reports.filter(isSafeTruncatedReport);
	assertEquals(safeReports.length, 626);
});
