import Axios from "axios";
import config from "../config/config.json";

const baseURL = config.BIBLE_API_URI;
const client = Axios.create({
  baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export class BibleAPIClient {
  public static async getBooks() {
    const result = await client.get('/books');
    return result.data;
  }

  private static removeSpecialChars(word: string): string {
    let especialChar = word.toLowerCase();
    especialChar = especialChar.replace(/[áàãâä]/g, 'a');
    especialChar = especialChar.replace(/[éèêë]/g, 'e');
    especialChar = especialChar.replace(/[íìîï]/g, 'i');
    especialChar = especialChar.replace(/[óòõôö]/g, 'o');
    especialChar = especialChar.replace(/[úùûü]/g, 'u');
    especialChar = especialChar.replace(/[ç]/g, 'c');
    especialChar = especialChar.replace(/[^a-z0-9]/gi, '');
    especialChar = especialChar.replace(/_+/, '');
    return especialChar;
  }

  public static async getBooksMap() {
    const map = [];
    const books = await this.getBooks();
    for (const book of books) {
      const bookName = this.removeSpecialChars(book.name);
      map[bookName] = book.abbrev.pt;
    }
    return map;
  }
  
  public static async getVersions() {
    const result = await client.get('/versions');
    return result.data;
  }
  
  public static async getText(book: string, version: string, chapter: string) {
    const bookParsed = this.removeSpecialChars(book);
    const bookMapList = await this.getBooksMap();
    const abbrev = bookMapList[bookParsed];
    const result = await client.get(`/verses/${version}/${abbrev}/${chapter}`);
    return result.data;
  }
}
