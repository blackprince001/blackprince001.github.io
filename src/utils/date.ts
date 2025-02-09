export function parseDate(dateString: string): Date {
    // First try parsing as ISO string
    const isoDate = new Date(dateString)
    if (!isNaN(isoDate.getTime())) {
        return isoDate
    }

    // Then try parsing common formats
    const formats = [
        // 2024-02-09
        /^\d{4}-\d{2}-\d{2}$/,
        // 09-02-2024
        /^\d{2}-\d{2}-\d{4}$/,
        // 2024/02/09
        /^\d{4}\/\d{2}\/\d{2}$/,
        // February 9, 2024
        /^[A-Za-z]+ \d{1,2}, \d{4}$/,
    ]

    for (const format of formats) {
        if (format.test(dateString)) {
        const parts = dateString.split(/[-/,\s]+/).filter(Boolean)

        if (parts.length === 3) {
            if (parts[0].length === 4) {
            // YYYY-MM-DD
            return new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[2]))
            } else if (parts[2].length === 4) {
            // DD-MM-YYYY
            return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
            }
        }
        }
    }

    throw new Error(`Invalid date format: ${dateString}`)
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export function sortByDate(
    a: { frontmatter: { publishDate: string } },
    b: { frontmatter: { publishDate: string } },
    ): number {
    return parseDate(b.frontmatter.publishDate).getTime() - parseDate(a.frontmatter.publishDate).getTime()
}

  