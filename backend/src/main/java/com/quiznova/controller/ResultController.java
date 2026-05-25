package com.quiznova.controller;

import com.quiznova.dto.ResultResponseDTO;
import com.quiznova.service.PdfExportService;
import com.quiznova.service.ResultService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/results")
@PreAuthorize("hasRole('USER')")
public class ResultController {

    private final ResultService resultService;
    private final PdfExportService pdfExportService;

    public ResultController(ResultService resultService, PdfExportService pdfExportService) {
        this.resultService = resultService;
        this.pdfExportService = pdfExportService;
    }

    @GetMapping("/{attemptId}")
    public ResponseEntity<ResultResponseDTO> getResult(@PathVariable Long attemptId, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resultService.getResult(attemptId, email));
    }

    @GetMapping("/{attemptId}/download")
    public ResponseEntity<byte[]> downloadResultPdf(@PathVariable Long attemptId, Authentication authentication) {
        String email = authentication.getName();
        byte[] pdfBytes = pdfExportService.generateResultPdf(attemptId, email);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "QuizNova_Result_" + attemptId + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
