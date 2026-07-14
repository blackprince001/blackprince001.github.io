import { getBlogs } from "@/utils/fetch-mdx"
import { parseDate, formatDate } from "@/utils/date"
import Link from "next/link"
import styles from "../home.module.css"

async function BlogPosts() {
  const blogs = await getBlogs()
  const recentBlogs = blogs.slice(0, 6)

  return (
    <section id="writing" className={styles.homeSection} aria-labelledby="writing-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionIndex}>02 / Journal</p>
          <h2 id="writing-title">Recent writing</h2>
        </div>
        <Link href="/blog" className={styles.sectionLink}>
          View all <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.entryList}>
        {recentBlogs.map((item) => (
          <Link key={item.slug} href={`/blog/${item.slug}`} className={styles.entryRow}>
            <span className={styles.entryDate}>
              {formatDate(parseDate(item.frontmatter.publishDate))}
            </span>
            <span className={styles.entryTitle}>{item.frontmatter.title}</span>
            <span className={styles.entryArrow} aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BlogPosts
