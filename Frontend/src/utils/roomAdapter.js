/**
 * Room Data Adapter
 *
 * Normalizes backend room responses (snake_case) to the frontend UI model (camelCase).
 *
 * Backend GET /roomlist schema:
 * [
 *   {
 *     id: number,
 *     room_name: string,
 *     room_code: string,
 *     description: string | null,
 *     created_by: number,
 *     created_at: string
 *   }
 * ]
 */

export const mapBackendRoomToUi = (backendRoom) => {
  if (!backendRoom) return null;

  return {
    id: backendRoom.id,
    name: backendRoom.room_name || 'Untitled Room',
    roomCode: backendRoom.room_code || '',
    description: backendRoom.description || '',
    createdByUserId: backendRoom.created_by,
    createdAt: backendRoom.created_at || null,
  };
};

export const mapBackendRoomsListToUi = (backendRooms) => {
  if (!Array.isArray(backendRooms)) {
    return [];
  }
  return backendRooms.map(mapBackendRoomToUi).filter(Boolean);
};
