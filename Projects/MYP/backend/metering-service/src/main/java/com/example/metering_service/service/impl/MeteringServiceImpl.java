package com.example.metering_service.service.impl;

import com.example.metering_service.model.MeteringRecord;
import com.example.metering_service.repository.MeteringRecordRepository;
import com.example.metering_service.service.MeteringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MeteringServiceImpl implements MeteringService {

    private final MeteringRecordRepository meteringRecordRepository;

    @Autowired
    public MeteringServiceImpl(MeteringRecordRepository meteringRecordRepository) {
        this.meteringRecordRepository = meteringRecordRepository;
    }

    @Override
    public MeteringRecord recordUsage(MeteringRecord meteringRecord) {
        if (meteringRecord.getUsageTime() == null) {
            meteringRecord.setUsageTime(LocalDateTime.now());
        }
        if (meteringRecord.getBilled() == null) {
            meteringRecord.setBilled(false);
        }
        return meteringRecordRepository.save(meteringRecord);
    }

    @Override
    public Map<String, Double> getUsageStatisticsByTenantId(Long tenantId, LocalDateTime start, LocalDateTime end) {
        List<MeteringRecord> records = meteringRecordRepository.findByUsageTimeBetweenAndTenantId(start, end, tenantId);
        return calculateUsageStatistics(records);
    }

    @Override
    public Map<String, Double> getUsageStatisticsByTenantCode(String tenantCode, LocalDateTime start, LocalDateTime end) {
        List<MeteringRecord> records = meteringRecordRepository.findByUsageTimeBetweenAndTenantCode(start, end, tenantCode);
        return calculateUsageStatistics(records);
    }

    @Override
    public Double generateBillByTenantId(Long tenantId, LocalDateTime start, LocalDateTime end) {
        List<MeteringRecord> records = meteringRecordRepository.findByUsageTimeBetweenAndTenantId(start, end, tenantId);
        return calculateBill(records);
    }

    @Override
    public Double generateBillByTenantCode(String tenantCode, LocalDateTime start, LocalDateTime end) {
        List<MeteringRecord> records = meteringRecordRepository.findByUsageTimeBetweenAndTenantCode(start, end, tenantCode);
        return calculateBill(records);
    }

    @Override
    public List<MeteringRecord> getUnbilledRecords() {
        return meteringRecordRepository.findByBilledFalse();
    }

    @Override
    @Transactional
    public void markRecordsAsBilled(List<Long> recordIds) {
        List<MeteringRecord> records = meteringRecordRepository.findAllById(recordIds);
        records.forEach(record -> record.setBilled(true));
        meteringRecordRepository.saveAll(records);
    }

    @Override
    public List<MeteringRecord> getAllMeteringRecords() {
        return meteringRecordRepository.findAll();
    }

    @Override
    public MeteringRecord getMeteringRecordById(Long id) {
        Optional<MeteringRecord> optionalRecord = meteringRecordRepository.findById(id);
        return optionalRecord.orElse(null);
    }

    @Override
    public void deleteMeteringRecord(Long id) {
        meteringRecordRepository.deleteById(id);
    }

    // 辅助方法：计算使用统计
    private Map<String, Double> calculateUsageStatistics(List<MeteringRecord> records) {
        Map<String, Double> statistics = new HashMap<>();
        for (MeteringRecord record : records) {
            String resourceType = record.getResourceType();
            Double usageAmount = record.getUsageAmount();
            statistics.put(resourceType, statistics.getOrDefault(resourceType, 0.0) + usageAmount);
        }
        return statistics;
    }

    // 辅助方法：计算账单金额
    private Double calculateBill(List<MeteringRecord> records) {
        // 这里是一个简化的实现，实际应用中可能需要根据不同的资源类型和计费策略进行计算
        // 为了演示，我们假设所有资源的单价都是1.0
        return records.stream()
                .mapToDouble(MeteringRecord::getUsageAmount)
                .sum();
    }
}