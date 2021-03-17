import { BibleAPIClient } from "../clients/bible-api";

export class HolyBibleController {
  public static async handlerCommand(command: string, args: string []): Promise<string[]> {
    const data = args[0].split(":");
    const versesList = await BibleAPIClient.getText(command, 'nvi', data[0]);
    let min: any = 1;
    let max: any = versesList.verses.length;
    let response = [];
    if (data.length > 1) {
      const verseRange = data[1].split("-");
      min = verseRange[0];
      max = min;
      if (verseRange.length > 1) {
        max = verseRange[1];
      }
      if (min > versesList.verses.length || max > versesList.verses.length) {
        return ["Você não pode mandar numeros de versiculos que não existam."];
      }
    }
    for (const verse of versesList.verses) {
      if (verse.number >= min && verse.number <= max) {
        response.push(`${verse.number}: ${verse.text}`);
      }
    }
    const range = min !== max ? `${min}-${max}`: min;
    return [
      ...response,
      `${versesList.book.name} ${versesList.chapter.number}:${range}`,
    ];
  }
}