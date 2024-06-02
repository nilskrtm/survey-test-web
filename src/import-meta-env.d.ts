interface ImportMetaEnv {
  readonly HTML_TITLE?: string;
  readonly HTML_DESCRIPTION?: string;
  readonly IMPRINT_ADDRESS_LINE_1?: string;
  readonly IMPRINT_ADDRESS_LINE_2?: string;
  readonly IMPRINT_ADDRESS_LINE_3?: string;
  readonly IMPRINT_ADDRESS_LINE_4?: string;
  readonly IMPRINT_CONTACT_EMAIL?: string;
  readonly IMPRINT_CONTACT_PHONE?: string;
  readonly APP_DOWNLOAD_URL?: string;
  readonly API_ENDPOINT?: string;
  readonly API_TIMEOUT?: number;
  readonly WS_ENDPOINT?: string;
  readonly WS_RECONNECT_TIMEOUT?: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
