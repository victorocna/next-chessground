/** True outside a production build; guards warnings that must not reach a shipped app. */
export const isDev = (): boolean =>
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
