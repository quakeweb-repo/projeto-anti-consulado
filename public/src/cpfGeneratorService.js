// ============================================================================
// CPF GENERATOR AND VALIDATOR SERVICE
// Based on Brazilian CPF algorithm with name-based generation
// ============================================================================

/**
 * Calculate CPF check digits (DV1 and DV2)
 * @param {string} baseNumbers - First 9 digits of CPF
 * @returns {string} Complete CPF with check digits
 */
function calculateCheckDigits(baseNumbers) {
    // Calculate first check digit (DV1)
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(baseNumbers[i]) * (10 - i);
    }
    let dv1 = 11 - (sum % 11);
    if (dv1 >= 10) dv1 = 0;

    // Calculate second check digit (DV2)
    sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(baseNumbers[i]) * (11 - i);
    }
    sum += dv1 * 2;
    let dv2 = 11 - (sum % 11);
    if (dv2 >= 10) dv2 = 0;

    return baseNumbers + dv1.toString() + dv2.toString();
}

/**
 * Generate deterministic base numbers from name
 * @param {string} name - Person's full name
 * @returns {string} 9-digit base number
 */
function generateBaseFromName(name) {
    // Clean and normalize name
    const cleanName = name
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^A-Z\s]/g, '') // Keep only letters and spaces
        .trim();

    if (!cleanName) {
        // Fallback to random generation
        return generateRandomBase();
    }

    // Convert name to numeric using multiple methods
    const methods = [];
    
    // Method 1: ASCII sum of letters
    let asciiSum = 0;
    for (let i = 0; i < cleanName.length; i++) {
        asciiSum += cleanName.charCodeAt(i);
    }
    methods.push(asciiSum);

    // Method 2: Letter position in alphabet
    let alphaSum = 0;
    for (let i = 0; i < cleanName.length; i++) {
        const char = cleanName[i];
        if (char >= 'A' && char <= 'Z') {
            alphaSum += (char.charCodeAt(0) - 64); // A=1, B=2, etc.
        }
    }
    methods.push(alphaSum);

    // Method 3: Vowel/consonant pattern
    let vowelCount = 0;
    let consonantCount = 0;
    for (let i = 0; i < cleanName.length; i++) {
        const char = cleanName[i];
        if (char >= 'A' && char <= 'Z') {
            if (['A', 'E', 'I', 'O', 'U'].includes(char)) {
                vowelCount++;
            } else {
                consonantCount++;
            }
        }
    }
    methods.push(vowelCount * 1000 + consonantCount);

    // Method 4: Name length and first/last letters
    const firstLetter = cleanName.charCodeAt(0) - 64;
    const lastLetter = cleanName.charCodeAt(cleanName.length - 1) - 64;
    methods.push(cleanName.length * 100 + firstLetter * 10 + lastLetter);

    // Method 5: Word count and average word length
    const words = cleanName.split(/\s+/).filter(w => w.length > 0);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    methods.push(words.length * 1000 + Math.floor(avgWordLength * 100));

    // Combine methods to create 9-digit base
    let combined = 0;
    for (let i = 0; i < methods.length; i++) {
        combined = (combined * 31 + methods[i]) % 1000000000; // Keep within 9 digits
    }

    // Ensure it's exactly 9 digits
    let base = combined.toString().padStart(9, '0');
    
    // Avoid common invalid sequences
    if (isInvalidSequence(base)) {
        base = generateRandomBase();
    }

    return base;
}

/**
 * Generate random 9-digit base number
 * @returns {string} 9-digit base number
 */
function generateRandomBase() {
    let base;
    do {
        base = '';
        for (let i = 0; i < 9; i++) {
            base += Math.floor(Math.random() * 10).toString();
        }
    } while (isInvalidSequence(base));
    return base;
}

/**
 * Check if base number forms invalid CPF sequence
 * @param {string} base - 9-digit base number
 * @returns {boolean} True if invalid sequence
 */
function isInvalidSequence(base) {
    // Check for repeated digits (111111111, 222222222, etc.)
    if (/^(\d)\1{8}$/.test(base)) {
        return true;
    }

    // Check for ascending sequences (123456789)
    if (base === '123456789') {
        return true;
    }

    // Check for descending sequences (987654321)
    if (base === '987654321') {
        return true;
    }

    return false;
}

/**
 * Generate complete CPF from name
 * @param {string} name - Person's full name
 * @param {string} state - Brazilian state code (optional)
 * @returns {object} CPF generation result
 */
