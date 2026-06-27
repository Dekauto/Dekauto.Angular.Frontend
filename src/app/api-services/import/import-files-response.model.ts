export interface ImportWarning {
  code: string;
  message: string;
  fileName?: string | null;
  sheetName?: string | null;
  groupName?: string | null;
  studentDisplayName?: string | null;
  matchedRows?: number[];
}

export interface ImportFilesResponse {
  data?: unknown;
  importWarnings?: ImportWarning[];
}
