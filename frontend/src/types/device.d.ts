export type Device = {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  created_at: string;
  device_count: number;
  device_unit_usage: number;
  created_at: string;
};

export interface AddDeviceParams {
  user_id: string;
  device_name: string;
  device_type: string;
  device_count: number;
  device_unit_usage: number;
}

export interface UpdateDeviceParams {
  id: string;
  device_name: string;
  device_type: string;
  device_count: number;
  device_unit_usage: number;
}

export interface DeleteDeviceParams {
  id: string;
}

export interface GetDevicesParams {
  user_id: string;
}
