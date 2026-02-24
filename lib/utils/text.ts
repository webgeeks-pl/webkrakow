import { HARD_SPACE_WORDS } from "@/lib/constants";

export function applyHardSpaceBreaks(
    text: string,
    hardSpaceWords: string[] = HARD_SPACE_WORDS
): string {
    const nbsp = "\u00A0";
    const words = text.split(" ");
    const processedWords = words.map((word, i) => {
        if (i === words.length) return word;
        if (hardSpaceWords.includes(word)) {
            return word + nbsp;
        }
        return word + " ";
    });
    return processedWords.join("");
}
