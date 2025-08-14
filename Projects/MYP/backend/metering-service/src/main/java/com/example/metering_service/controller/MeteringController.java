package com.example.metering_service.controller;

import com.example.metering_service.model.MeteringRecord;
import com.example.metering_service.service.MeteringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metering")
public class MeteringController {

    private final MeteringService meteringService;

    @Autowired
    public MeteringController(MeteringService meteringService) {
        this.meteringService = meteringService;
    }

    /**
     * 记录资源使用量
     */
    @PostMapping
    public ResponseEntity<MeteringRecord> recordUsage(@RequestBody MeteringRecord meteringRecord) {
        MeteringRecord savedRecord = meteringService.recordUsage(meteringRecord);
        return new ResponseEntity<>(savedRecord, HttpStatus.CREATED);
    }

    /**
     * 获取租户的资源使用统计（按租户ID）
     */
    @GetMapping("/statistics/tenant/{tenantId}")
    public ResponseEntity<Map<String, Double>> getUsageStatisticsByTenantId(
            @PathVariable Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        Map<String, Double> statistics = meteringService.getUsageStatisticsByTenantId(tenantId, start, end);
        return ResponseEntity.ok(statistics);
    }

    /**
     * 获取租户的资源使用统计（按租户编码）
     */
    @GetMapping("/statistics/tenant/code/{tenantCode}")
    public ResponseEntity<Map<String, Double>> getUsageStatisticsByTenantCode(
            @PathVariable String tenantCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        Map<String, Double> statistics = meteringService.getUsageStatisticsByTenantCode(tenantCode, start, end);
        return ResponseEntity.ok(statistics);
    }

    /**
     * 生成租户账单（按租户ID）
     */
    @GetMapping("/bill/tenant/{tenantId}")
    public ResponseEntity<Double> generateBillByTenantId(
            @PathVariable Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        Double billAmount = meteringService.generateBillByTenantId(tenantId, start, end);
        return ResponseEntity.ok(billAmount);
    }

    /**
     * 生成租户账单（按租户编码）
     */
    @GetMapping("/bill/tenant/code/{tenantCode}")
    public ResponseEntity<Double> generateBillByTenantCode(
            @PathVariable String tenantCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        Double billAmount = meteringService.generateBillByTenantCode(tenantCode, start, end);
        return ResponseEntity.ok(billAmount);
    }

    /**
     * 获取未结算的计量记录
     */
    @GetMapping("/unbilled")
    public ResponseEntity<List<MeteringRecord>> getUnbilledRecords() {
        List<MeteringRecord> records = meteringService.getUnbilledRecords();
        return ResponseEntity.ok(records);
    }

    /**
     * 标记计量记录为已结算
     */
    @PostMapping("/mark-billed")
    public ResponseEntity<Void> markRecordsAsBilled(@RequestBody List<Long> recordIds) {
        meteringService.markRecordsAsBilled(recordIds);
        return ResponseEntity.noContent().build();
    }

    /**
     * 获取所有计量记录
     */
    @GetMapping
    public ResponseEntity<List<MeteringRecord>> getAllMeteringRecords() {
        List<MeteringRecord> records = meteringService.getAllMeteringRecords();
        return ResponseEntity.ok(records);
    }

    /**
     * 根据ID获取计量记录
     */
    @GetMapping("/{id}")
    public ResponseEntity<MeteringRecord> getMeteringRecordById(@PathVariable Long id) {
        MeteringRecord record = meteringService.getMeteringRecordById(id);
        if (record != null) {
            return ResponseEntity.ok(record);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除计量记录
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeteringRecord(@PathVariable Long id) {
        meteringService.deleteMeteringRecord(id);
        return ResponseEntity.noContent().build();
    }
}