export function getCurrentWindow() {
  return {
    setAlwaysOnTop: () => Promise.resolve(),
    setDecorations: () => Promise.resolve(),
    setSize: () => Promise.resolve(),
    setBackgroundColor: () => Promise.resolve(),
  };
}

export class LogicalSize {
  constructor(public readonly width: number, public readonly height: number) {}
}
