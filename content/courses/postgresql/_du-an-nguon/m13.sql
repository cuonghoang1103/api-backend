CREATE EXTENSION IF NOT EXISTS unaccent;
ALTER TABLE courts ADD COLUMN amenities jsonb NOT NULL DEFAULT '{}',
                   ADD COLUMN description text NOT NULL DEFAULT '';
UPDATE courts SET amenities = '{"lights": true, "shower": true}', description = 'Sân trong nhà, có điều hoà và mái che' WHERE name = 'Court 1';
UPDATE courts SET amenities = '{"lights": true}', description = 'Sân ngoài trời có mái che di động' WHERE name = 'Court 3';
CREATE INDEX courts_amenities_gin ON courts USING gin (amenities);
SELECT name FROM courts WHERE amenities @> '{"lights": true}' ORDER BY name;
SELECT name FROM courts
WHERE to_tsvector('simple', unaccent(description)) @@ plainto_tsquery('simple', unaccent('mai che'))
ORDER BY name;
