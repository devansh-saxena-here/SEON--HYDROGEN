import type { BuildingFixture, DeviceFixture, RoomFixture } from './demo-data';

export type BuildingFilter = 'all' | 'a' | 'b' | 'c';

export interface DeviceControlState {
  on: boolean;
  timerMin: number | null;
  timerEndsAt: number | null;
}

export type DeviceControlMap = Record<string, DeviceControlState>;

export function createInitialDeviceControlMap(devices: DeviceFixture[]): DeviceControlMap {
  const map: DeviceControlMap = {};
  for (const device of devices) {
    map[device.id] = {
      on: device.initialOn,
      timerMin: null,
      timerEndsAt: null,
    };
  }
  return map;
}

export function getDevicesForBuilding(
  devices: DeviceFixture[],
  rooms: RoomFixture[],
  buildingId: 'a' | 'b' | 'c',
): DeviceFixture[] {
  const buildingRoomNames = new Set(
    rooms.filter((room) => room.buildingId === buildingId).map((room) => room.name),
  );
  return devices.filter((device) => buildingRoomNames.has(device.room));
}

export function filterBuildings(
  buildings: BuildingFixture[],
  buildingFilter: BuildingFilter,
  searchQuery: string,
): BuildingFixture[] {
  const query = searchQuery.trim().toLowerCase();
  return buildings.filter((building) => {
    const matchesBuilding = buildingFilter === 'all' || building.id === buildingFilter;
    if (!matchesBuilding) return false;
    if (!query) return true;
    return (
      building.name.toLowerCase().includes(query) ||
      building.status.toLowerCase().includes(query)
    );
  });
}

export function filterRooms(
  rooms: RoomFixture[],
  buildingFilter: BuildingFilter,
  searchQuery: string,
): RoomFixture[] {
  const query = searchQuery.trim().toLowerCase();
  return rooms.filter((room) => {
    const matchesBuilding = buildingFilter === 'all' || room.buildingId === buildingFilter;
    if (!matchesBuilding) return false;
    if (!query) return true;
    return (
      room.name.toLowerCase().includes(query) ||
      room.buildingName.toLowerCase().includes(query) ||
      room.status.toLowerCase().includes(query)
    );
  });
}

export function filterDevices(
  devices: DeviceFixture[],
  rooms: RoomFixture[],
  buildingFilter: BuildingFilter,
  searchQuery: string,
): DeviceFixture[] {
  const allowedRooms =
    buildingFilter === 'all'
      ? null
      : new Set(rooms.filter((r) => r.buildingId === buildingFilter).map((r) => r.name));

  const query = searchQuery.trim().toLowerCase();
  return devices.filter((device) => {
    if (allowedRooms && !allowedRooms.has(device.room)) {
      return false;
    }
    if (!query) return true;
    return (
      device.name.toLowerCase().includes(query) ||
      device.room.toLowerCase().includes(query) ||
      device.type.toLowerCase().includes(query)
    );
  });
}

export function applyDevicePowerToggle(
  state: DeviceControlState,
  nextOn: boolean,
): DeviceControlState {
  if (!nextOn) {
    return {
      on: false,
      timerMin: null,
      timerEndsAt: null,
    };
  }
  return {
    ...state,
    on: true,
  };
}

export function applyDeviceTimerSelection(
  state: DeviceControlState,
  minutes: number | null,
  nowMs: number,
): DeviceControlState {
  if (minutes === null) {
    return {
      ...state,
      timerMin: null,
      timerEndsAt: null,
    };
  }
  return {
    on: true,
    timerMin: minutes,
    timerEndsAt: nowMs + minutes * 60_000,
  };
}

export function tickDeviceTimers(
  map: DeviceControlMap,
  nowMs: number,
): { nextMap: DeviceControlMap; expiredDeviceIds: string[] } {
  const expiredDeviceIds: string[] = [];
  let changed = false;
  const nextMap: DeviceControlMap = { ...map };

  for (const [id, ctrl] of Object.entries(map)) {
    if (ctrl.timerEndsAt !== null && nowMs >= ctrl.timerEndsAt) {
      expiredDeviceIds.push(id);
      nextMap[id] = {
        on: false,
        timerMin: null,
        timerEndsAt: null,
      };
      changed = true;
    }
  }

  return {
    nextMap: changed ? nextMap : map,
    expiredDeviceIds,
  };
}

export function formatCountdown(timerEndsAt: number | null, nowMs: number): string | null {
  if (timerEndsAt === null) return null;
  const remainingMs = Math.max(0, timerEndsAt - nowMs);
  const totalSec = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
