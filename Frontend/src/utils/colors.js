// Extremely basic color dictionary to map nearest hex codes to Color Names
const colorsDict = [
    { name: "Jet Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Navy Blue", hex: "#000080" },
    { name: "Crimson Red", hex: "#DC143C" },
    { name: "Forest Green", hex: "#228B22" },
    { name: "Mustard Yellow", hex: "#FFDB58" },
    { name: "Slate Grey", hex: "#708090" },
    { name: "Walnut Brown", hex: "#5C4033" },
    { name: "Sand Gold", hex: "#C2B280" },
    { name: "Coral Pink", hex: "#F88379" },
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Teal", hex: "#008080" },
    { name: "Olive Drab", hex: "#6B8E23" },
    { name: "Maroon", hex: "#800000" }
];

// Helper to convert hex to rgb
const hexToRgb = (hex) => {
    let raw = hex.replace(/^#/, '');
    if (raw.length === 3) raw = raw.split('').map(c => c + c).join('');
    const bigint = parseInt(raw, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
};

export const getClosestColorName = (hexCode) => {
    if (!hexCode || !/^#([0-9A-F]{3}){1,2}$/i.test(hexCode)) return "Unknown Color";
    
    const target = hexToRgb(hexCode);
    let closestName = "Unknown Color";
    let minDistance = Infinity;

    for (const color of colorsDict) {
        const rgb = hexToRgb(color.hex);
        // Calculate euclidean distance
        const distance = Math.sqrt(
            Math.pow(target.r - rgb.r, 2) +
            Math.pow(target.g - rgb.g, 2) +
            Math.pow(target.b - rgb.b, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestName = color.name;
        }
    }
    return closestName;
};
