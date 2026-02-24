import z from "zod";

export function getArrayFromMessages<S extends z.ZodTypeAny>(
    input: unknown,
    schema: S
): z.infer<S>[] {
    try {
        if (!Array.isArray(input)) {
            throw new Error("Input is not an array");
        }
        return z.array(schema).parse(input);
    } catch (error) {
        console.error("Error parsing messages array:", error);
        return [];
    }
}
