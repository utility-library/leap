import { getLine } from "./linesManipulation";
import "./string";

function ReplaceFunctionEnding(string, linesAfterMatch, to = "end", opening = "{", closing = "}") {
	let lineByLine = linesAfterMatch.split("\n"); // Unpack lines
	let i;
	let curlyBracesCounter = 0;

	if (to === null) to = "end";
	if (opening === null) opening = "{";
	if (closing === null) closing = "}";

	//console.log(to, new Error().stack);

	for (i in lineByLine) {
		let line = lineByLine[i];

		if (typeof opening == "object") {
			for (e of opening) {
				curlyBracesCounter += line.occurrences(e);
			}
		} else {
			curlyBracesCounter += line.occurrences(opening);
		}

		curlyBracesCounter -= line.occurrences(closing);

		//console.log(i, line)
		if (curlyBracesCounter == 0) {
			//console.log(to, line);
			if (to) {
				lineByLine[i] = line.replace(closing, to);
			}

			break;
		}
	}

	//console.log(linesAfterMatch.includes(lineByLine.join("\n")));
	string = string.replace(linesAfterMatch, lineByLine.join("\n"));

	let startLine = getLine(string, lineByLine[0]);
	let endLine = startLine + parseInt(i);

	return [string, startLine, endLine];
}

export { ReplaceFunctionEnding };
