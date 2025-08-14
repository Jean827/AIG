package com.example.metering_service.repository;

import com.example.metering_service.model.MeteringRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeteringRecordRepository extends JpaRepository<MeteringRecord, Long> {

    List<MeteringRecord> findByTenantId(Long tenantId);

    List<MeteringRecord> findByTenantCode(String tenantCode);

    List<MeteringRecord> findByResourceType(String resourceType);

    List<MeteringRecord> findByBilledFalse();

    List<MeteringRecord> findByTenantIdAndBilledFalse(Long tenantId);

    List<MeteringRecord> findByUsageTimeBetweenAndTenantId(LocalDateTime start, LocalDateTime end, Long tenantId);

    List<MeteringRecord> findByUsageTimeBetweenAndTenantCode(LocalDateTime start, LocalDateTime end, String tenantCode);

    List<MeteringRecord> findByUsageTimeBetweenAndResourceType(LocalDateTime start, LocalDateTime end, String resourceType);
}