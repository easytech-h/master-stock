// ... (keep the existing code)

// Delete all sales
app.delete('/api/sales', (req, res) => {
  db.run('DELETE FROM sales', (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.run('DELETE FROM sale_items', (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'All sales deleted successfully' });
    });
  });
});

// ... (keep the rest of the existing code)