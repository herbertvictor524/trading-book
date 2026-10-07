export type TradeSide = 'Long' | 'Short';

export type Trade = {
  id: string;
  asset: string;
  side: TradeSide;
  entry: number;
  exit: number;
  quantity: number;
  date: string;
  notes: string;
};

export type TradeFormState = {
  asset: string;
  side: TradeSide;
  entry: string;
  exit: string;
  quantity: string;
  date: string;
  notes: string;
};

export type ThemeMode = 'dark' | 'light';
export type AccentMode = 'cyan' | 'gold' | 'purple';
