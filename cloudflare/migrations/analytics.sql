-- Dashboards Table
CREATE TABLE dashboards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Dashboard Widgets Table
CREATE TABLE dashboard_widgets (
  id TEXT PRIMARY KEY,
  dashboard_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  config TEXT NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (dashboard_id) REFERENCES dashboards(id)
);

-- Reports Table
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  request TEXT NOT NULL,
  format TEXT NOT NULL,
  schedule TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_dashboards_created_by ON dashboards(created_by);
CREATE INDEX idx_dashboard_widgets_dashboard ON dashboard_widgets(dashboard_id);
CREATE INDEX idx_reports_created_by ON reports(created_by);
