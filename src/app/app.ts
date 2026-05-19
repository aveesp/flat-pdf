import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { SafeUrlPipe } from './safe-url-pipe';

@Component({
  selector: 'app-root',
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('flatpdfapp');
  flattenedPdfUrl: string | null = null;

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      await this.flattenPdf(arrayBuffer);
    }
  }

  async flattenPdf(pdfBytes: ArrayBuffer) {
    // Load the existing PDF with form fields
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get the interactive form from the PDF
    const form = pdfDoc.getForm();
    
    // Flatten the form to merge fields into the page content
    form.flatten();
    
    // Save the modified PDF
    const flattenedBytes = await pdfDoc.save();
    
    // Create a Blob and URL for viewing/downloading
    const blob = new Blob([flattenedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    this.flattenedPdfUrl = URL.createObjectURL(blob);
  }

  downloadPdf() {
    if (this.flattenedPdfUrl) {
      const link = document.createElement('a');
      link.href = this.flattenedPdfUrl;
      link.download = 'flattened_document.pdf';
      link.click();
    }
  }
}
