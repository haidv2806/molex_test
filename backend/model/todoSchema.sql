CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    body VARCHAR(255),
    completed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todo_updated_at
BEFORE UPDATE ON todo
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();