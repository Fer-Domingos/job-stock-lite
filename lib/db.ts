export type MovementType = "IN" | "OUT";

export type Movement = {
  id: number;
  type: MovementType;
  material: string;
  quantity: number;
  location: string;
  note: string | null;
  created_at: string;
};

const materials = ["Steel", "Plastic", "Aluminum", "Copper"];

const movements: Movement[] = [
  {
    id: 1,
    type: "IN",
    material: "Steel",
    quantity: 100,
    location: "Warehouse A",
    note: "Initial stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 2,
    type: "OUT",
    material: "Steel",
    quantity: 20,
    location: "Job Site 1",
    note: "Production run",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 3,
    type: "IN",
    material: "Copper",
    quantity: 50,
    location: "Warehouse B",
    note: null,
    created_at: new Date().toISOString()
  }
];

let nextId = movements.length + 1;

export function getMaterials(): string[] {
  return [...materials].sort((a, b) => a.localeCompare(b));
}

export function getMovements(): Movement[] {
  return [...movements].sort((a, b) => b.id - a.id);
}

export function addMovement(input: Omit<Movement, "id" | "created_at">): Movement {
  const movement: Movement = {
    id: nextId++,
    created_at: new Date().toISOString(),
    ...input,
    note: input.note || null
  };

  if (!materials.includes(movement.material)) {
    materials.push(movement.material);
  }

  movements.unshift(movement);
  return movement;
}
