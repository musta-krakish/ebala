import { Bluetooth, Headphones, Keyboard, Mouse } from 'lucide-react';

export const normalizeAddress = (address: string) =>
    address.replace(/[^a-fA-F0-9]/g, '').toLowerCase();

export const getDeviceIcon = (device: Device) => {
    const type = `${device.type ?? ''} ${device.name}`.toLowerCase();

    if (type.includes('keyboard')) return Keyboard;
    if (type.includes('mouse')) return Mouse;
    if (type.includes('headset') || type.includes('headphone') || type.includes('major')) return Headphones;

    return Bluetooth;
};

export const getBatteryTone = (level?: number | null) => {
    if (level === undefined || level === null) return 'bg-zinc-200 text-zinc-500';
    if (level <= 20) return 'bg-rose-100 text-rose-700';
    if (level <= 50) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
};

export const formatDeviceMeta = (device: Device) => {
    const values = [
        device.type || 'Unknown',
        device.vendorId && `Vendor ${device.vendorId}`,
        device.productId && `Product ${device.productId}`,
        device.firmwareVersion && `FW ${device.firmwareVersion}`
    ].filter(Boolean);

    return values.join(' / ');
};
