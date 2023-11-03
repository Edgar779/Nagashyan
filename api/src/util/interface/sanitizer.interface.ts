export interface ISanitize {
  sanitize(model: any, language: string): any;
  sanitizeMany?(model: any[], languageType: string): any;
}
