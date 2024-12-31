-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver todos los objetivos" ON objectives;
DROP POLICY IF EXISTS "Usuarios pueden crear objetivos" ON objectives;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios objetivos" ON objectives;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios objetivos" ON objectives;

DROP POLICY IF EXISTS "Usuarios pueden ver todos los key results" ON key_results;
DROP POLICY IF EXISTS "Usuarios pueden crear key results" ON key_results;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus key results" ON key_results;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus key results" ON key_results;
DROP POLICY IF EXISTS "Usuarios pueden eliminar key results de sus objetivos" ON key_results;

DROP POLICY IF EXISTS "Usuarios pueden ver todos los deliverables" ON deliverables;
DROP POLICY IF EXISTS "Usuarios pueden crear deliverables" ON deliverables;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus deliverables" ON deliverables;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus deliverables" ON deliverables;
DROP POLICY IF EXISTS "Usuarios pueden eliminar deliverables de sus objetivos y key results" ON deliverables;

DROP POLICY IF EXISTS "Usuarios pueden ver todos los KPIs" ON kpis;
DROP POLICY IF EXISTS "Usuarios pueden crear KPIs" ON kpis;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus KPIs" ON kpis;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus KPIs" ON kpis;
DROP POLICY IF EXISTS "Usuarios pueden eliminar KPIs de sus objetivos" ON kpis;

-- Políticas para objetivos
CREATE POLICY "Usuarios pueden ver todos los objetivos"
ON objectives FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden crear objetivos"
ON objectives FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Usuarios pueden actualizar sus propios objetivos"
ON objectives FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Usuarios pueden eliminar sus propios objetivos"
ON objectives FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Políticas para key results
CREATE POLICY "Usuarios pueden ver todos los key results"
ON key_results FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden crear key results"
ON key_results FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden actualizar sus key results"
ON key_results FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden eliminar sus key results"
ON key_results FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
);

-- Políticas para deliverables
CREATE POLICY "Usuarios pueden ver todos los deliverables"
ON deliverables FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden crear deliverables"
ON deliverables FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE (
      objectives.id = objective_id 
      OR 
      objectives.id IN (
        SELECT objective_id FROM key_results 
        WHERE key_results.id = key_result_id
      )
    )
    AND objectives.owner_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden actualizar sus deliverables"
ON deliverables FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE (
      objectives.id = objective_id 
      OR 
      objectives.id IN (
        SELECT objective_id FROM key_results 
        WHERE key_results.id = key_result_id
      )
    )
    AND objectives.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE (
      objectives.id = objective_id 
      OR 
      objectives.id IN (
        SELECT objective_id FROM key_results 
        WHERE key_results.id = key_result_id
      )
    )
    AND objectives.owner_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden eliminar sus deliverables"
ON deliverables FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE (
      objectives.id = objective_id 
      OR 
      objectives.id IN (
        SELECT objective_id FROM key_results 
        WHERE key_results.id = key_result_id
      )
    )
    AND objectives.owner_id = auth.uid()
  )
);

-- Políticas para KPIs
CREATE POLICY "Usuarios pueden ver todos los KPIs"
ON kpis FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden crear KPIs"
ON kpis FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden actualizar sus KPIs"
ON kpis FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden eliminar sus KPIs"
ON kpis FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.owner_id = auth.uid()
  )
); 