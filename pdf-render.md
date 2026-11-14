# PDF Render Guide

## Command

```bash
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="<output-path>.pdf" \
  "file:///<input-path>.html"
```

## Flags

- `--headless`: render without opening browser window
- `--disable-gpu`: avoid GPU issues in headless mode
- `--no-pdf-header-footer`: remove browser default header (date, title) and footer (URL, page number)
- `--print-to-pdf`: output PDF path

## CSS for print

```css
@page {
  size: A4;
  margin: 13mm 14mm 13mm;
}

/* Prevent row from splitting across pages */
.project-table tr {
  page-break-inside: avoid;
}

@media print {
  html { background: #fff; }
  body {
    max-width: none;
    padding: 0;
  }
}
```

## Notes

- `page-break-inside: avoid` on `tr` keeps table rows intact across page breaks
- Do NOT use `page-break-inside: avoid` on entire project block — causes large blank spaces
- Table border missing at page break is normal browser behavior with `border-collapse: collapse` — not fixable with CSS alone
- Break between rows (where borders exist) is clean; break mid-cell is ugly
