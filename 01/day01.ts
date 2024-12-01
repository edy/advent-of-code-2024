import { join } from 'jsr:@std/path';
const inputFile = await Deno.readTextFile(join(import.meta.dirname as string, './day01_input.txt'));

export function parseCoordinates(input: string) {
	const coordinatesList: number[][] = [];
	input
		.trim()
		.split('\n')
		.forEach((line) => {
			line.trim()
				.split(/\s+/)
				.forEach((coordinate, column) => {
					coordinatesList[column] = coordinatesList[column] || [];
					coordinatesList[column].push(parseInt(coordinate));
				});
		});

	return coordinatesList;
}

function getNthSmallestNumber(n: number, coordinates: number[]): number {
	return coordinates.sort((a, b) => a - b)[n - 1];
}

function distance(a: number, b: number): number {
	return Math.abs(a - b);
}

function totalDistance(distances: number[]): number {
	return distances.reduce((acc, cur) => acc + cur, 0);
}

function calculateTotalDistance(input: string): number {
	const coordinates = parseCoordinates(input);
	const distances: number[] = [];
	for (let i = 1; i <= coordinates[0].length; i++) {
		const nthSmallestLeft = getNthSmallestNumber(i, coordinates[0]);
		const nthSmallestRight = getNthSmallestNumber(i, coordinates[1]);
		distances.push(distance(nthSmallestLeft, nthSmallestRight));
	}

	return totalDistance(distances);
}

function sumOfNumbersEqualToN(arr: number[], n: number): number {
	return arr.filter((num) => num === n).reduce((acc, cur) => acc + cur, 0);
}

function calculateSimilarityScore(input: string): number {
	const coordinates = parseCoordinates(input);
	const similarityScores: number[] = [];
	for (let i = 0; i < coordinates[0].length; i++) {
		const num = coordinates[0][i];
		similarityScores.push(sumOfNumbersEqualToN(coordinates[1], num));
	}
	return totalDistance(similarityScores);
}

console.log('1:', calculateTotalDistance(inputFile));
console.log('2:', calculateSimilarityScore(inputFile));
