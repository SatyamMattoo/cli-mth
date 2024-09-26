export interface Args {
  inputDir: string;
  outputDir: string;
  template?: string;
  css?: string[];
  watch: boolean;
  single: boolean;
  live: boolean;
  port?: number;
}
