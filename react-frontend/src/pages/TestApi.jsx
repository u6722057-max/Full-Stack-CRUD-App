import React, { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function TestApi() {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [itemError, setItemError] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  async function loadItems() {
    try {
      setIsLoadingItems(true);
      setItemError("");

      const response = await fetch(`${apiBaseUrl}/api/item`);
      if (!response.ok) {
        throw new Error(`The item API returned ${response.status}.`);
      }

      const data = await response.json();
      setItems(data.itemList || []);
    } catch (requestError) {
      setItemError(requestError.message || "Could not load items.");
    } finally {
      setIsLoadingItems(false);
    }
  }

  async function deleteItem(itemId) {
    try {
      setItemError("");

      const response = await fetch(`${apiBaseUrl}/api/item/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`The delete API returned ${response.status}.`);
      }

      await loadItems();
    } catch (requestError) {
      setItemError(requestError.message || "Could not delete item.");
    }
  }

  useEffect(() => {
    async function loadHello() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/hello`);
        if (!response.ok) {
          throw new Error(`The API returned ${response.status}.`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (requestError) {
        setError(requestError.message || "Could not connect to the hello API.");
      }
    }

    loadHello();
    loadItems();
  }, []);

  return (
    <main className="page">
      <h1>Hello API</h1>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      {!message && !error && <p>Loading…</p>}

      <section className="items-section">
        <div className="section-header">
          <h2>Item List</h2>
          <button type="button" onClick={loadItems}>
            Refresh
          </button>
        </div>

        {itemError && <p className="error">{itemError}</p>}
        {isLoadingItems && <p>Loading items…</p>}

        {!isLoadingItems && items.length === 0 && (
          <p className="muted">No active items found.</p>
        )}

        {!isLoadingItems && items.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    <td>{item.amount}</td>
                    <td>{item.status || "ACTIVE"}</td>
                    <td>
                      <button
                        className="danger-button"
                        type="button"
                        onClick={() => deleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
