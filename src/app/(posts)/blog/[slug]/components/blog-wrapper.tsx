import { ReactNode } from "react";
import styles from '../../../../md.module.css';

type Props = {
  title: string;
  publishDate: string;
  tag: string;
  children: ReactNode;
};

function BlogWrapper({ ...props }: Props) {
  return (
    <main className={`my-5 ${styles.markdown} w-full`}>
      <div>
        <h5>{props.title}</h5>
        <p className="text-[#63cc79]">{props.publishDate}</p>
        <p className="text-[#52d0ff]">#{props.tag}</p>
      </div>
      <hr className="my-5" />
      <div className="w-full">{props.children}</div>
    </main>
  );
}

export default BlogWrapper;
