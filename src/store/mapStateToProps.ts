import { PoBean } from 'gettext-lib'

export function mapTanslation({
  ContentReducer
}: {
  ContentReducer: PoBean;
}) {
  return { ...ContentReducer };
}