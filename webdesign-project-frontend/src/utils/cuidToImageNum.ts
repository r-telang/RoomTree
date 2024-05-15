const hashFunction = (s: string) => {
    let hash = 0;

    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash = hash & hash; // prevent overflow from happening
    }
    return hash & 0xffff;   // returns lower 16-bit of hash value
};
const cuidToImageNum = (cuid: string) => {
    const num = hashFunction(cuid);
    return `http://localhost:3000/image${num % 8}.png`
}

export default cuidToImageNum