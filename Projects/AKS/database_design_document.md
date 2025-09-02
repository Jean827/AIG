# Database Design Document

## 1. Introduction

This document outlines the database design for the AKS (Administrative Knowledge System) project. The purpose of this document is to provide a comprehensive overview of the database structure, including schema design, relationships, constraints, and best practices for data management.

## 2. Database Overview

The AKS project uses a database to store and manage various types of data related to agricultural land management, account management, contracts, bidding, fees, and financing. The database is designed to support the application's functionality while ensuring data integrity, security, and performance.

## 3. Database Architecture

### 3.1 Database Type

The project uses a relational database to store structured data. The specific database system (e.g., MySQL, PostgreSQL) should be specified here.

### 3.2 Database Connectivity

The backend application connects to the database using database utilities defined in `db_utils.py`. The connection details are configured in `database.py` within the config directory.

## 4. Data Models

### 4.1 Overview of Data Models

The project includes the following main data models:

1. **Account Management**: User accounts, roles, permissions
2. **Basic Information Management**: Basic data such as townships, villages, etc.
3. **Land Basic Information**: Details about agricultural land
4. **Land Bidding Management**: Information related to land bidding processes
5. **Contract Management**: Contracts between land owners and users
6. **Fee Management**: Fee collection and payment information
7. **Financing and Confirmation Management**: Financing and land right confirmation data
8. **System Management**: System configuration and logs

### 4.2 Detailed Model Definitions

#### 4.2.1 Account Management

This model handles user accounts, authentication, authorization, and user profile information.

```python
# Example simplified model definition
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    role = relationship("Role")
    # Other relationships as needed
```

#### 4.2.2 Basic Information Management

This model handles basic geographical and administrative information such as townships, villages, etc.

```python
# Example simplified model definition
class Township(Base):
    __tablename__ = "townships"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    parent_id = Column(Integer, ForeignKey("townships.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    parent = relationship("Township", remote_side=[id])
    villages = relationship("Village", back_populates="township")
```

#### 4.2.3 Land Basic Information

This model handles detailed information about agricultural land parcels.

```python
# Example simplified model definition
class Land(Base):
    __tablename__ = "lands"
    
    id = Column(Integer, primary_key=True, index=True)
    land_code = Column(String, unique=True, index=True)
    area = Column(Float)
    location = Column(String)
    land_type = Column(String)
    soil_type = Column(String)
    village_id = Column(Integer, ForeignKey("villages.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    village = relationship("Village")
    owner = relationship("User")
    # Other relationships as needed
```

#### 4.2.4 Land Bidding Management

This model handles information related to the land bidding process.

```python
# Example simplified model definition
class Bidding(Base):
    __tablename__ = "biddings"
    
    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("lands.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    starting_price = Column(Float)
    current_price = Column(Float)
    status = Column(String)
    winner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    land = relationship("Land")
    winner = relationship("User")
    bids = relationship("Bid", back_populates="bidding")
```

#### 4.2.5 Contract Management

This model handles contracts between land owners and users.

```python
# Example simplified model definition
class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_number = Column(String, unique=True, index=True)
    land_id = Column(Integer, ForeignKey("lands.id"))
    lessor_id = Column(Integer, ForeignKey("users.id"))
    lessee_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(Date)
    end_date = Column(Date)
    amount = Column(Float)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    land = relationship("Land")
    lessor = relationship("User", foreign_keys=[lessor_id])
    lessee = relationship("User", foreign_keys=[lessee_id])
    # Other relationships as needed
```

#### 4.2.6 Fee Management

This model handles fee collection and payment information related to land use.

```python
# Example simplified model definition
class Fee(Base):
    __tablename__ = "fees"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    fee_type = Column(String)
    amount = Column(Float)
    due_date = Column(Date)
    payment_date = Column(Date, nullable=True)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    contract = relationship("Contract")
    # Other relationships as needed
```

#### 4.2.7 Financing and Confirmation Management

This model handles financing information and land right confirmation data.

```python
# Example simplified model definition
class Financing(Base):
    __tablename__ = "financings"
    
    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("lands.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    land = relationship("Land")
    user = relationship("User")
    # Other relationships as needed
```

## 5. Database Relationships

The database includes the following key relationships:

### 5.1 One-to-One Relationships
- Example: User profile information linked to a user account

### 5.2 One-to-Many Relationships
- User to roles (one role can be assigned to many users)
- Township to villages (one township can contain many villages)
- Land to contracts (one land can have multiple contracts over time)
- Contract to fees (one contract can have multiple fees)

### 5.3 Many-to-Many Relationships
- Users to permissions (through roles)
- Lands to financing (one land can be involved in multiple financing arrangements)

