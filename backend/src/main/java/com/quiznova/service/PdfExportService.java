package com.quiznova.service;

public interface PdfExportService {
    byte[] generateResultPdf(Long attemptId, String userEmail);
}
