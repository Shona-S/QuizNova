package com.quiznova.service.impl;

import com.quiznova.dto.ResultResponseDTO;
import com.quiznova.dto.UserAnswerReviewDTO;
import com.quiznova.service.PdfExportService;
import com.quiznova.service.ResultService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfExportServiceImpl implements PdfExportService {

    private final ResultService resultService;

    public PdfExportServiceImpl(ResultService resultService) {
        this.resultService = resultService;
    }

    @Override
    public byte[] generateResultPdf(Long attemptId, String userEmail) {
        ResultResponseDTO result = resultService.getResult(attemptId, userEmail);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 54, 36);
            PdfWriter.getInstance(document, out);

            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font boldBodyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font scoreFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(99, 102, 241)); // Indigo

            // Header Section
            Paragraph mainTitle = new Paragraph("QuizNova - Performance Report", titleFont);
            mainTitle.setAlignment(Element.ALIGN_CENTER);
            mainTitle.setSpacingAfter(5);
            document.add(mainTitle);

            Paragraph subtitle = new Paragraph("Review Sheet & Analytics", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Table of Attempt Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(15);

            addInfoCell(infoTable, "Student Email:", userEmail, boldBodyFont, bodyFont);
            addInfoCell(infoTable, "Quiz Name:", result.getQuizTitle(), boldBodyFont, bodyFont);
            addInfoCell(infoTable, "Subject:", result.getSubjectName(), boldBodyFont, bodyFont);
            addInfoCell(infoTable, "Date:", result.getSubmittedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), boldBodyFont, bodyFont);

            document.add(infoTable);

            // Score card row
            Paragraph scorecardHeader = new Paragraph("SCORE SUMMARY", sectionFont);
            scorecardHeader.setSpacingAfter(8);
            document.add(scorecardHeader);

            PdfPTable scoreTable = new PdfPTable(4);
            scoreTable.setWidthPercentage(100);
            scoreTable.setSpacingAfter(20);

            addScoreCell(scoreTable, "Total Score", result.getScore() + " / " + result.getTotalMarks(), scoreFont, bodyFont);
            addScoreCell(scoreTable, "Percentage", result.getPercentage() + "%", scoreFont, bodyFont);
            addScoreCell(scoreTable, "Correct", String.valueOf(result.getCorrectAnswers()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(16, 185, 129)), bodyFont);
            addScoreCell(scoreTable, "Incorrect", String.valueOf(result.getWrongAnswers()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(239, 68, 68)), bodyFont);

            document.add(scoreTable);

            // Detailed reviews
            Paragraph reviewHeader = new Paragraph("DETAILED ANSWER REVIEW", sectionFont);
            reviewHeader.setSpacingAfter(10);
            document.add(reviewHeader);

            int index = 1;
            for (UserAnswerReviewDTO review : result.getDetailedReview()) {
                Paragraph qTitle = new Paragraph("Q" + index + ": " + review.getQuestionTitle(), boldBodyFont);
                qTitle.setSpacingAfter(4);
                document.add(qTitle);

                // Print choices
                Paragraph choices = new Paragraph(
                        "A) " + review.getOptionA() + "    " +
                                "B) " + review.getOptionB() + "\n" +
                                "C) " + review.getOptionC() + "    " +
                                "D) " + review.getOptionD(),
                        bodyFont
                );
                choices.setIndentationLeft(15);
                choices.setSpacingAfter(6);
                document.add(choices);

                // Print selected vs correct
                Paragraph answers = new Paragraph();
                answers.setIndentationLeft(15);

                String sel = review.getSelectedAnswer() == null || review.getSelectedAnswer().isEmpty() ? "Unanswered" : review.getSelectedAnswer();
                Chunk selectedChunk = new Chunk("Your Answer: " + sel);
                if (review.isCorrect()) {
                    selectedChunk.setFont(FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(16, 185, 129))); // Green
                } else {
                    selectedChunk.setFont(FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(239, 68, 68))); // Red
                }
                answers.add(selectedChunk);

                answers.add(new Chunk("    |    Correct Answer: " + review.getCorrectAnswer(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(16, 185, 129))));
                answers.add(new Chunk("    (" + review.getMarks() + " Marks)", FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)));
                answers.setSpacingAfter(15);

                document.add(answers);
                index++;
            }

            document.close();
            return out.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Error during PDF generation: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error during PDF generation: " + e.getMessage(), e);
        }
    }

    private void addInfoCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, labelFont));
        cellLabel.setBorder(Rectangle.NO_BORDER);
        cellLabel.setPadding(4);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, valueFont));
        cellValue.setBorder(Rectangle.NO_BORDER);
        cellValue.setPadding(4);
        table.addCell(cellValue);
    }

    private void addScoreCell(PdfPTable table, String header, String value, Font valueFont, Font headerFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderWidth(1);
        cell.setBorderColor(Color.LIGHT_GRAY);
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph headPara = new Paragraph(header, headerFont);
        headPara.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(headPara);

        Paragraph valPara = new Paragraph(value, valueFont);
        valPara.setAlignment(Element.ALIGN_CENTER);
        valPara.setSpacingBefore(4);
        cell.addElement(valPara);

        table.addCell(cell);
    }
}
