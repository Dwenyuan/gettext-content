import { PoBean } from "../bean/content.bean";

export function mapTanslation({
  ContentReducer
}: {
  ContentReducer: PoBean;
}) {
  return { ...ContentReducer };
}