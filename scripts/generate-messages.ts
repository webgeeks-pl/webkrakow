import * as fs from "fs";
import * as path from "path";
import { messagesDirStructure, routingConfig } from "../config/i18n";

type MessageConfig = string | { [key: string]: MessageConfig };

const MESSAGES_DIR = path.join(__dirname, "..", "messages");

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
 * Tworzy folder jeśli nie istnieje (rekurencyjnie)
 */
function ensureDir(dirPath: string): void {
    if (!dirExists(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  ✅ Created directory: ${path.relative(process.cwd(), dirPath)}`);
    }
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
 * Generuje brakujące pliki messages dla danego locale
 */
function generateMessagesForLocale(locale: string): number {
    const localeDir = path.join(MESSAGES_DIR, locale);
    let createdCount = 0;

    // Upewnij się, że folder locale istnieje
    ensureDir(localeDir);

    // Pobierz wszystkie ścieżki plików z konfiguracji
    const filePaths = extractConfigPaths(messagesDirStructure);

    for (const relativePath of filePaths) {
        const fullPath = path.join(localeDir, relativePath);

        // Sprawdź czy plik już istnieje
        if (fileExists(fullPath)) {
            continue;
        }

        // Upewnij się, że folder nadrzędny istnieje
        const dirPath = path.dirname(fullPath);
        ensureDir(dirPath);

        // Utwórz pusty plik JSON
        const emptyContent = "{}";
        fs.writeFileSync(fullPath, emptyContent, "utf-8");

        console.log(`  ✅ Created file: messages/${locale}/${relativePath}`);
        createdCount++;
    }

    return createdCount;
}

/**
 * Główna funkcja generująca strukturę messages
 */
function generateMessages(): void {
    console.log("\n" + "═".repeat(60));
    console.log("📁 Generating Messages Structure");
    console.log("═".repeat(60) + "\n");

    // Upewnij się, że główny katalog messages istnieje
    ensureDir(MESSAGES_DIR);

    let totalCreated = 0;

    // Generuj strukturę dla każdego locale
    for (const locale of routingConfig.locales) {
        console.log(`\n🌍 Processing locale: ${locale}`);

        const created = generateMessagesForLocale(locale);
        totalCreated += created;

        if (created === 0) {
            console.log(`  ✅ All files already exist for ${locale}`);
        }
    }

    console.log("\n" + "═".repeat(60));

    if (totalCreated === 0) {
        console.log("✅ All message files are up to date!");
    } else {
        console.log(`✅ Generated ${totalCreated} missing file(s)!`);
    }

    console.log("═".repeat(60) + "\n");
}

// Uruchom skrypt
generateMessages();
