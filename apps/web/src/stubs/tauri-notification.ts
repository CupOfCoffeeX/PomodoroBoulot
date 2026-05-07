export const isPermissionGranted = () => Promise.resolve(false);
export const requestPermission = () => Promise.resolve('denied' as const);
export const sendNotification = (_options: { title: string; body?: string }) => {};
