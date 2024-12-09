import { join } from 'jsr:@std/path';

export const loadPuzzle = async (puzzleId: number): Promise<string> => {
	const filePath = join(import.meta.dirname as string, `./${puzzleId < 10 ? '0' + puzzleId : puzzleId}_input.txt`);

	try {
		await Deno.lstat(filePath);
		return await Deno.readTextFile(filePath);
	} catch (err) {
		if (!(err instanceof Deno.errors.NotFound)) {
			throw err;
		}

		await Deno.writeTextFile(filePath, '');
		return '';
	}
};
