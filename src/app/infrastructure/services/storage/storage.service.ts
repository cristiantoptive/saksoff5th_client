import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private nativeStorage = false;

  private fakedStorage = {};

  constructor() {
    if (typeof localStorage === "object") {
      try {
        localStorage.setItem("storage_test", "ok");
        this.nativeStorage = localStorage.getItem("storage_test") === "ok";
        localStorage.removeItem("storage_test");
      } catch (e) {
        this.nativeStorage = false;
      }
    }
  }

  /**
   * Determines if localstorage entry has value
   */
  has(key: string): boolean {
    return this.nativeStorage ? localStorage.getItem(key) !== null : this.fakedStorage[key] !== null;
  }

  /**
   * Retrieves entry value from localstorage.
   */
  get(key: string): any {
    if (this.has(key)) {
      return this.nativeStorage ? JSON.parse(localStorage.getItem(key)) : this.fakedStorage[key];
    }
    return null;
  }

  /**
   * Sets entry value to localstorage
   */
  set(key: string, value: unknown): void {
    if (this.nativeStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      this.fakedStorage[key] = value;
    }
  }

  /**
   * Removes entry from localstorage
   */
  remove(key: string): void {
    if (this.nativeStorage) {
      localStorage.removeItem(key);
    } else {
      this.fakedStorage[key] = null;
    }
  }
}
