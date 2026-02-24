import * as fs from "fs";
import * as path from "path";
import { messagesDirStructure, routingConfig } from "../config/i18n";

type MessageConfig = string | { [key: string]: MessageConfig };

const MESSAGES_DIR = path.join(__dirname, "..", "messages");

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Sprawdza czy plik istnieje
 */
function fileExists(filePath: string): boolean {
    try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
}

/**
 * Sprawdza czy folder istnieje
 */
function dirExists(dirPath: string): boolean {
    try {
        return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    } catch {
        return false;
    }
}

/**
 * Waliduje strukturę messages dla danego locale
 */
function validateMessagesForLocale(
    config: MessageConfig,
    locale: string,
    basePath: string = ""
): ValidationResult {
    const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
    };

    if (typeof config === "string") {
        const filePath = path.join(MESSAGES_DIR, locale, config);
        if (!fileExists(filePath)) {
            result.isValid = false;
            result.errors.push(`Missing file: messages/${locale}/${config}`);
        }
        return result;
    }

    for (const [key, value] of Object.entries(config)) {
        const currentPath = basePath ? `${basePath}.${key}` : key;
        const nestedResult = validateMessagesForLocale(
            value as MessageConfig,
            locale,
            currentPath
        );

        result.isValid = result.isValid && nestedResult.isValid;
        result.errors.push(...nestedResult.errors);
        result.warnings.push(...nestedResult.warnings);
    }

    return result;
}

/**
 * Znajduje wszystkie pliki JSON w danym katalogu (rekurencyjnie)
 */
function findJsonFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];

    if (!dirExists(dir)) {
        return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...findJsonFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }

    return files;
}

/**
 * Wyciąga wszystkie ścieżki plików z konfiguracji
 */
function extractConfigPaths(config: MessageConfig): string[] {
    const paths: string[] = [];

    if (typeof config === "string") {
        paths.push(config);
        return paths;
    }

    for (const value of Object.values(config)) {
        paths.push(...extractConfigPaths(value as MessageConfig));
    }

    return paths;
}

/**
 * Sprawdza czy nie ma nadmiarowych plików (które nie są w konfiguracji)
 */
function findOrphanedFiles(locale: string): string[] {
    const localeDir = path.join(MESSAGES_DIR, locale);
    const actualFiles = findJsonFiles(localeDir, localeDir);
    const configFiles = extractConfigPaths(messagesDirStructure);

    return actualFiles.filter((file) => !configFiles.includes(file));
}

/**
 * Główna funkcja walidująca
 */
function validateMessages(): ValidationResult {
    const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
    };

    // Sprawdź czy istnieje katalog messages
    if (!dirExists(MESSAGES_DIR)) {
        result.isValid = false;
        result.errors.push(`Messages directory not found: ${MESSAGES_DIR}`);
        return result;
    }

    // Sprawdź każdy locale z konfiguracji
    for (const locale of routingConfig.locales) {
        const localeDir = path.join(MESSAGES_DIR, locale);

        if (!dirExists(localeDir)) {
            result.isValid = false;
            result.errors.push(`Missing locale directory: messages/${locale}`);
            continue;
        }

        // Waliduj strukturę dla tego locale
        const localeResult = validateMessagesForLocale(messagesDirStructure, locale);
        result.isValid = result.isValid && localeResult.isValid;
        result.errors.push(...localeResult.errors);
        result.warnings.push(...localeResult.warnings);

        // Znajdź pliki bez odpowiednika w konfiguracji
        const orphanedFiles = findOrphanedFiles(locale);
        if (orphanedFiles.length > 0) {
            result.warnings.push(
                `Orphaned files in messages/${locale}: ${orphanedFiles.join(", ")}`
            );
        }
    }

    return result;
}

/**
 * Uruchamia walidację i wyświetla wyniki
 */
export function runValidateMessages() {
    console.log("🔍 Validating messages structure...\n");

    const result = validateMessages();

    if (result.errors.length > 0) {
        console.error("❌ Errors found:");
        result.errors.forEach((error) => console.error(`  - ${error}`));
        console.error("");
    }

    if (result.warnings.length > 0) {
        console.warn("⚠️  Warnings:");
        result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
        console.warn("");
    }

    if (result.isValid && result.warnings.length === 0) {
        console.log("✅ Messages structure is valid!");
    } else if (result.isValid) {
        console.log("✅ Messages structure is valid (with warnings)");
        process.exit(0);
    } else {
        console.error("❌ Messages structure validation failed!");
        console.error("");
        console.log("💡 Hint: Run the following command to generate missing files:");
        console.log("   pnpm generate:messages");
        console.error("");
        process.exit(1);
    }
}

const isDirectRun = process.argv[1]?.includes("validateMessages");

// Uruchom tylko w trybie development
if (isDirectRun) {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
        runValidateMessages();
    } else {
        console.log("Skipping validation in production mode");
    }
}
