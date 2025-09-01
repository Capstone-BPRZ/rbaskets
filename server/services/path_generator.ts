
const CHAR_RANGE: string[] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8',
    '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
    'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

function randomChar() {
    return CHAR_RANGE[Math.floor(Math.random() * CHAR_RANGE.length)];
}

function generatePath(existingPaths:string[], pathLength:number = 7): string {
    if (pathLength === void 0) { pathLength = 7; }
    let path: string;
    while (true) {
        path = "";
        for (let i = 0; i < pathLength; i++) {
            path += randomChar();
        }
        if (!existingPaths.includes(path)) {
            break;
        }
    }
    return path;
}

export default generatePath;