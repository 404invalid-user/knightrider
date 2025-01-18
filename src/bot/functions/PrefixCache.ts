export default class PrefixCache {
  private cache = new Map<string, string>();

  // Add a value to the cache
  set(key: string, value: string): void {
    this.cache.set(key, value);
  }

  // Retrieve a value from the cache
  get(key: string): string | null {
    return this.cache.get(key)??null;
  }

  // Check if a key exists in the cache
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Remove a key from the cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear the entire cache
  clear(): void {
    this.cache.clear();
  }

  // Get the current size of the cache
  size(): number {
    return this.cache.size;
  }
}
