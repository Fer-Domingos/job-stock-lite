import { addMovement, getMaterials, getMovements } from "@/lib/db";
import { revalidatePath } from "next/cache";

type Role = "admin" | "viewer";

async function createMovement(formData: FormData) {
  "use server";

  const type = String(formData.get("type") ?? "");
  const material = String(formData.get("material") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);
  const location = String(formData.get("location") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!(["IN", "OUT"] as const).includes(type as "IN" | "OUT") || !material || quantity <= 0 || !location) {
    return;
  }

  addMovement({
    type: type as "IN" | "OUT",
    material,
    quantity,
    location,
    note: note || null
  });

  revalidatePath("/");
}

export function Dashboard({ role }: { role: Role }) {
  const movements = getMovements();
  const materials = getMaterials();

  const summaryMap = new Map<string, { in: number; out: number }>();
  movements.forEach((m) => {
    const row = summaryMap.get(m.material) ?? { in: 0, out: 0 };
    if (m.type === "IN") row.in += m.quantity;
    if (m.type === "OUT") row.out += m.quantity;
    summaryMap.set(m.material, row);
  });

  materials.forEach((name) => {
    if (!summaryMap.has(name)) {
      summaryMap.set(name, { in: 0, out: 0 });
    }
  });

  const summary = [...summaryMap.entries()].map(([material, totals]) => ({
    material,
    totalIn: totals.in,
    totalOut: totals.out,
    stock: totals.in - totals.out
  }));

  const totalStock = summary.reduce((acc, row) => acc + row.stock, 0);
  const lastUpdate = movements[0]?.created_at ?? "No entries yet";

  return (
    <main className="container">
      <h1>Job Inventory Control</h1>
      <section className="cards">
        <div className="card">
          <h2>Total Stock</h2>
          <p>{totalStock}</p>
        </div>
        <div className="card">
          <h2>Last Update</h2>
          <p>{lastUpdate === "No entries yet" ? lastUpdate : new Date(lastUpdate).toLocaleString()}</p>
        </div>
      </section>

      <section>
        <h2>Inventory Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Total IN</th>
              <th>Total OUT</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={row.material}>
                <td>{row.material}</td>
                <td>{row.totalIn}</td>
                <td>{row.totalOut}</td>
                <td>{row.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>New Entry</h2>
        {role === "admin" ? (
          <form action={createMovement} className="form-grid">
            <label>
              Type
              <select name="type" required>
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
            </label>
            <label>
              Material
              <select name="material" required>
                {materials.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quantity
              <input type="number" name="quantity" min={1} required />
            </label>
            <label>
              Location
              <input type="text" name="location" required />
            </label>
            <label className="full-width">
              Note
              <input type="text" name="note" />
            </label>
            <button type="submit">Save movement</button>
          </form>
        ) : (
          <p className="viewer">Viewer mode: read-only. Set request header x-role: admin to add entries.</p>
        )}
      </section>
    </main>
  );
}
