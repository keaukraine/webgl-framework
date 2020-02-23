export class BinaryDataLoader {
    public static async load(url: string): Promise<ArrayBuffer> {
        const response = await fetch(url);
        return response.arrayBuffer();
    }
}
