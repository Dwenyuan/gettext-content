import { TranslationBean } from "../bean/content.bean";

export function mapTanslation({
  ContentReducer
}: {
  ContentReducer: TranslationBean;
}) {
  return { ...ContentReducer };
}
