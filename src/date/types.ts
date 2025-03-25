export interface DateRequest {
  expression: string; // 日付表現（「今日」「明日」など）
  baseDate?: string; // 基準日（省略時は現在時刻）
  timezone?: string; // タイムゾーン（省略時はサーバー設定値）
}

export interface DateResponse {
  success: boolean;
  date?: string;
  error?: string;
  timezone?: string;
  confidence: number;
}

export interface ServerConfig {
  timezone: string; // e.g. 'UTC', 'Asia/Tokyo'
}