export function generateCPFFromName(name, state = null) {
    try {
        const base = generateBaseFromName(name);
        const fullCPF = calculateCheckDigits(base);
        const formattedCPF = formatCPF(fullCPF);

        // Determine likely state from CPF
        const cpfState = getStateFromCPF(fullCPF);

        return {
            success: true,
            name: name,
            cpf: fullCPF,
            formattedCPF: formattedCPF,
            baseNumbers: base,
            checkDigits: fullCPF.substring(9),
            state: cpfState,
            isValid: validateCPF(fullCPF),
            method: 'name-based',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            name: name,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Generate multiple CPF options for a name
 * @param {string} name - Person's full name
 * @param {number} count - Number of options to generate
 * @returns {array} Array of CPF options
 */
export function generateCPFOptions(name, count = 5) {
    const options = [];
    
    for (let i = 0; i < count; i++) {
        // Use different seeds for variety
        const seedName = name + (i > 0 ? ` ${i + 1}` : '');
        const cpfResult = generateCPFFromName(seedName);
        
        if (cpfResult.success) {
            options.push({
                ...cpfResult,
                option: i + 1,
                seed: seedName
            });
        }
    }

    return options;
}

/**
 * Validate CPF format and check digits
 * @param {string} cpf - CPF number (with or without formatting)
 * @returns {boolean} True if valid CPF
 */
export function validateCPF(cpf) {
    // Remove formatting
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Check basic format
    if (cleanCPF.length !== 11) {
        return false;
    }

    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
        return false;
    }

    // Calculate and verify check digits
    const base = cleanCPF.substring(0, 9);
    const expectedCheckDigits = cleanCPF.substring(9);
    const calculatedCheckDigits = calculateCheckDigits(base).substring(9);

    return expectedCheckDigits === calculatedCheckDigits;
}

/**
 * Format CPF with standard Brazilian formatting
 * @param {string} cpf - CPF number (11 digits)
 * @returns {string} Formatted CPF (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf) {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length !== 11) {
        return cpf; // Return original if not 11 digits
    }

    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Get Brazilian state from CPF
 * @param {string} cpf - CPF number
 * @returns {string} State code or 'Unknown'
 */
function getStateFromCPF(cpf) {
    const stateCodes = {
        '0': 'RS',
        '1': 'RS', 
        '2': 'RS',
        '3': 'RS',
        '4': 'RS',
        '5': 'RS',
        '6': 'RS',
        '7': 'RS',
        '8': 'RS',
        '9': 'RS', // All RS for 0-9
        
        '1': ['DF', 'GO', 'MT', 'MS', 'TO'],
        '2': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR'],
        '3': ['CE', 'MA', 'PI'],
        '4': ['AL', 'PB', 'PE', 'RN'],
        '5': ['BA', 'SE'],
        '6': ['MG'],
        '7': ['ES', 'RJ'],
        '8': ['SP'],
        '9': ['PR', 'SC']
    };

    // Use 8th digit (index 7) for state determination
    const stateDigit = cpf.charAt(8);
    
    // Simplified mapping - in real implementation would be more complex
    const stateMap = {
        '0': 'RS', '1': 'DF', '2': 'AC', '3': 'CE', '4': 'AL',
        '5': 'BA', '6': 'MG', '7': 'ES', '8': 'SP', '9': 'PR'
    };

    return stateMap[stateDigit] || 'Unknown';
}

/**
 * Generate CPF with specific state
 * @param {string} name - Person's full name
 * @param {string} targetState - Target Brazilian state code
 * @returns {object} CPF generation result
 */
export function generateCPFWithState(name, targetState) {
    // This would require more complex logic to force specific state
    // For now, generate regular CPF and check state
    const result = generateCPFFromName(name);
    
    if (result.success && result.state !== targetState) {
        // Try again with different seed
        const modifiedName = name + ' ' + targetState;
        return generateCPFFromName(modifiedName);
    }
    
    return result;
}

/**
 * Batch generate CPFs for multiple names
 * @param {array} names - Array of names
 * @returns {array} Array of CPF generation results
 */
export function batchGenerateCPF(names) {
    return names.map(name => generateCPFFromName(name));
}

/**
 * Check if CPF is blacklisted (common test CPFs)
 * @param {string} cpf - CPF number
 * @returns {boolean} True if blacklisted
 */
export function isBlacklistedCPF(cpf) {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    const blacklisted = [
        '11111111111', '22222222222', '33333333333', '44444444444',
        '55555555555', '66666666666', '77777777777', '88888888888',
        '99999999999', '00000000000',
        '12345678909', '12345678901', '12345678912'
    ];
    
    return blacklisted.includes(cleanCPF);
}

/**
 * Get CPF metadata and analysis
 * @param {string} cpf - CPF number
 * @returns {object} CPF analysis
 */
export function analyzeCPF(cpf) {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    return {
        cpf: cleanCPF,
        formatted: formatCPF(cpf),
        isValid: validateCPF(cpf),
        isBlacklisted: isBlacklistedCPF(cpf),
        baseNumbers: cleanCPF.substring(0, 9),
        checkDigits: cleanCPF.substring(9),
        state: getStateFromCPF(cleanCPF),
        length: cleanCPF.length,
        hasFormatting: cpf !== cleanCPF,
        timestamp: new Date().toISOString()
    };
}
