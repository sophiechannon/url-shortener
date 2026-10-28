import { capitalize as capitalizeFn } from "lodash-es";
import { env } from "./env";

// maybe one day I'll buy a custom domain and the URLs will actually be short!
export const getUrlLengthType = ({
	capitalize,
	verb,
}: {
	verb?: boolean;
	capitalize?: boolean;
} = {}) => {
	const options = {
		short: { base: "short", verb: "shorten" },
		long: { base: "long", verb: "lengthen" },
	};

	const isShort = env.VITE_IS_SHORT;
	const word = options[isShort ? "short" : "long"][verb ? "verb" : "base"];
	if (!capitalize) return word;

	return capitalizeFn(word);
};
