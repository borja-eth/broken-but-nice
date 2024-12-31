-- Agregar foreign keys a la tabla objectives
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'objectives' AND column_name = 'owner_id') THEN
        ALTER TABLE objectives ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'objectives' AND column_name = 'parent_objective_id') THEN
        ALTER TABLE objectives ADD COLUMN parent_objective_id UUID REFERENCES objectives(id);
    END IF;
END $$;

-- Agregar foreign keys a la tabla key_results
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'key_results' AND column_name = 'owner_id') THEN
        ALTER TABLE key_results ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'key_results' AND column_name = 'objective_id') THEN
        ALTER TABLE key_results ADD COLUMN objective_id UUID REFERENCES objectives(id) NOT NULL;
    END IF;
END $$;

-- Agregar foreign keys a la tabla deliverables
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'deliverables' AND column_name = 'accountable_id') THEN
        ALTER TABLE deliverables ADD COLUMN accountable_id UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'deliverables' AND column_name = 'objective_id') THEN
        ALTER TABLE deliverables ADD COLUMN objective_id UUID REFERENCES objectives(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'deliverables' AND column_name = 'key_result_id') THEN
        ALTER TABLE deliverables ADD COLUMN key_result_id UUID REFERENCES key_results(id);
    END IF;
END $$;

-- Agregar constraint si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE table_name = 'deliverables' AND constraint_name = 'deliverable_parent_check') THEN
        ALTER TABLE deliverables ADD CONSTRAINT deliverable_parent_check 
        CHECK (
            (objective_id IS NOT NULL AND key_result_id IS NULL) OR 
            (objective_id IS NULL AND key_result_id IS NOT NULL)
        );
    END IF;
END $$;

-- Agregar foreign keys a la tabla kpis
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'kpis' AND column_name = 'owner_id') THEN
        ALTER TABLE kpis ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'kpis' AND column_name = 'objective_id') THEN
        ALTER TABLE kpis ADD COLUMN objective_id UUID REFERENCES objectives(id) NOT NULL;
    END IF;
END $$;

-- Crear índices si no existen
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_objectives_owner') THEN
        CREATE INDEX idx_objectives_owner ON objectives(owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_key_results_owner') THEN
        CREATE INDEX idx_key_results_owner ON key_results(owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_key_results_objective') THEN
        CREATE INDEX idx_key_results_objective ON key_results(objective_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deliverables_accountable') THEN
        CREATE INDEX idx_deliverables_accountable ON deliverables(accountable_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deliverables_objective') THEN
        CREATE INDEX idx_deliverables_objective ON deliverables(objective_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deliverables_key_result') THEN
        CREATE INDEX idx_deliverables_key_result ON deliverables(key_result_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kpis_owner') THEN
        CREATE INDEX idx_kpis_owner ON kpis(owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kpis_objective') THEN
        CREATE INDEX idx_kpis_objective ON kpis(objective_id);
    END IF;
END $$; 