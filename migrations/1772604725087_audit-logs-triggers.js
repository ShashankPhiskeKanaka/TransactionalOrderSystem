/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`

        CREATE OR REPLACE FUNCTION audit_trigger_function()
        RETURNS TRIGGER AS $$
        BEGIN
            IF (TG_OP = 'INSERT') THEN
                INSERT INTO "auditLogs"(model, "modelId", action, "newData")
                VALUES (TG_TABLE_NAME, NEW.id, 'CREATE', to_jsonb(NEW));
                RETURN NEW;

            ELSIF (TG_OP = 'UPDATE') THEN
                INSERT INTO "auditLogs"(model, "modelId", action,"oldData", "newData")
                VALUES(TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
                RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
                INSERT INTO "auditLogs"(model, "modelId", action, "oldData")
                VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
                RETURN OLD;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER users_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE
        ON users
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_function();

        CREATE TRIGGER products_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE
        ON products
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_function();

        CREATE TRIGGER order_items_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE
        ON "orderItems"
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_function();

        CREATE TRIGGER orders_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE
        ON orders
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_function();

        CREATE TRIGGER wallets_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE
        ON wallets
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_function();
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
