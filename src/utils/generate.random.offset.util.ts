export default function generateRandomOffsets(totalCount: number, amount: number): number[] {
    const offsets: number[] = [];
    const uniqueOffsets: Set<number> = new Set(); // To ensure unique offsets

    // Generate unique random offsets
    while (uniqueOffsets.size < amount) {
        const randomOffset = Math.floor(Math.random() * totalCount);
        uniqueOffsets.add(randomOffset);
    }

    // Convert set to array and return
    return Array.from(uniqueOffsets);
}
