export interface UploadViewModel {
  id: string;
  name: string;
  type: string;
  size: number;
  description: string;
}

export interface UploadUpdateCommand {
  description: string;
}

export interface UploadCommand {
  source: string;
  sourceId: string;
  file: File;
  name: string;
  type: string;
  size: number;
  description: string;
}
