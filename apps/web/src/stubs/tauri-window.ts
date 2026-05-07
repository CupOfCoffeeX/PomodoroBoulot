export function getCurrentWindow() {
  return {
    setAlwaysOnTop: (_value: boolean) => Promise.resolve(),
    setDecorations: (_value: boolean) => Promise.resolve(),
    setSize: (_size: LogicalSize) => Promise.resolve(),
    setBackgroundColor: (_color: [number, number, number, number]) => Promise.resolve(),
  };
}

export class LogicalSize {
  constructor(public readonly width: number, public readonly height: number) {}
}
