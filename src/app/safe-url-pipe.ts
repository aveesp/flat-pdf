import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  private sanitizer = inject(DomSanitizer);

  transform(value: string | null): SafeResourceUrl {
    if (!value) {
      return '';
    }
    // Explicitly tells Angular this specific blob URL is safe for an iframe
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
