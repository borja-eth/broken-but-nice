-- Habilitar RLS en todas las tablas
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

-- Política para eliminar objetivos
CREATE POLICY "Usuarios pueden eliminar sus propios objetivos"
ON objectives FOR DELETE
USING (auth.uid() = owner_id);

-- Política para eliminar key results
CREATE POLICY "Usuarios pueden eliminar key results de sus objetivos"
ON key_results FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = key_results.objective_id 
    AND objectives.owner_id = auth.uid()
  )
);

-- Política para eliminar deliverables
CREATE POLICY "Usuarios pueden eliminar deliverables de sus objetivos y key results"
ON deliverables FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE (
      objectives.id = deliverables.objective_id 
      OR 
      objectives.id IN (
        SELECT objective_id FROM key_results 
        WHERE key_results.id = deliverables.key_result_id
      )
    )
    AND objectives.owner_id = auth.uid()
  )
);

-- Política para eliminar KPIs
CREATE POLICY "Usuarios pueden eliminar KPIs de sus objetivos"
ON kpis FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = kpis.objective_id 
    AND objectives.owner_id = auth.uid()
  )
); 