## 6. Database Constraints

### 6.1 Primary Keys
- Each table has a primary key to uniquely identify records

### 6.2 Foreign Keys
- Foreign keys are used to maintain referential integrity between related tables

### 6.3 Unique Constraints
- Unique constraints ensure that certain columns (e.g., username, email, land code) contain unique values

### 6.4 Not Null Constraints
- Not null constraints ensure that required fields contain values

### 6.5 Check Constraints
- Check constraints ensure that data meets specific criteria (e.g., status values, date ranges)

## 7. Database Indexes

### 7.1 Primary Key Indexes
- Automatically created for primary key columns

### 7.2 Unique Indexes
- Created for columns with unique constraints

### 7.3 Foreign Key Indexes
- Created to improve performance of join operations

### 7.4 Custom Indexes
- Created for frequently queried columns to improve performance

## 8. Database Security

### 8.1 Authentication and Authorization
- Use database-specific authentication mechanisms
- Grant appropriate permissions to database users
- Implement role-based access control

### 8.2 Data Encryption
- Encrypt sensitive data both in transit and at rest
- Use SSL/TLS for database connections
- Encrypt sensitive fields in the database

### 8.3 Backup and Recovery
- Implement regular database backup procedures
- Test backup and recovery processes
- Store backups in secure locations

### 8.4 Auditing
- Implement database auditing to track changes and access
- Log all database access and modifications
- Monitor logs for suspicious activities

## 9. Database Performance Optimization

### 9.1 Query Optimization
- Write efficient SQL queries
- Use appropriate indexes
- Avoid unnecessary joins and subqueries
- Use pagination for large result sets

### 9.2 Database Tuning
- Configure database parameters for optimal performance
- Monitor and adjust memory allocation
- Optimize disk I/O
- Use connection pooling

### 9.3 Caching
- Implement application-level caching
- Consider database-level caching options
- Use appropriate cache invalidation strategies

### 9.4 Scaling Strategies
- Consider vertical scaling (increasing resources)
- Plan for horizontal scaling (sharding, replication)
- Use read replicas for read-heavy workloads
- Implement database sharding for large datasets

## 10. Database Maintenance

### 10.1 Regular Maintenance Tasks
- Perform regular database vacuuming (for PostgreSQL)
- Rebuild indexes periodically
- Update database statistics
- Monitor database size and growth

### 10.2 Monitoring
- Monitor database performance metrics
- Set up alerts for performance anomalies
- Monitor disk space usage
- Monitor connection usage

### 10.3 Upgrades
- Plan and test database version upgrades
- Follow a structured upgrade process
- Perform backups before upgrades
- Monitor the system after upgrades

## 11. Data Migration

### 11.1 Migration Strategy
- Use a structured approach to database migrations
- Use migration tools (e.g., Alembic for SQLAlchemy)
- Version control all database schema changes
- Test migrations in a staging environment

### 11.2 Migration Process
- Create migration scripts for schema changes
- Apply migrations in a controlled manner
- Verify migrations after application
- Handle data transformations during migrations

### 11.3 Rollback Plan
- Define a rollback plan for failed migrations
- Test rollback procedures
- Ensure backups are available before migrations
- Monitor the system after migrations

## 12. Data Modeling Best Practices

### 12.1 Normalization
- Follow database normalization principles
- Avoid data redundancy
- Ensure data integrity
- Use appropriate normalization levels (typically 3NF)

### 12.2 Denormalization
- Consider denormalization for performance-critical applications
- Use materialized views for complex queries
- Balance normalization and performance

### 12.3 Naming Conventions
- Use consistent naming conventions for tables, columns, indexes, etc.
- Use descriptive and meaningful names
- Avoid reserved words
- Use singular or plural form consistently for table names

### 12.4 Documentation
- Document all database schemas, relationships, and constraints
- Keep documentation up-to-date with schema changes
- Include data dictionaries for all tables and columns
- Document business rules and data validations

## 13. Database Configuration

### 13.1 Configuration Files
- Store database configuration in `database.py` within the config directory
- Use environment variables for sensitive information (e.g., passwords, connection strings)
- Separate configuration for different environments (development, testing, production)
- Version control configuration files (excluding sensitive information)

### 13.2 Connection Pooling
- Configure connection pooling parameters
- Set appropriate connection timeouts
- Monitor connection pool usage
- Adjust pool size based on workload

## 14. Conclusion

This Database Design Document provides a comprehensive overview of the database structure for the AKS project. By following the guidelines outlined in this document, the project team can ensure that the database is designed, implemented, and maintained in a way that supports the application's functionality while ensuring data integrity, security, and performance. Regular review and updates to this document are recommended as the project evolves and requirements change.