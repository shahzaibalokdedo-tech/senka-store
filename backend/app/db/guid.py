import uuid
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER as MSSQL_UUID

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID, MS SQL Server's UNIQUEIDENTIFIER,
    or CHAR(36) for SQLite/MySQL.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        elif dialect.name == 'mssql':
            return dialect.type_descriptor(MSSQL_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value if dialect.name in ('postgresql', 'mssql') else str(value)
        else:
            u = uuid.UUID(str(value))
            return u if dialect.name in ('postgresql', 'mssql') else str(u)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            return uuid.UUID(str(value))
        return value
